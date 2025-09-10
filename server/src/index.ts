import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (_req: express.Request, res: express.Response) => {
  res.json({ status: "ok" });
});

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
