/**
 * Screen entities that can be accessed in the application.
 * Add new screens here as the application grows.
 */
export type Screen =
  | "BADGE"
  | "PROJECT"
  | "USERS"
  | "DASHBOARD"
  | "SETTINGS"
  | "REPORTS";

/**
 * Privileges/actions that can be performed on screens.
 */
export type Privilege = "VIEW" | "CREATE" | "EDIT" | "DELETE" | "CONFIGURE";

/**
 * A permission entry representing access to a specific screen with a specific privilege.
 */
export interface Permission {
  screen: Screen;
  privilege: Privilege;
}

/**
 * User structure returned from authentication/backend.
 */
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  permissions: Permission[];
}

/**
 * Authentication state structure.
 */
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/**
 * Login credentials for authentication.
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Authentication response from the backend.
 */
export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}
