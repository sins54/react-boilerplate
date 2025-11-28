import type { AxiosRequestConfig, AxiosResponse } from "axios";
import { apiClient } from "./client";

/**
 * Generic GET request.
 *
 * @param url - The endpoint URL
 * @param params - Optional query parameters
 * @param config - Optional Axios config (can override token via headers.Authorization)
 * @returns Promise with the response data
 *
 * @example
 * // Basic usage
 * const users = await apiGet<User[]>('/users');
 *
 * @example
 * // With query parameters
 * const user = await apiGet<User>('/users', { id: '123' });
 *
 * @example
 * // Override token for specific request
 * const data = await apiGet<Data>('/endpoint', undefined, {
 *   headers: { Authorization: 'Bearer custom-token' }
 * });
 */
export async function apiGet<T>(
  url: string,
  params?: Record<string, unknown>,
  config?: AxiosRequestConfig
): Promise<T> {
  const response: AxiosResponse<T> = await apiClient.get(url, {
    params,
    ...config,
  });
  return response.data;
}

/**
 * Generic POST request.
 *
 * @param url - The endpoint URL
 * @param data - The request body
 * @param config - Optional Axios config (can override token via headers.Authorization)
 * @returns Promise with the response data
 *
 * @example
 * // Create a new user
 * const newUser = await apiPost<User>('/users', { name: 'John', email: 'john@example.com' });
 */
export async function apiPost<T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> {
  const response: AxiosResponse<T> = await apiClient.post(url, data, config);
  return response.data;
}

/**
 * Generic PUT request.
 *
 * @param url - The endpoint URL
 * @param data - The request body
 * @param config - Optional Axios config (can override token via headers.Authorization)
 * @returns Promise with the response data
 *
 * @example
 * // Update a user
 * const updatedUser = await apiPut<User>('/users/123', { name: 'Jane' });
 */
export async function apiPut<T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> {
  const response: AxiosResponse<T> = await apiClient.put(url, data, config);
  return response.data;
}

/**
 * Generic PATCH request.
 *
 * @param url - The endpoint URL
 * @param data - The request body
 * @param config - Optional Axios config (can override token via headers.Authorization)
 * @returns Promise with the response data
 *
 * @example
 * // Partially update a user
 * const updatedUser = await apiPatch<User>('/users/123', { name: 'Jane' });
 */
export async function apiPatch<T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> {
  const response: AxiosResponse<T> = await apiClient.patch(url, data, config);
  return response.data;
}

/**
 * Generic DELETE request.
 *
 * @param url - The endpoint URL
 * @param config - Optional Axios config (can override token via headers.Authorization)
 * @returns Promise with the response data
 *
 * @example
 * // Delete a user
 * await apiDelete('/users/123');
 */
export async function apiDelete<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response: AxiosResponse<T> = await apiClient.delete(url, config);
  return response.data;
}
