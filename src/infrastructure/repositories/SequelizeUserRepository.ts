import { UserRepository, User } from "../../domain/ports/user.repository";
import { UserModel } from "../adapters/outbound/db/postgres/UserModel";

export class SequelizeUserRepository implements UserRepository {

  async findByEmail(email: string): Promise<User | null> {
    const row = await UserModel.findOne({ where: { email } });

    if (!row) return null;

    return {
      id: row.id,
      nombre: row.nombre,
      email: row.email,
      password_hash: row.password_hash,
    };
  }

  async create(input: { nombre: string; email: string; password_hash: string }): Promise<User> {
    const row = await UserModel.create(input);

    return {
      id: row.id,
      nombre: row.nombre,
      email: row.email,
      password_hash: row.password_hash,
    };
  }
}