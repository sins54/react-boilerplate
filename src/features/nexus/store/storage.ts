/**
 * Organization Storage Utilities
 * Functions for persisting organization data to localStorage.
 */

/**
 * Storage key for the current organization ID.
 */
const ORG_ID_KEY = 'nexus_org_id';

/**
 * Get the stored organization ID from localStorage.
 */
export function getStoredOrgId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ORG_ID_KEY);
}

/**
 * Set the organization ID in localStorage.
 */
export function setStoredOrgId(orgId: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ORG_ID_KEY, orgId);
  }
}

/**
 * Remove the organization ID from localStorage.
 */
export function removeStoredOrgId(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ORG_ID_KEY);
  }
}
