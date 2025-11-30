import axios, {
  type AxiosInstance,
  type AxiosError,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import { toast } from "sonner";

/**
 * Storage key for the authentication token.
 */
const AUTH_TOKEN_KEY = "auth_token";

/**
 * Storage key for the current organization ID.
 */
const ORG_ID_KEY = "nexus_org_id";

/**
 * Get the current organization ID from localStorage.
 */
export const getCurrentOrgId = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ORG_ID_KEY);
};

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
 * Extended Axios request config with toast metadata.
 */
export interface ApiRequestMeta {
  /** Show success toast on successful response */
  successToast?: boolean;
  /** Custom success message (overrides default) */
  successMessage?: string;
  /** Disable all automatic toast notifications for this request */
  disableToast?: boolean;
}

// Extend Axios types to include meta
declare module "axios" {
  interface InternalAxiosRequestConfig {
    meta?: ApiRequestMeta;
  }
  interface AxiosRequestConfig {
    meta?: ApiRequestMeta;
  }
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

  // Request interceptor - attach Authorization header and x-org-id header
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Allow overriding the token via config headers
      if (!config.headers.Authorization) {
        const token = getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      
      // Inject x-org-id header if an organization is selected
      // Allow overriding via config headers
      if (!config.headers['x-org-id']) {
        const orgId = getCurrentOrgId();
        if (orgId) {
          config.headers['x-org-id'] = orgId;
        }
      }
      
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor - handle global errors and toast notifications
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      const meta = response.config.meta;

      // Show success toast if enabled via meta flag
      if (meta?.successToast && !meta?.disableToast) {
        const message = meta.successMessage || "Operation completed successfully";
        toast.success(message);
      }

      return response;
    },
    (error: AxiosError<ApiError>) => {
      const status = error.response?.status;
      const meta = error.config?.meta;
      const shouldShowToast = !meta?.disableToast;

      if (status === 401) {
        // Unauthorized - clear token and redirect to login
        removeAuthToken();
        // Dispatch a custom event for auth context to handle
        window.dispatchEvent(new CustomEvent("auth:unauthorized"));
      } else if (status === 403) {
        const message =
          error.response?.data?.message ||
          "You do not have permission to perform this action";

        // Show toast for forbidden errors
        if (shouldShowToast) {
          toast.error(message);
        }

        // Dispatch event for toast notification (legacy support)
        window.dispatchEvent(
          new CustomEvent("auth:forbidden", {
            detail: { message },
          })
        );
      } else if (status && status >= 500 && shouldShowToast) {
        // Server error - show toast notification
        const message =
          error.response?.data?.message ||
          "An unexpected server error occurred. Please try again later.";
        toast.error(message);
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
