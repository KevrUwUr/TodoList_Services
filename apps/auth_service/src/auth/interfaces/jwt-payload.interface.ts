export interface JwtPayload {
  sub: number; // user_id
  username: string;
  email: string;
  roles?: string[];
  iat?: number;
  exp?: number;
}
