import bcrypt from "bcryptjs";
import type { PasswordHasher } from "../../../../domain/ports/password.hasher"; // ajusta ruta

export class BcryptPasswordHasher implements PasswordHasher {
  private readonly saltRounds = 12;

  async hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, this.saltRounds);
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}