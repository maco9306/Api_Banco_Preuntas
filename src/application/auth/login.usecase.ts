import type { LoginDTO } from "./auth.dtos";
import type { UserRepository } from "../../domain/ports/user.repository";
import type { PasswordHasher } from "../../domain/ports/password.hasher";

export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher
  ) {}

  async execute(dto: LoginDTO): Promise<{ id: number; email: string }> {
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      throw new Error("INVALID_CREDENTIALS");
    }

    const ok = await this.passwordHasher.compare(dto.password, user.passwordHash);
    if (!ok) {
      throw new Error("INVALID_CREDENTIALS");
    }

    return {
      id: user.id,
      email: user.email,
    };
  }
}