import axios, { AxiosInstance, AxiosError } from "axios";
import { AUTH_ROUTES } from "@/lib/apiRoutes";

/**
 * API Base URL Configuration
 * Loaded from environment variable: NEXT_PUBLIC_BACKEND_URL
 * Default: http://localhost:8080 (for local development)
 */
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

/**
 * Create axios instance with default configuration
 */
const api: AxiosInstance = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Token Queue Management
 * When multiple requests fail due to 401, we queue them
 * and retry after successful token refresh
 */
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string) => void;
  reject: (reason?: any) => void;
}> = [];

/**
 * Process the queue of failed requests
 * @param error - Error object or null if successful
 * @param token - New access token (if successful refresh)
 */
const processQueue = (error: any | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      if (token) {
        prom.resolve(token);
      } else {
        prom.reject(new Error("Token refresh failed or no token provided."));
      }
    }
  });
  failedQueue = []; // Clear queue after processing
};

/**
 * Request Interceptor
 * Attaches access token to outgoing requests
 */
api.interceptors.request.use(
  async (config) => {
    // Retrieve access token from localStorage
    const accessToken = localStorage.getItem("accessToken");
    
    if (accessToken) {
      // Add token to Authorization header
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles 401 Unauthorized responses and auto-refreshes tokens
 */
api.interceptors.response.use(
  (response) => response, // Success: return response as-is
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    /**
     * Check if:
     * 1. Error is 401 Unauthorized
     * 2. This is not a retry attempt
     */
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If token refresh is already in progress, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            // Update authorization header with new token
            originalRequest.headers.Authorization = `Bearer ${token}`;
            // Retry original request
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      // Mark request as retry attempt
      originalRequest._retry = true;
      // Set flag indicating token refresh is in progress
      isRefreshing = true;

      // Retrieve refresh token from localStorage
      const refreshToken = localStorage.getItem("refreshToken");

      /**
       * If no refresh token available, clear tokens and redirect to login
       */
      if (!refreshToken) {
        processQueue(error, null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/";
        return Promise.reject(error);
      }

      try {
        /**
         * Call refresh token endpoint
         * Expects response: { accessToken: string, refreshToken: string }
         */
        const response = await axios.post(
          `${BACKEND_URL}${AUTH_ROUTES.REFRESH_TOKEN}`,
          { refreshToken },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          response.data;

        /**
         * Store new tokens in localStorage
         */
        localStorage.setItem("accessToken", newAccessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        /**
         * Update authorization header for default requests
         */
        api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

        /**
         * Update authorization header for the original failed request
         */
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        /**
         * Process queued requests with new token
         */
        processQueue(null, newAccessToken);

        /**
         * Retry original request with new token
         */
        return api(originalRequest);
      } catch (refreshError) {
        /**
         * Token refresh failed
         * Clear all tokens and redirect to login
         */
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        processQueue(refreshError, null);
        window.location.href = "/";
        return Promise.reject(refreshError);
      } finally {
        /**
         * Reset refreshing flag
         */
        isRefreshing = false;
      }
    }

    /**
     * For any other error type, just propagate it
     */
    return Promise.reject(error);
  }
);

export default api;