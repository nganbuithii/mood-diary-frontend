export interface RegisterRequest {
  displayName: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  id: string;
  displayName: string;
  email: string;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  displayName: string;
  email: string;
  createdAt: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  user: AuthUser;
}
