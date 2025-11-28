import {
  useMutation,
  type UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { apiPost, apiPut, apiPatch, apiDelete } from "../api/generic-api";
import type { AxiosRequestConfig } from "axios";

/**
 * HTTP methods supported by the generic mutation hook.
 */
export type MutationMethod = "POST" | "PUT" | "PATCH" | "DELETE";

/**
 * Variables passed to the mutation function.
 */
export interface MutationVariables<D = unknown> {
  /** Optional data payload for POST/PUT/PATCH */
  data?: D;
  /** Dynamic URL parameters (e.g., ID) to append to the base URL */
  urlParams?: string;
}

/**
 * Options for the useGenericMutation hook.
 */
export interface UseGenericMutationOptions<T, D = unknown>
  extends Omit<
    UseMutationOptions<T, Error, MutationVariables<D>>,
    "mutationFn" | "onSettled"
  > {
  /** HTTP method to use */
  method: MutationMethod;
  /** Base URL for the endpoint */
  url: string;
  /** Query keys to invalidate on success */
  invalidateKeys?: string[][];
  /** Axios config for custom headers or token override */
  axiosConfig?: AxiosRequestConfig;
  /** Callback when mutation settles (success or error) */
  onSettled?: (
    data: T | undefined,
    error: Error | null,
    variables: MutationVariables<D>
  ) => void;
}

/**
 * Generic mutation hook that wraps useMutation for POST/PUT/PATCH/DELETE operations.
 *
 * @param options - Configuration options for the mutation
 * @returns useMutation result with typed data
 *
 * @example
 * // Create a new user (POST)
 * const createUser = useGenericMutation<User, CreateUserDto>({
 *   method: 'POST',
 *   url: '/users',
 *   invalidateKeys: [['users']],
 *   onSuccess: (data) => {
 *     console.log('User created:', data);
 *   },
 * });
 *
 * // Usage
 * createUser.mutate({ data: { name: 'John', email: 'john@example.com' } });
 *
 * @example
 * // Update a user (PUT)
 * const updateUser = useGenericMutation<User, UpdateUserDto>({
 *   method: 'PUT',
 *   url: '/users',
 *   invalidateKeys: [['users'], ['user', userId]],
 * });
 *
 * // Usage - appends /123 to the URL
 * updateUser.mutate({ urlParams: '/123', data: { name: 'Jane' } });
 *
 * @example
 * // Delete a user (DELETE)
 * const deleteUser = useGenericMutation<void>({
 *   method: 'DELETE',
 *   url: '/users',
 *   invalidateKeys: [['users']],
 * });
 *
 * // Usage - appends /123 to the URL
 * deleteUser.mutate({ urlParams: '/123' });
 *
 * @example
 * // With custom token
 * const mutation = useGenericMutation<Data>({
 *   method: 'POST',
 *   url: '/protected',
 *   axiosConfig: {
 *     headers: { Authorization: 'Bearer custom-token' }
 *   },
 * });
 */
export function useGenericMutation<T, D = unknown>(
  options: UseGenericMutationOptions<T, D>
) {
  const {
    method,
    url,
    invalidateKeys,
    axiosConfig,
    onSettled: userOnSettled,
    ...mutationOptions
  } = options;
  const queryClient = useQueryClient();

  const mutationFn = async (variables: MutationVariables<D>): Promise<T> => {
    const fullUrl = variables.urlParams ? `${url}${variables.urlParams}` : url;

    switch (method) {
      case "POST":
        return apiPost<T, D>(fullUrl, variables.data, axiosConfig);
      case "PUT":
        return apiPut<T, D>(fullUrl, variables.data, axiosConfig);
      case "PATCH":
        return apiPatch<T, D>(fullUrl, variables.data, axiosConfig);
      case "DELETE":
        return apiDelete<T>(fullUrl, axiosConfig);
      default:
        throw new Error(`Unsupported mutation method: ${method}`);
    }
  };

  return useMutation<T, Error, MutationVariables<D>>({
    mutationFn,
    ...mutationOptions,
    onSettled: (data, error, variables) => {
      // Invalidate specified query keys on success
      if (!error && invalidateKeys) {
        invalidateKeys.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: key });
        });
      }
      // Call user's onSettled if provided
      userOnSettled?.(data, error, variables);
    },
  });
}
