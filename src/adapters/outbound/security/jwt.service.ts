import * as jwt from "jsonwebtoken";
import type { Secret, SignOptions } from "jsonwebtoken";
import { env } from "../../../config/env";
import type { TokenService, JwtPayload } from "../../../core/ports/token.service";

export function mustHave<T>(value: T | undefined | null, name: string): T {
  if (value === undefined || value === null || value === "") {
    throw new Error(`${name} is required`);
  }
  return value;
}

export class JwtTokenService implements TokenService {
  sign(payload: JwtPayload): string {
    const secret: Secret = mustHave(env.JWT_SECRET, "JWT_SECRET");
    const options: SignOptions = { expiresIn: "1h" };

    return jwt.sign(payload, secret, options);
  }

  verify(token: string): JwtPayload {
    const secret: Secret = mustHave(env.JWT_SECRET, "JWT_SECRET");
    const decoded = jwt.verify(token, secret);

    // jwt.verify puede devolver string | JwtPayload (de jsonwebtoken)
    if (typeof decoded === "string") {
      throw new Error("INVALID_TOKEN");
    }

    if (typeof decoded.sub === "undefined" || typeof decoded.email !== "string") {
      throw new Error("INVALID_TOKEN");
    }

    return { sub: Number(decoded.sub), email: decoded.email };
  }
}