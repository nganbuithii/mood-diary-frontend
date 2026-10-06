import axios, { type InternalAxiosRequestConfig } from "axios";

import { apiBaseUrl } from "@/lib/env";
import { ApiError } from "@/lib/api/http-error";
import { HTTP_STATUS } from "@/lib/api/http-status";
import { ENDPOINTS } from "@/features/auth/constants/endpoints";
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

apiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error);
    }

    if (!error.response) {
      if (error.code === "ECONNABORTED") {
        return Promise.reject(
          new ApiError(HTTP_STATUS.NETWORK_ERROR, "The server took too long to respond. Please try again."),
        );
      }

      return Promise.reject(
        new ApiError(HTTP_STATUS.NETWORK_ERROR, "Unable to reach the server. Please try again."),
      );
    }

    const originalRequest = error.config as RetryableRequestConfig | undefined;
    const isAuthEntryCall =
      originalRequest?.url === ENDPOINTS.REFRESH ||
      originalRequest?.url === ENDPOINTS.LOGIN ||
      originalRequest?.url === ENDPOINTS.REGISTER ||
      originalRequest?.url === ENDPOINTS.LOGOUT ||
      originalRequest?.url === ENDPOINTS.FORGOT_PASSWORD ||
      originalRequest?.url === ENDPOINTS.RESET_PASSWORD;

    if (
      error.response.status === HTTP_STATUS.UNAUTHORIZED &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthEntryCall
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        const shouldRetry = await new Promise<boolean>((resolve) => {
          pendingRequests.push(resolve);
        });

        return shouldRetry ? apiClient(originalRequest) : Promise.reject(error);
      }

      isRefreshing = true;

      try {
        await apiClient.post(ENDPOINTS.REFRESH);
        isRefreshing = false;
        resolvePendingRequests(true);

        return apiClient(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        resolvePendingRequests(false);

        if (typeof window !== "undefined" && originalRequest.url !== ENDPOINTS.ME) {
          window.location.href = loginPathFor(currentLocationPath());
        }

        return Promise.reject(refreshError);
      }
    }

    const data = error.response.data as ErrorResponseBody | undefined;
    const message = Array.isArray(data?.message)
      ? data.message[0]
      : data?.message;

    return Promise.reject(
      new ApiError(
        error.response.status,
        message ?? "Something went wrong. Please try again.",
        Array.isArray(data?.message) ? data.message : undefined,
      ),
    );
  },
);
