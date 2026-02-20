import { Router } from "express";
import { parseRegister, parseLogin } from "./auth.validators";
import type { RegisterUseCase } from "../../../../../application/auth/register.usecase";
import type { LoginUseCase } from "../../../../../application/auth/login.usecase";
import { authMiddleware } from "./auth.middleware";
import type { TokenService } from "../../../../../domain/ports/token.service";

export function buildAuthRouter(deps: { register: RegisterUseCase; login: LoginUseCase; tokens: TokenService }) {
  const router = Router();

  router.post("/register", async (req, res) => {
    const parsed = parseRegister(req.body);
    if (!parsed.ok) return res.status(400).json({ message: "Datos inválidos", errors: parsed.errors });

    try {
      const result = await deps.register.execute(parsed.value);
      return res.status(201).json(result);
    } catch (e: any) {
      if (e?.message === "EMAIL_ALREADY_EXISTS") return res.status(409).json({ message: "El correo ya existe" });
      return res.status(500).json({ message: "Error interno" });
    }
  });

  router.post("/login", async (req, res) => {
    const parsed = parseLogin(req.body);
    if (!parsed.ok) return res.status(400).json({ message: "Datos inválidos", errors: parsed.errors });

    try {
      const result = await deps.login.execute(parsed.value);
      return res.json(result);
    } catch (e: any) {
      if (e?.message === "INVALID_CREDENTIALS") return res.status(401).json({ message: "Credenciales inválidas" });
      return res.status(500).json({ message: "Error interno" });
    }
  });

  // ejemplo de ruta protegida
  router.get("/me", authMiddleware(deps.tokens), (req, res) => {
    return res.json({ auth: req.auth });
  });

  return router;
}