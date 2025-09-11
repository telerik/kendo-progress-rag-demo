import 'dotenv/config';
import express from "express";
import cors from "cors";
import { Nuclia } from '@nuclia/core';

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Nuclia SDK. You can set NUCLIA_KB and NUCLIA_TOKEN env vars for real calls.
// Falls back to placeholder KB id so the server still starts.
const nuclia = new Nuclia({
  backend: 'https://nuclia.cloud/api',
  zone: 'europe-1',
  knowledgeBox: process.env.NUCLIA_KB,
  apiKey: process.env.NUCLIA_API_KEY as string,
});

app.get("/api/health", (_req: express.Request, res: express.Response) => {
  res.json({ status: "ok" });
});

// Reusable handler supporting both GET (query param) and POST (JSON body) requests.
const askHandler = (req: express.Request, res: express.Response) => {
  const { question, options } = req.body;

  let responded = false;

  const timeout = setTimeout(() => {
    if (!responded) {
      responded = true;
      res.status(504).json({ error: 'Ask request timed out' });
    }
  }, 15000);

  try {
    const subscription = (nuclia as any).knowledgeBox.ask(question).subscribe({
      next: (result: any) => {
        if (responded) return;
        responded = true;
        clearTimeout(timeout);
        // Attempt to extract a concise answer & sources if present.
        let answer: string | undefined;
        let sources: any[] | undefined;
        if (result) {
          // Heuristics based on typical Nuclia answer structure.
            // result.answers[0].answer or result.answer
          if (Array.isArray(result.answers) && result.answers.length) {
            const first = result.answers[0];
            answer = first.answer || first.text || first.value || undefined;
            sources = first.sources || first.context || undefined;
          }
          answer = answer || (result.answer || result.text || result.value);
          if (!sources && Array.isArray(result.sources)) sources = result.sources;
        }
        res.json({
          question,
          answer: answer || null,
          sources: sources || [],
          raw: result,
        });
      },
      error: (err: any) => {
        if (responded) return;
        responded = true;
        clearTimeout(timeout);
        res.status(500).json({ error: err?.message || 'Ask failed' });
      }
    });

    // Ensure subscription is cleaned up on connection close to avoid leaks.
    res.on('close', () => {
      if (!responded) {
        subscription.unsubscribe();
        clearTimeout(timeout);
      }
    });
  } catch (err: any) {
    if (!responded) {
      responded = true;
      clearTimeout(timeout);
      res.status(500).json({ error: err?.message || 'Ask failed (exception)' });
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
