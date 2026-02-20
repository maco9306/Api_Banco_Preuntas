import express from "express";
import { buildAuthRouter } from "./infrastructure/adapters/inbound/http/auth/auth.router";
// ...otros

export function buildApp(deps: any) {
  const app = express();
  app.use(express.json());

  app.use("/auth", buildAuthRouter(deps.auth));

  return app;
}