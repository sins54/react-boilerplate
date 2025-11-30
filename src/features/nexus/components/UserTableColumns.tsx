/**
 * User Table Column Definitions
 * Column definitions for the Mega User Table component.
 */

import { type ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Calendar, Mail } from 'lucide-react';
import type { NexusUser, UserRole, UserStatus } from '../types';
import { Badge } from '@/components/data-display/Badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/data-display/Avatar';
import { Button } from '@/components/overlay/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/navigation/DropdownMenu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/overlay/Tooltip';
import { cn } from '@/lib/utils';

/**
 * Role badge color mapping.
 */
const roleBadgeColor: Record<UserRole, 'primary' | 'success' | 'warning' | 'error'> = {
  admin: 'error',
  editor: 'primary',
  viewer: 'success',
  member: 'warning',
};

/**
 * Role display labels.
 */
const roleLabels: Record<UserRole, string> = {
  admin: 'Admin',
  editor: 'Editor',
  viewer: 'Viewer',
  member: 'Member',
};

/**
 * Props for column actions.
 */
interface ColumnActionsProps {
  onStatusToggle: (userId: string, newStatus: UserStatus) => void;
  onDelete: (userId: string) => void;
  onEdit: (userId: string) => void;
  canEdit: boolean;
  canDelete: boolean;
}

/**
 * Create column definitions with action handlers.
 */
export function createUserColumns(actions: ColumnActionsProps): ColumnDef<NexusUser>[] {
  return [
    // Selection checkbox
    {
      id: 'select',
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          ref={(input) => {
            if (input) {
              input.indeterminate = table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected();
            }
          }}
          onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
          aria-label="Select all"
          className="w-4 h-4 rounded cursor-pointer"
          style={{
            accentColor: 'var(--color-primary)',
            borderColor: 'var(--color-border)',
          }}
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={(e) => row.toggleSelected(e.target.checked)}
          aria-label="Select row"
          className="w-4 h-4 rounded cursor-pointer"
          style={{
            accentColor: 'var(--color-primary)',
            borderColor: 'var(--color-border)',
          }}
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 40,
    },

    // Avatar
    {
      accessorKey: 'avatar',
      header: '',
      cell: ({ row }) => (
        <Avatar className="h-8 w-8">
          <AvatarImage src={row.original.avatar} alt={row.original.name} />
          <AvatarFallback>
            {row.original.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      ),
      enableSorting: false,
      size: 50,
    },

    // Name
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div>
          <div className="font-medium" style={{ color: 'var(--color-text)' }}>
            {row.original.name}
          </div>
          <div className="text-xs flex items-center gap-1" style={{ color: 'var(--color-text-secondary)' }}>
            <Mail className="w-3 h-3" />
            {row.original.email}
          </div>
        </div>
      ),
      enableSorting: true,
    },

    // Role
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => {
        const role = row.original.role;
        return (
          <Badge variant="solid" colorScheme={roleBadgeColor[role]}>
            {roleLabels[role]}
          </Badge>
        );
      },
      enableSorting: true,
      filterFn: (row, id, filterValues: string[]) => {
        if (!filterValues || filterValues.length === 0) return true;
        return filterValues.includes(row.getValue(id));
      },
    },

    // Status (Toggle Switch for inline edit)
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        const isActive = status === 'active';
        const userId = row.original.id;

        return (
          <div className="flex items-center gap-2">
            <button
              type="button"
              role="switch"
              aria-checked={isActive}
              aria-label={`Toggle ${row.original.name}'s status`}
              disabled={!actions.canEdit}
              onClick={() => {
                const newStatus: UserStatus = isActive ? 'inactive' : 'active';
                actions.onStatusToggle(userId, newStatus);
              }}
              className={cn(
                "relative w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1",
                !actions.canEdit && "opacity-50 cursor-not-allowed"
              )}
              style={{
                backgroundColor: isActive ? 'var(--color-primary)' : 'var(--color-border)',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)',
              }}
            >
              <span
                className={cn(
                  "absolute top-0.5 w-4 h-4 rounded-full transition-transform duration-200",
                  isActive ? "translate-x-5" : "translate-x-0.5"
                )}
                style={{
                  backgroundColor: 'var(--color-surface)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              />
            </button>
            <span
              className="text-sm capitalize"
              style={{
                color: isActive ? 'var(--color-success)' : 'var(--color-text-muted)',
              }}
            >
              {status}
            </span>
          </div>
        );
      },
      enableSorting: true,
    },

    // Last Login
    {
      accessorKey: 'lastLogin',
      header: 'Last Login',
      cell: ({ row }) => {
        const lastLogin = row.original.lastLogin;
        if (!lastLogin) {
          return (
            <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Never
            </span>
          );
        }
        
        const date = new Date(lastLogin);
        return (
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            <Calendar className="w-4 h-4" />
            {date.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </div>
        );
      },
      enableSorting: true,
    },

    // Actions dropdown
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const userId = row.original.id;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => actions.onEdit(userId)}>
                Edit User
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(row.original.email)}
              >
                Copy Email
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {actions.canDelete ? (
                <DropdownMenuItem
                  onClick={() => actions.onDelete(userId)}
                  className="text-[var(--color-error)]"
                >
                  Delete User
                </DropdownMenuItem>
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <DropdownMenuItem
                          disabled
                          className="text-[var(--color-text-muted)] cursor-not-allowed"
                        >
                          Delete User
                        </DropdownMenuItem>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Permission Denied</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      enableSorting: false,
      size: 50,
    },
  ];
}
