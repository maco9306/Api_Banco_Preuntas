import "dotenv/config";
import express from "express";
import { env } from "./config/env";
import { PostgresPoolSingleton } from "./adapters/outbound/db/postgres/postgres.pool";

const app = express();
app.use(express.json());

app.get("/db-check", async (_req, res) => {
  try {
    const db = PostgresPoolSingleton.get();
    const result = await db.query("SELECT NOW() as now");
    res.json({ ok: true, dbTime: result.rows[0].now });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "DB connection failed",
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

app.listen(env.PORT, () => {
  console.log(`API running on http://localhost:${env.PORT}`);
});
