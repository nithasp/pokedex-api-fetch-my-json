import axios, { AxiosError, AxiosInstance } from "axios";
import { env } from "@/env";

const api: AxiosInstance = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

/**
 * Convert any axios error to a friendly message string. The Pokedex API does
 * not require auth, so this simply normalises the error shape for callers.
 */
export const buildApiErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosErr = error as AxiosError<{ message?: string; error?: string }>;
    if (axiosErr.response) {
      const { status, data } = axiosErr.response;
      return data?.message || data?.error || `Request failed with status ${status}`;
    }
    if (axiosErr.request) {
      return "No response from server. Please check your internet connection.";
    }
    return axiosErr.message || "An unknown error occurred";
  }
  if (error instanceof Error) return error.message;
  return "An unknown error occurred";
};

export default api;
