import 'dotenv/config';
import express from "express";
import cors from "cors";
import { Nuclia, Answer } from '@nuclia/core';

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Nuclia SDK. You can set NUCLIA_KB and NUCLIA_TOKEN env vars for real calls.
// Falls back to placeholder KB id so the server still starts.
const nuclia = new Nuclia({
  backend: 'https://nuclia.cloud/api',
  zone: 'europe-1',
  knowledgeBox: process.env.NUCLIA_KB,
  apiKey: process.env.NUCLIA_API_KEY,
});

app.get("/api/health", (_req: express.Request, res: express.Response) => {
  res.json({ status: "ok" });
});

// Reusable handler supporting both GET (query param) and POST (JSON body) requests.
const askHandler = (req: express.Request, res: express.Response) => {
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

  try {
    // Nuclia SDK emits answer objects with fields: answers, answer, incomplete, sources, etc.
    const subscription = (nuclia as any).knowledgeBox.ask(question).subscribe({
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
      if (!finished) {
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

app.post("/api/ask", askHandler);

app.get("/api/products", (_req: express.Request, res: express.Response) => {
  // demo data
  res.json([
    { ProductID: 1, ProductName: "Chai", UnitPrice: 18, UnitsInStock: 39 },
    { ProductID: 2, ProductName: "Chang", UnitPrice: 19, UnitsInStock: 17 },
    { ProductID: 3, ProductName: "Aniseed Syrup", UnitPrice: 10, UnitsInStock: 13 }
  ]);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
