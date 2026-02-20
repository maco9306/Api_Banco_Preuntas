import { SequelizeSingleton } from "./infrastructure/adapters/outbound/db/postgres/sequelize";
import { SequelizeUserRepository } from "./infrastructure/repositories/SequelizeUserRepository";
import { JwtTokenService } from "./infrastructure/adapters/outbound/security/jwt.service";
import { BcryptPasswordHasher } from "./infrastructure/adapters/outbound/security/BcryptPasswordHasher";

import { LoginUseCase } from "./application/auth/login.usecase";
import { RegisterUseCase } from "./application/auth/register.usecase";

export async function buildContainer() {
  const sequelize = SequelizeSingleton.get();
  await sequelize.authenticate();

  const userRepo = new SequelizeUserRepository();
  const hasher = new BcryptPasswordHasher();
  const tokens = new JwtTokenService();

  const auth = {
    register: new RegisterUseCase(userRepo, hasher),
    login: new LoginUseCase(userRepo, hasher),
    tokens,
  };

  return { auth };
}