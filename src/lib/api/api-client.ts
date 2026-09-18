import axios, { type InternalAxiosRequestConfig } from "axios";

import { apiBaseUrl } from "@/lib/env";
import { ApiError } from "@/lib/api/http-error";
import { ENDPOINTS } from "@/features/auth/constants/endpoints";

interface ErrorResponseBody {
  message?: string | string[];
}

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10_000,
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
      return Promise.reject(
        new ApiError(0, "Unable to reach the server. Please try again."),
      );
    }

    const originalRequest = error.config as RetryableRequestConfig | undefined;
    const isRefreshCall = originalRequest?.url === ENDPOINTS.REFRESH;

    if (
      error.response.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isRefreshCall
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

        if (typeof window !== "undefined") {
          // Interceptor runs outside React, so router hooks aren't available here.
          // eslint-disable-next-line @next/next/no-location-assign-relative-destination
          window.location.href = "/login";
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
