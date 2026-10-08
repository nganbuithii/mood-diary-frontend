import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

import { apiBaseUrl } from "@/lib/env";
import { ApiError } from "@/lib/api/http-error";
import { HTTP_STATUS } from "@/lib/api/http-status";
import { AUTH_ENDPOINTS } from "@/features/auth/constants/endpoints";
import { currentLocationPath, loginPathFor } from "@/features/auth/utils/auth-redirect";
import { SECOND_MS } from "@/lib/constants/time";

interface ErrorResponseBody {
  message?: string | string[];
}

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  timeout: 30 * SECOND_MS,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let pendingRequests: Array<(shouldRetry: boolean) => void> = [];

function resolvePendingRequests(shouldRetry: boolean) {
  pendingRequests.forEach((resolve) => resolve(shouldRetry));
  pendingRequests = [];
}

const NO_REFRESH_URLS = new Set<string>([
  AUTH_ENDPOINTS.REFRESH,
  AUTH_ENDPOINTS.LOGIN,
  AUTH_ENDPOINTS.REGISTER,
  AUTH_ENDPOINTS.LOGOUT,
  AUTH_ENDPOINTS.FORGOT_PASSWORD,
  AUTH_ENDPOINTS.RESET_PASSWORD,
]);

function toApiError(error: AxiosError): ApiError {
  if (!error.response) {
    return new ApiError(
      HTTP_STATUS.NETWORK_ERROR,
      error.code === "ECONNABORTED"
        ? "The server took too long to respond. Please try again."
        : "Unable to reach the server. Please try again.",
    );
  }

  const data = error.response.data as ErrorResponseBody | undefined;
  const message = Array.isArray(data?.message) ? data.message[0] : data?.message;

  return new ApiError(
    error.response.status,
    message ?? "Something went wrong. Please try again.",
    Array.isArray(data?.message) ? data.message : undefined,
  );
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as RetryableRequestConfig | undefined;
    const shouldRefresh =
      error.response?.status === HTTP_STATUS.UNAUTHORIZED &&
      originalRequest &&
      !originalRequest._retry &&
      !NO_REFRESH_URLS.has(originalRequest.url ?? "");

    if (!shouldRefresh) {
      return Promise.reject(toApiError(error));
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      const shouldRetry = await new Promise<boolean>((resolve) => {
        pendingRequests.push(resolve);
      });

      return shouldRetry ? apiClient(originalRequest) : Promise.reject(toApiError(error));
    }

    isRefreshing = true;

    try {
      await apiClient.post(AUTH_ENDPOINTS.REFRESH);
      isRefreshing = false;
      resolvePendingRequests(true);

      return apiClient(originalRequest);
    } catch (refreshError) {
      isRefreshing = false;
      resolvePendingRequests(false);

      if (typeof window !== "undefined" && originalRequest.url !== AUTH_ENDPOINTS.ME) {
        window.location.href = loginPathFor(currentLocationPath());
      }

      return Promise.reject(refreshError);
    }
  },
);
