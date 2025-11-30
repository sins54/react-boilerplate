/**
 * Pulse HR - Users Page (Admin Only)
 * 
 * User management and leave quota administration
 */

import { useEffect, useState } from 'react';
import { UserPlus, RefreshCw } from 'lucide-react';
import { useAuthStore } from '@/stores';
import { CreateUserForm } from '@/components/pulse-hr/admin';
import { getAllUsers, createUser, updateUser, resetYearlyBalance } from '@/services/authService';
import type { PulseUser, CreateUserInput } from '@/types/pulse-hr';

export function UsersPage() {
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState<PulseUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const userList = await getAllUsers();
      setUsers(userList);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (data: CreateUserInput) => {
    setIsLoading(true);
    try {
      const newUser = await createUser(data);
      setUsers([...users, newUser]);
      setShowCreateForm(false);
    } catch (error) {
      console.error('Failed to create user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetBalance = async (userId: string) => {
    if (!window.confirm('Are you sure you want to reset this user\'s yearly leave balance?')) {
      return;
    }

    setIsLoading(true);
    try {
      await resetYearlyBalance(userId);
      setUsers(
        users.map((u) =>
          u.id === userId
            ? {
                ...u,
                leaveQuotas: {
                  ...u.leaveQuotas,
                  usedSickDays: 0,
                  usedVacationDays: 0,
                  usedPersonalDays: 0,
                },
              }
            : u
        )
      );
    } catch (error) {
      console.error('Failed to reset balance:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async (userId: string, currentActive: boolean) => {
    setIsLoading(true);
    try {
      await updateUser(userId, { isActive: !currentActive });
      setUsers(
        users.map((u) =>
          u.id === userId ? { ...u, isActive: !currentActive } : u
        )
      );
    } catch (error) {
      console.error('Failed to toggle user status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const activeUsers = users.filter((u) => u.isActive);
  const inactiveUsers = users.filter((u) => !u.isActive);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ color: 'var(--color-text)' }}
          >
            User Management
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Manage users and leave quotas ({users.length} total)
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 py-2 px-4 rounded-lg font-medium text-sm"
          style={{
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-text-on-primary)',
          }}
        >
          <UserPlus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* Create User Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <CreateUserForm
              onSubmit={handleCreateUser}
              onCancel={() => setShowCreateForm(false)}
              isLoading={isLoading}
            />
          </div>
        </div>
      )}

      {/* User List */}
      {isLoading && users.length === 0 ? (
        <div
          className="flex items-center justify-center py-12"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <div
            className="w-8 h-8 border-4 rounded-full animate-spin"
            style={{
              borderColor: 'var(--color-border)',
              borderTopColor: 'var(--color-primary)',
            }}
          />
        </div>
      ) : (
        <>
          {/* Active Users */}
          <div>
            <h2
              className="font-semibold mb-3"
              style={{ color: 'var(--color-text)' }}
            >
              Active Users ({activeUsers.length})
            </h2>
            <div className="grid gap-4">
              {activeUsers.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onResetBalance={() => handleResetBalance(user.id)}
                  onToggleActive={() => handleToggleActive(user.id, user.isActive)}
                  isCurrentUser={user.id === currentUser?.id}
                  isLoading={isLoading}
                />
              ))}
            </div>
          </div>

          {/* Inactive Users */}
          {inactiveUsers.length > 0 && (
            <div>
              <h2
                className="font-semibold mb-3"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Inactive Users ({inactiveUsers.length})
              </h2>
              <div className="grid gap-4">
                {inactiveUsers.map((user) => (
                  <UserCard
                    key={user.id}
                    user={user}
                    onResetBalance={() => handleResetBalance(user.id)}
                    onToggleActive={() => handleToggleActive(user.id, user.isActive)}
                    isCurrentUser={false}
                    isLoading={isLoading}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

interface UserCardProps {
  user: PulseUser;
  onResetBalance: () => void;
  onToggleActive: () => void;
  isCurrentUser: boolean;
  isLoading: boolean;
}

function UserCard({
  user,
  onResetBalance,
  onToggleActive,
  isCurrentUser,
  isLoading,
}: UserCardProps) {
  const { leaveQuotas } = user;

  return (
    <div
      className={`rounded-lg p-4 border ${!user.isActive ? 'opacity-60' : ''}`}
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center font-medium text-lg"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-text-on-primary)',
            }}
          >
            {user.displayName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3
                className="font-semibold"
                style={{ color: 'var(--color-text)' }}
              >
                {user.displayName}
              </h3>
              <span
                className="text-xs px-2 py-0.5 rounded-full capitalize"
                style={{
                  backgroundColor:
                    user.role === 'admin'
                      ? 'var(--color-warning-bg)'
                      : 'var(--color-info-bg)',
                  color:
                    user.role === 'admin'
                      ? 'var(--color-warning-text)'
                      : 'var(--color-info-text)',
                }}
              >
                {user.role}
              </span>
            </div>
            <p
              className="text-sm"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {user.email}
            </p>
            {user.department && (
              <p
                className="text-xs"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {user.department} • {user.position}
              </p>
            )}
          </div>
        </div>

        {!isCurrentUser && (
          <button
            onClick={onToggleActive}
            disabled={isLoading}
            className="text-sm px-3 py-1 rounded-md transition-colors disabled:opacity-50"
            style={{
              backgroundColor: user.isActive
                ? 'var(--color-error-bg)'
                : 'var(--color-success-bg)',
              color: user.isActive
                ? 'var(--color-error)'
                : 'var(--color-success)',
            }}
          >
            {user.isActive ? 'Deactivate' : 'Activate'}
          </button>
        )}
      </div>

      {/* Leave Quotas */}
      <div
        className="rounded-md p-3 mb-3"
        style={{ backgroundColor: 'var(--color-bg-secondary)' }}
      >
        <p
          className="text-xs font-medium mb-2"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Leave Balance
        </p>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              Sick
            </p>
            <p className="font-semibold" style={{ color: 'var(--color-text)' }}>
              {leaveQuotas.sickDays - leaveQuotas.usedSickDays}/{leaveQuotas.sickDays}
            </p>
          </div>
          <div>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              Vacation
            </p>
            <p className="font-semibold" style={{ color: 'var(--color-text)' }}>
              {leaveQuotas.vacationDays - leaveQuotas.usedVacationDays}/{leaveQuotas.vacationDays}
            </p>
          </div>
          <div>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              Personal
            </p>
            <p className="font-semibold" style={{ color: 'var(--color-text)' }}>
              {leaveQuotas.personalDays - leaveQuotas.usedPersonalDays}/{leaveQuotas.personalDays}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <button
        onClick={onResetBalance}
        disabled={isLoading}
        className="flex items-center gap-2 text-sm font-medium transition-colors disabled:opacity-50"
        style={{ color: 'var(--color-primary)' }}
      >
        <RefreshCw className="w-4 h-4" />
        Reset Yearly Balance
      </button>
    </div>
  );
}
