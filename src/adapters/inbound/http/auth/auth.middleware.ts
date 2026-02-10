import type { Request, Response, NextFunction } from "express";
import type { TokenService, JwtPayload } from "../../../../core/ports/token.service";

declare global {
  namespace Express {
    interface Request {
      auth?: JwtPayload;
    }
  }
}

export function authMiddleware(tokens: TokenService) {
  return (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token requerido" });
    }

    const token = header.slice("Bearer ".length).trim();

    try {
      const payload = tokens.verify(token);
      req.auth = payload;
      next();
    } catch {
      return res.status(401).json({ message: "Token inválido o expirado" });
    }
  };
}