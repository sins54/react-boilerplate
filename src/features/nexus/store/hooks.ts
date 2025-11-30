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
 * Returns null if no org is selected.
 */
export function useCurrentOrgId(): string | null {
  const context = useContext(OrganizationContext);
  return context?.currentOrg?.id ?? getStoredOrgId();
}
