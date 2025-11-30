/**
 * Organization Store
 * Global state management for the current organization.
 * Uses localStorage for persistence and provides a hook for React components.
 */

import { useState, useCallback, useMemo, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { Organization, OrganizationState } from '../types';
import { getStoredOrgId, setStoredOrgId, removeStoredOrgId } from './storage';
import { OrganizationContext, type OrganizationContextValue } from './context';

/**
 * Props for the OrganizationProvider component.
 */
interface OrganizationProviderProps {
  children: ReactNode;
}

/**
 * Get initial state from storage.
 */
function getInitialState(): OrganizationState {
  return {
    currentOrg: null,
    organizations: [],
    isLoading: true,
  };
}

/**
 * Organization provider component.
 * Manages organization state and provides context to the application.
 */
export function OrganizationProvider({ children }: OrganizationProviderProps) {
  const queryClient = useQueryClient();
  
  const [state, setState] = useState<OrganizationState>(getInitialState);

  const selectOrg = useCallback((org: Organization) => {
    // Store the org ID
    setStoredOrgId(org.id);
    
    // Update state
    setState(prev => ({ ...prev, currentOrg: org }));
    
    // Clear React Query cache to force refetch with new org header
    queryClient.invalidateQueries();
  }, [queryClient]);

  const clearOrg = useCallback(() => {
    // Remove stored org ID
    removeStoredOrgId();
    
    // Update state
    setState(prev => ({ ...prev, currentOrg: null }));
    
    // Clear React Query cache
    queryClient.invalidateQueries();
  }, [queryClient]);

  const setOrganizations = useCallback((orgs: Organization[]) => {
    setState(prev => {
      // If there's a stored org ID, try to restore it
      const storedOrgId = getStoredOrgId();
      let newCurrentOrg = prev.currentOrg;
      
      if (storedOrgId && !prev.currentOrg) {
        const org = orgs.find(o => o.id === storedOrgId);
        if (org) {
          newCurrentOrg = org;
        }
      }
      
      return { 
        ...prev, 
        organizations: orgs, 
        currentOrg: newCurrentOrg,
        isLoading: false 
      };
    });
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }));
  }, []);

  const value: OrganizationContextValue = useMemo(() => ({
    ...state,
    selectOrg,
    clearOrg,
    setOrganizations,
    setLoading,
    hasSelectedOrg: state.currentOrg !== null,
  }), [state, selectOrg, clearOrg, setOrganizations, setLoading]);

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
}
