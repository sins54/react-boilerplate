import axios, {
  type AxiosInstance,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

/**
 * Storage key for the authentication token.
 */
const AUTH_TOKEN_KEY = "auth_token";

/**
 * Get the authentication token from localStorage.
 */
export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

/**
 * Set the authentication token in localStorage.
 */
export const setAuthToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }
};

/**
 * Remove the authentication token from localStorage.
 */
export const removeAuthToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
};

/**
 * API error response structure.
 */
export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

/**
 * Create and configure the Axios instance.
 */
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
    timeout: 30000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Request interceptor - attach Authorization header
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Allow overriding the token via config headers
      if (!config.headers.Authorization) {
        const token = getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor - handle global errors
  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiError>) => {
      const status = error.response?.status;

      if (status === 401) {
        // Unauthorized - clear token and redirect to login
        removeAuthToken();
        // Dispatch a custom event for auth context to handle
        window.dispatchEvent(new CustomEvent("auth:unauthorized"));
      } else if (status === 403) {
        // Forbidden - dispatch event for toast notification
        window.dispatchEvent(
          new CustomEvent("auth:forbidden", {
            detail: {
              message:
                error.response?.data?.message ||
                "You do not have permission to perform this action",
            },
          })
        );
      }

      return Promise.reject(error);
    }
  );

  return client;
};

/**
 * Configured Axios instance for API calls.
 */
export const apiClient = createApiClient();

export default apiClient;
