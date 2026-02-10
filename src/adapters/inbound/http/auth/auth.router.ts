import { Router } from "express";
import { parseRegister, parseLogin } from "./auth.validators";
import type { RegisterUseCase } from "../../../../core/use-cases/auth/register.usecase";
import type { LoginUseCase } from "../../../../core/use-cases/auth/login.usecase";
import { authMiddleware } from "./auth.middleware";
import type { TokenService } from "../../../../core/ports/token.service";

export function buildAuthRouter(deps: { register: RegisterUseCase; login: LoginUseCase; tokens: TokenService }) {
  const router = Router();

  router.post("/register", authMiddleware(deps.tokens), async (req, res) => {
    const parsed = parseRegister(req.body as unknown);
    if (!parsed.ok) return res.status(400).json({ message: "Datos inválidos", errors: parsed.errors });

    try {
      const result = await deps.register.execute(parsed.value);
      return res.status(201).json(result);
    } catch (e: any) {
      if (e?.message === "EMAIL_ALREADY_EXISTS") return res.status(409).json({ message: "El correo ya existe" });
      return res.status(500).json({ message: "Error interno" });
    }
  });

  router.post("/login", authMiddleware(deps.tokens), async (req, res) => {
    const parsed = parseLogin(req.body as unknown);
    if (!parsed.ok) return res.status(400).json({ message: "Datos inválidos", errors: parsed.errors });

    try {
      const result = await deps.login.execute(parsed.value);
      return res.json(result);
    } catch (e: any) {
      if (e?.message === "INVALID_CREDENTIALS") return res.status(401).json({ message: "Credenciales inválidas" });
      return res.status(500).json({ message: "Error interno" });
    }
  });

  return router;
}