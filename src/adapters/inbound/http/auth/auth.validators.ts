import type { RegisterDTO, LoginDTO } from "../../../../core/use-cases/auth/auth.dtos";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,72}$/;

export type ValidationError = { field: string; message: string };

type ParseOk<T> = { ok: true; value: T };
type ParseFail = { ok: false; errors: ValidationError[] };
type ParseResult<T> = ParseOk<T> | ParseFail;

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function getString(obj: Record<string, unknown>, key: string): string | null {
  const v = obj[key];
  return typeof v === "string" ? v : null;
}

export function parseRegister(body: unknown): ParseResult<RegisterDTO> {
  const errors: ValidationError[] = [];
  if (!isRecord(body)) return { ok: false, errors: [{ field: "body", message: "Body inválido" }] };

  const nombreRaw = getString(body, "nombre");
  const emailRaw = getString(body, "email");
  const passwordRaw = getString(body, "password");

  const nombre = (nombreRaw ?? "").trim();
  const email = (emailRaw ?? "").trim().toLowerCase();
  const password = passwordRaw ?? "";

  if (nombre.length < 3 || nombre.length > 120) {
    errors.push({ field: "nombre", message: "Debe tener entre 3 y 120 caracteres" });
  }
  if (!EMAIL_REGEX.test(email)) {
    errors.push({ field: "email", message: "Correo inválido" });
  }
  if (!PASSWORD_REGEX.test(password)) {
    errors.push({
      field: "password",
      message: "Mín 8, máx 72, 1 mayúscula, 1 minúscula, 1 número y 1 símbolo",
    });
  }

  if (errors.length) return { ok: false, errors };
  return { ok: true, value: { nombre, email, password } };
}

export function parseLogin(body: unknown): ParseResult<LoginDTO> {
  const errors: ValidationError[] = [];
  if (!isRecord(body)) return { ok: false, errors: [{ field: "body", message: "Body inválido" }] };

  const emailRaw = getString(body, "email");
  const passwordRaw = getString(body, "password");

  const email = (emailRaw ?? "").trim().toLowerCase();
  const password = passwordRaw ?? "";

  if (!EMAIL_REGEX.test(email)) errors.push({ field: "email", message: "Correo inválido" });
  if (!password) errors.push({ field: "password", message: "Contraseña requerida" });

  if (errors.length) return { ok: false, errors };
  return { ok: true, value: { email, password } };
}