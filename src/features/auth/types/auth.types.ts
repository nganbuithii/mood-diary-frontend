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
