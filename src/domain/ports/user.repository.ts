export type CreateUserInput = {
  nombre: string;
  email: string;
  passwordHash: string;
};

export type User = {
  id: number;
  nombre: string;
  email: string;
  passwordHash: string;
};

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(input: CreateUserInput): Promise<User>;
}
