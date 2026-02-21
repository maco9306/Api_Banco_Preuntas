export type RegisterDTO = {
  nombre: string;
  email: string;
  password_hash: string;
};

export type LoginDTO = {
  email: string;
  password_hash: string;
};