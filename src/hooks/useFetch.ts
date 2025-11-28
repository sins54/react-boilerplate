import {
  useQuery,
  type UseQueryOptions,
  type QueryKey,
} from "@tanstack/react-query";
import { apiGet } from "../api/generic-api";
import type { AxiosRequestConfig } from "axios";

/**
 * Options for the useFetch hook.
 */
export interface UseFetchOptions<T>
  extends Omit<UseQueryOptions<T, Error>, "queryKey" | "queryFn"> {
  /** Query parameters to pass to the API */
  params?: Record<string, unknown>;
  /** Axios config for custom headers or token override */
  axiosConfig?: AxiosRequestConfig;
}

/**
 * Generic fetch hook that wraps useQuery with apiGet.
 *
 * @param key - The query key for caching (can be string or array)
 * @param url - The API endpoint URL
 * @param options - Additional options including params, axiosConfig, and useQuery options
 * @returns useQuery result with typed data
 *
 * @example
 * // Basic usage
 * const { data, isLoading, error } = useFetch<User[]>('users', '/users');
 *
 * @example
 * // With query parameters
 * const { data } = useFetch<User[]>(
 *   ['users', { status: 'active' }],
 *   '/users',
 *   { params: { status: 'active' } }
 * );
 *
 * @example
 * // With custom token
 * const { data } = useFetch<Data>(
 *   'protected-data',
 *   '/protected',
 *   {
 *     axiosConfig: {
 *       headers: { Authorization: 'Bearer custom-token' }
 *     }
 *   }
 * );
 *
 * @example
 * // With useQuery options
 * const { data } = useFetch<User>(
 *   ['user', userId],
 *   `/users/${userId}`,
 *   {
 *     enabled: !!userId,
 *     staleTime: 5 * 60 * 1000, // 5 minutes
 *     refetchOnWindowFocus: false,
 *   }
 * );
 */
export function useFetch<T>(
  key: QueryKey,
  url: string,
  options?: UseFetchOptions<T>
) {
  const { params, axiosConfig, ...queryOptions } = options ?? {};

  return useQuery<T, Error>({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn: () => apiGet<T>(url, params, axiosConfig),
    ...queryOptions,
  });
}
