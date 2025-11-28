export {
  apiClient,
  getAuthToken,
  setAuthToken,
  removeAuthToken,
} from "./client";
export type { ApiError } from "./client";

export { apiGet, apiPost, apiPut, apiPatch, apiDelete } from "./generic-api";
