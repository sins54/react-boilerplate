/**
 * Organization Switcher Component
 * A modal/dropdown for selecting the current organization.
 */

import { useEffect, useState } from 'react';
import { Building2, Check, ChevronDown, Loader2 } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { useOrganization } from '../store';
import type { Organization } from '../types';
import { apiGet } from '@/api/generic-api';

/**
 * Props for the OrganizationSwitcher component.
 */
interface OrganizationSwitcherProps {
  /** Force the modal to be open (e.g., when no org is selected) */
  forceOpen?: boolean;
  /** Callback when an organization is selected */
  onSelect?: (org: Organization) => void;
}

/**
 * Organization Switcher - A modal for selecting the current organization.
 * This component should be rendered at the app level after authentication.
 */
export function OrganizationSwitcher({ forceOpen = false, onSelect }: OrganizationSwitcherProps) {
  const {
    currentOrg,
    organizations,
    selectOrg,
    setOrganizations,
    setLoading,
    isLoading,
  } = useOrganization();
  
  const [isOpen, setIsOpen] = useState(forceOpen || !currentOrg);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Fetch organizations on mount
  useEffect(() => {
    async function fetchOrganizations() {
      setLoading(true);
      setFetchError(null);
      
      try {
        const response = await apiGet<{ data: Organization[] }>('/orgs');
        setOrganizations(response.data);
      } catch (error) {
        setFetchError('Failed to load organizations');
        console.error('Failed to fetch organizations:', error);
      } finally {
        setLoading(false);
      }
    }

    if (organizations.length === 0) {
      fetchOrganizations();
    }
  }, [organizations.length, setOrganizations, setLoading]);

  // Force open when no org is selected
  useEffect(() => {
    if (forceOpen || (!currentOrg && organizations.length > 0)) {
      setIsOpen(true);
    }
  }, [forceOpen, currentOrg, organizations.length]);

  const handleSelectOrg = (org: Organization) => {
    selectOrg(org);
    setIsOpen(false);
    onSelect?.(org);
  };

  const getPlanBadgeColor = (plan: Organization['plan']): string => {
    switch (plan) {
      case 'enterprise':
        return 'var(--color-primary)';
      case 'professional':
        return 'var(--color-success)';
      case 'starter':
        return 'var(--color-warning)';
      default:
        return 'var(--color-text-muted)';
    }
  };

  const getPlanBadgeBgStyle = (plan: Organization['plan']): React.CSSProperties => {
    const color = getPlanBadgeColor(plan);
    // Use rgba fallback for broader browser support
    switch (plan) {
      case 'enterprise':
        return { backgroundColor: 'rgba(59, 130, 246, 0.15)', color };
      case 'professional':
        return { backgroundColor: 'rgba(34, 197, 94, 0.15)', color };
      case 'starter':
        return { backgroundColor: 'rgba(234, 179, 8, 0.15)', color };
      default:
        return { backgroundColor: 'rgba(107, 114, 128, 0.15)', color };
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      {/* Trigger button (shows current org or prompt to select) */}
      <Dialog.Trigger asChild>
        <button
          className="flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors hover:bg-[var(--color-surface-hover)]"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-text)',
          }}
        >
          {currentOrg ? (
            <>
              {currentOrg.logo ? (
                <img
                  src={currentOrg.logo}
                  alt={currentOrg.name}
                  className="w-5 h-5 rounded"
                />
              ) : (
                <Building2 className="w-5 h-5" style={{ color: 'var(--color-text-muted)' }} />
              )}
              <span className="text-sm font-medium">{currentOrg.name}</span>
              <ChevronDown className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
            </>
          ) : (
            <>
              <Building2 className="w-5 h-5" style={{ color: 'var(--color-text-muted)' }} />
              <span className="text-sm">Select Organization</span>
              <ChevronDown className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
            </>
          )}
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 bg-black/50 animate-in fade-in"
          style={{ zIndex: 50 }}
        />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md max-h-[85vh] rounded-lg shadow-lg p-6 animate-in zoom-in-95 fade-in overflow-auto"
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            zIndex: 51,
          }}
        >
          <Dialog.Title
            className="text-lg font-semibold mb-2"
            style={{ color: 'var(--color-text)' }}
          >
            Select Organization
          </Dialog.Title>
          <Dialog.Description
            className="text-sm mb-4"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Choose an organization to work with. All data and actions will be scoped to this organization.
          </Dialog.Description>

          {/* Loading state */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--color-primary)' }} />
            </div>
          )}

          {/* Error state */}
          {fetchError && (
            <div
              className="p-4 rounded-lg text-center"
              style={{
                backgroundColor: 'var(--color-error-bg)',
                color: 'var(--color-error)',
              }}
            >
              {fetchError}
            </div>
          )}

          {/* Organization list */}
          {!isLoading && !fetchError && (
            <div className="space-y-2">
              {organizations.map((org) => (
                <button
                  key={org.id}
                  onClick={() => handleSelectOrg(org)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg border transition-colors hover:bg-[var(--color-surface-hover)]"
                  style={{
                    backgroundColor: currentOrg?.id === org.id 
                      ? 'var(--color-primary-bg)' 
                      : 'var(--color-bg)',
                    borderColor: currentOrg?.id === org.id 
                      ? 'var(--color-primary)' 
                      : 'var(--color-border)',
                  }}
                >
                  {/* Logo */}
                  {org.logo ? (
                    <img
                      src={org.logo}
                      alt={org.name}
                      className="w-10 h-10 rounded-lg"
                    />
                  ) : (
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: 'var(--color-surface)' }}
                    >
                      <Building2 className="w-5 h-5" style={{ color: 'var(--color-text-muted)' }} />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 text-left">
                    <div className="font-medium" style={{ color: 'var(--color-text)' }}>
                      {org.name}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                      {org.memberCount} members
                    </div>
                  </div>

                  {/* Plan badge */}
                  <span
                    className="text-xs px-2 py-1 rounded-full font-medium uppercase"
                    style={getPlanBadgeBgStyle(org.plan)}
                  >
                    {org.plan}
                  </span>

                  {/* Check mark for selected */}
                  {currentOrg?.id === org.id && (
                    <Check className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !fetchError && organizations.length === 0 && (
            <div
              className="p-8 text-center rounded-lg"
              style={{ backgroundColor: 'var(--color-surface)' }}
            >
              <Building2
                className="w-12 h-12 mx-auto mb-3"
                style={{ color: 'var(--color-text-muted)' }}
              />
              <p style={{ color: 'var(--color-text-secondary)' }}>
                No organizations found. Contact support if you believe this is an error.
              </p>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default OrganizationSwitcher;
