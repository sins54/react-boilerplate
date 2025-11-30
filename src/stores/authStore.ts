/**
 * Pulse HR - Auth Store (Zustand)
 * 
 * Manages user authentication state and role-based access
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PulseUser, UserRole } from '@/types/pulse-hr';

interface AuthState {
  user: PulseUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  setUser: (user: PulseUser | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  isAdmin: () => boolean;
  hasRole: (role: UserRole) => boolean;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
          isLoading: false,
          error: null,
        }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error, isLoading: false }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        }),

      isAdmin: () => {
        const { user } = get();
        return user?.role === 'admin';
      },

      hasRole: (role) => {
        const { user } = get();
        return user?.role === role;
      },
    }),
    {
      name: 'pulse-hr-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

/** Helper hook to get current user (throws if not authenticated) */
export function useCurrentUser(): PulseUser {
  const user = useAuthStore((state) => state.user);
  if (!user) {
    throw new Error('User not authenticated');
  }
  return user;
}
