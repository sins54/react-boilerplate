/**
 * Organization Context
 * Separating context creation to satisfy react-refresh rules.
 */

import { createContext } from 'react';
import type { Organization, OrganizationState } from '../types';

/**
 * Organization context value interface.
 */
export interface OrganizationContextValue extends OrganizationState {
  /** Select an organization and update the global state */
  selectOrg: (org: Organization) => void;
  /** Clear the current organization selection */
  clearOrg: () => void;
  /** Set the list of available organizations */
  setOrganizations: (orgs: Organization[]) => void;
  /** Set loading state */
  setLoading: (loading: boolean) => void;
  /** Check if an organization is selected */
  hasSelectedOrg: boolean;
}

export const OrganizationContext = createContext<OrganizationContextValue | null>(null);
