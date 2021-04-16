export interface TokenType {
  access_token: string;
  token_type: string;
}

export interface UserType {
  userName: string | null;
  token: TokenType;
}
