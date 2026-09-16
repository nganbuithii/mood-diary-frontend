import axios from "axios";

import { apiBaseUrl } from "@/lib/env";
import { ApiError } from "@/lib/api/http-error";

interface ErrorResponseBody {
  message?: string | string[];
}

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10_000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error);
    }

    if (!error.response) {
      return Promise.reject(
        new ApiError(0, "Unable to reach the server. Please try again."),
      );
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
