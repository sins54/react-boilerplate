/**
 * Organization Hooks
 * React hooks for accessing organization context.
 */

import { useContext } from 'react';
import { OrganizationContext } from './context';
import { getStoredOrgId } from './storage';

/**
 * Hook to access organization context.
 * @throws Error if used outside of OrganizationProvider
 */
export function useOrganization() {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
}

/**
 * Hook to get just the current org ID (for use in API calls).
 * Returns the context value if available, otherwise falls back to localStorage.
 * When context exists, always uses context state to avoid stale data.
 */
export function useCurrentOrgId(): string | null {
  const context = useContext(OrganizationContext);
  
  // If context is available, use context state (even if null) to avoid stale localStorage data
  if (context !== null) {
    return context.currentOrg?.id ?? null;
  }
  
  // Only fall back to localStorage when there's no context (e.g., outside provider)
  return getStoredOrgId();
}
