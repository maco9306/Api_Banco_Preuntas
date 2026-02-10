import "dotenv/config";
import express from "express";
import { env } from "./config/env";

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT ?? 3000);
app.listen(env.PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
