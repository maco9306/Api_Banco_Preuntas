import type { RegisterDTO } from "./auth.dtos";
import type { UserRepository } from "../../domain/ports/user.repository";
import type { PasswordHasher } from "../../domain/ports/password.hasher";

export class RegisterUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher
  ) {}

  async execute(dto: RegisterDTO): Promise<{ id: number; email: string }> {
    const exists = await this.userRepository.findByEmail(dto.email);
    if (exists) {
      throw new Error("EMAIL_ALREADY_EXISTS");
    }

    const passwordHash = await this.passwordHasher.hash(dto.password);

    const user = await this.userRepository.create({
      nombre: dto.nombre,
      email: dto.email,
      passwordHash,
    });

    return {
      id: user.id,
      email: user.email,
    };
  }
}