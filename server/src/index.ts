import 'dotenv/config';
import express from "express";
import cors from "cors";
import { ChatOptions, Nuclia, ResourceProperties } from '@nuclia/core';
import { chartJsonSchema } from './schemas/charts-json-schema';

const app = express();
app.use(cors());
app.use(express.json());

const nuclia_react_docs: Nuclia = new Nuclia({
  backend: 'https://nuclia.cloud/api',
  zone: 'europe-1',
  knowledgeBox: process.env.NUCLIA_KB,
  apiKey: process.env.NUCLIA_API_KEY,
});

const nuclia_fin_charts: Nuclia = new Nuclia({
  backend: 'https://nuclia.cloud/api',
  zone: 'aws-eu-central-1-1',
  knowledgeBox: process.env.NUCLIA_FIN_KB,
  apiKey: process.env.NUCLIA_FIN_API_KEY,
});

app.get("/api/health", (_req: express.Request, res: express.Response) => {
  res.json({ status: "ok" });
});

// Reusable handler supporting both GET (query param) and POST (JSON body) requests.
const askHandler = (req: express.Request, res: express.Response, use_fin_kb: boolean, chatOptions?: ChatOptions) => {
  const { question, options } = req.body;

  // Set up Server-Sent Events (SSE) headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  let finished = false;
  const timeout = setTimeout(() => {
    if (!finished) {
      finished = true;
      res.write(`event: error\ndata: {\"error\":\"Ask request timed out\"}\n\n`);
      res.end();
    }
  }, 15000);

  const kb = use_fin_kb ? nuclia_fin_charts : nuclia_react_docs;

  try {
    // Nuclia SDK emits answer objects with fields: answers, answer, incomplete, sources, etc.
    const subscription = kb.knowledgeBox.ask(question, [], [], chatOptions).subscribe({
      next: (result: any) => {
        if (finished) return;
        let answer, sources;
        if (result) {
          if (Array.isArray(result.answers) && result.answers.length) {
            const first = result.answers[0];
            answer = first.answer || first.text || first.value || undefined;
            sources = first.sources || first.context || undefined;
          }
          answer = answer || (result.answer || result.text || result.value);
          if (!sources && Array.isArray(result.sources)) sources = result.sources;
        }
        res.write(`data: ${JSON.stringify({
          question,
          answer: answer || null,
          incomplete: result.incomplete,
          sources: sources || [],
          json: result?.jsonAnswer || null,
          raw: result,
        })}\n\n`);
        if (!result.incomplete) {
          finished = true;
          clearTimeout(timeout);
          res.end();
        }
      },
      error: (err: any) => {
        if (finished) return;
        finished = true;
        clearTimeout(timeout);
        res.write(`event: error\ndata: {\"error\":\"${err?.message || 'Ask failed'}\"}\n\n`);
        res.end();
      },
      complete: () => {
        if (!finished) {
          finished = true;
          clearTimeout(timeout);
          res.end();
        }
      }
    });

    // Clean up subscription on connection close
    res.on('close', () => {
      if (!subscription.closed) {
        subscription.unsubscribe();
        clearTimeout(timeout);
      }
    });
  } catch (err: any) {
    if (!finished) {
      finished = true;
      clearTimeout(timeout);
      res.write(`event: error\ndata: {\"error\":\"${err?.message || 'Ask failed (exception)'}\"}\n\n`);
      res.end();
    }
  }
};

app.post("/api/ask", (req: express.Request, res: express.Response) => {
  return askHandler(req, res, false);
});

app.post("/api/ask-charts", (req: express.Request, res: express.Response) => {
  req.body.question = req.body.question.trim();

  var chatOptions: ChatOptions =
  {
    synchronous: false, // asynchronous streaming mode
    citations: false, // do not include citations in the answer
    show: [ResourceProperties.BASIC], // include basic metadata in sources
    answer_json_schema: chartJsonSchema, // request structured JSON output
    // prompt: { system: finChartSystemPrompt },
    // autofilter: true // enables automatic filtering of identified NERs
  };

  return askHandler(req, res, true, chatOptions);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
