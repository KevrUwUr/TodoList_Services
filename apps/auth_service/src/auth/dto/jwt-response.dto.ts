export interface JwtResponseDto {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  user: {
    user_id: number;
    username: string;
    email: string;
    roles?: string[];
  };
}
