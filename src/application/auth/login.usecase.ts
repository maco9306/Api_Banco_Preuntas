import type { LoginDTO } from "./auth.dtos";
import type { UserRepository } from "../../domain/ports/user.repository";
import type { PasswordHasher } from "../../domain/ports/password.hasher";
import type { TokenService } from "../../domain/ports/token.service";

export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokens: TokenService
  ) {}

  async execute(dto: LoginDTO): Promise<{ token: string; user: { id: number; email: string } }> {
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) throw new Error("INVALID_CREDENTIALS");

    const ok = await this.passwordHasher.compare(dto.password_hash, user.password_hash);
    if (!ok) throw new Error("INVALID_CREDENTIALS");

    const token = this.tokens.sign({
      sub: user.id,
      email: user.email,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }
}