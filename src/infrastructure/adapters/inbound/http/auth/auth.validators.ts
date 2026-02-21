import Joi from "joi";
import type { RegisterDTO, LoginDTO } from "../../../../../application/auth/auth.dtos";

export type ValidationError = { field: string; message: string };

type ParseOk<T> = { ok: true; value: T };
type ParseFail = { ok: false; errors: ValidationError[] };
export type ParseResult<T> = ParseOk<T> | ParseFail;

const registerSchema = Joi.object<RegisterDTO>({
  nombre: Joi.string().min(3).max(120).required().messages({
    "string.base": "Nombre debe ser texto",
    "string.empty": "Nombre requerido",
    "string.min": "Debe tener al menos 3 caracteres",
    "string.max": "Debe tener máximo 120 caracteres",
    "any.required": "Nombre requerido",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Correo inválido",
    "string.empty": "Correo requerido",
    "any.required": "Correo requerido",
  }),
  password_hash: Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,72}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Mín 8, máx 72, 1 mayúscula, 1 minúscula, 1 número y 1 símbolo",
      "string.empty": "Contraseña requerida",
      "any.required": "Contraseña requerida",
    }),
}).options({ abortEarly: false, stripUnknown: true });

const loginSchema = Joi.object<LoginDTO>({
  email: Joi.string().email().required().messages({
    "string.email": "Correo inválido",
    "string.empty": "Correo requerido",
    "any.required": "Correo requerido",
  }),
  password_hash: Joi.string().required().messages({
    "string.empty": "Contraseña requerida",
    "any.required": "Contraseña requerida",
  }),
}).options({ abortEarly: false, stripUnknown: true });

function toValidationErrors(err: Joi.ValidationError): ValidationError[] {
  return err.details.map((d) => ({
    field: d.path.join(".") || "body",
    message: d.message,
  }));
}

export function parseRegister(body: unknown): ParseResult<RegisterDTO> {
  const { error, value } = registerSchema.validate(body);
  if (error) return { ok: false, errors: toValidationErrors(error) };
  return { ok: true, value: value as RegisterDTO };
}

export function parseLogin(body: unknown): ParseResult<LoginDTO> {
  const { error, value } = loginSchema.validate(body);
  if (error) return { ok: false, errors: toValidationErrors(error) };
  return { ok: true, value: value as LoginDTO };
}