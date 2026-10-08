import { apiClient } from "@/lib/api/api-client";
import { AUTH_ENDPOINTS } from "@/features/auth/constants/endpoints";
import type {
  AuthUser,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ResetPasswordRequest,
} from "@/features/auth/types/auth.types";

export async function loginUser(payload: LoginRequest): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>(AUTH_ENDPOINTS.LOGIN, payload);
  return data;
}

export async function registerUser(payload: RegisterRequest): Promise<RegisterResponse> {
  const { data } = await apiClient.post<RegisterResponse>(AUTH_ENDPOINTS.REGISTER, payload);
  return data;
}

export async function logoutUser(): Promise<void> {
  await apiClient.post(AUTH_ENDPOINTS.LOGOUT);
}

export async function getCurrentUser(): Promise<AuthUser> {
  const { data } = await apiClient.get<AuthUser>(AUTH_ENDPOINTS.ME);
  return data;
}

export async function changePassword(payload: ChangePasswordRequest): Promise<void> {
  await apiClient.post(AUTH_ENDPOINTS.CHANGE_PASSWORD, payload);
}

export async function forgotPassword(payload: ForgotPasswordRequest): Promise<void> {
  await apiClient.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, payload);
}

export async function resetPassword(payload: ResetPasswordRequest): Promise<void> {
  await apiClient.post(AUTH_ENDPOINTS.RESET_PASSWORD, payload);
}
