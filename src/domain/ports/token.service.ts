export type JwtPayload = {
  sub: number;
  email: string;
};

export interface TokenService {
  sign(payload: JwtPayload): string;
  verify(token: string): JwtPayload;
}