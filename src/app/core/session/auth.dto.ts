export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  expiresIn: number;
  tokenType: string
  user: {
    email: string;
    displayName: string;
    role: string;
  }
}
