import {
  createContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type {
  User,
  AuthState,
  Permission,
  Screen,
  Privilege,
} from "@/types/auth";
import { getAuthToken, setAuthToken, removeAuthToken } from "@/api/client";

/**
 * Auth context value interface.
 */
interface AuthContextValue extends AuthState {
  /** Login with user data and token */
  login: (user: User, token: string) => void;
  /** Logout and clear authentication */
  logout: () => void;
  /** Check if user has a specific permission */
  hasPermission: (screen: Screen, privilege: Privilege) => boolean;
  /** Check if user has any permission for a screen */
  hasAnyPermissionForScreen: (screen: Screen) => boolean;
  /** Check if user has any of the specified permissions */
  hasAnyPermission: (permissions: Permission[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Export the context for use in the useAuth hook
export { AuthContext };

/**
 * Storage key for user data.
 */
const USER_DATA_KEY = "auth_user";

/**
 * Get stored user data from localStorage.
 */
const getStoredUser = (): User | null => {
  if (typeof window === "undefined") return null;
  const userData = localStorage.getItem(USER_DATA_KEY);
  if (!userData) return null;
  try {
    return JSON.parse(userData) as User;
  } catch {
    return null;
  }
};

/**
 * Store user data in localStorage.
 */
const storeUser = (user: User): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
  }
};

/**
 * Remove user data from localStorage.
 */
const removeUser = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(USER_DATA_KEY);
  }
};

/**
 * Props for the AuthProvider component.
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Get the initial auth state from storage.
 */
function getInitialAuthState(): AuthState {
  const token = getAuthToken();
  const user = getStoredUser();

  if (token && user) {
    return {
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
    };
  }

  return {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
  };
}

/**
 * Authentication provider component.
 * Manages authentication state and provides auth utilities.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>(getInitialAuthState);

  // Listen for unauthorized events (401 from API)
  useEffect(() => {
    const handleUnauthorized = () => {
      removeAuthToken();
      removeUser();
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, []);

  const login = useCallback((user: User, token: string) => {
    setAuthToken(token);
    storeUser(user);
    setState({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
    });
  }, []);

  const logout = useCallback(() => {
    removeAuthToken();
    removeUser();
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  const hasPermission = useCallback(
    (screen: Screen, privilege: Privilege): boolean => {
      if (!state.user) return false;
      return state.user.permissions.some(
        (p) => p.screen === screen && p.privilege === privilege
      );
    },
    [state.user]
  );

  const hasAnyPermissionForScreen = useCallback(
    (screen: Screen): boolean => {
      if (!state.user) return false;
      return state.user.permissions.some((p) => p.screen === screen);
    },
    [state.user]
  );

  const hasAnyPermission = useCallback(
    (permissions: Permission[]): boolean => {
      if (!state.user) return false;
      return permissions.some((perm) =>
        state.user!.permissions.some(
          (p) => p.screen === perm.screen && p.privilege === perm.privilege
        )
      );
    },
    [state.user]
  );

  const value: AuthContextValue = {
    ...state,
    login,
    logout,
    hasPermission,
    hasAnyPermissionForScreen,
    hasAnyPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
