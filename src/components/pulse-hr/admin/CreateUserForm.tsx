/**
 * Pulse HR - Create User Form (Admin)
 * 
 * Form for admins to create new user accounts
 */

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserPlus } from 'lucide-react';
import type { CreateUserInput } from '@/types/pulse-hr';

const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  displayName: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['admin', 'employee']),
  department: z.string().optional(),
  position: z.string().optional(),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;

interface CreateUserFormProps {
  onSubmit: (data: CreateUserInput) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function CreateUserForm({
  onSubmit,
  onCancel,
  isLoading = false,
}: CreateUserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      role: 'employee',
    },
  });

  const handleFormSubmit = async (data: CreateUserFormData) => {
    await onSubmit(data as CreateUserInput);
  };

  return (
    <div
      className="rounded-lg p-6 shadow-sm border"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <UserPlus
          className="w-5 h-5"
          style={{ color: 'var(--color-primary)' }}
        />
        <h3
          className="text-lg font-semibold"
          style={{ color: 'var(--color-text)' }}
        >
          Create New User
        </h3>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* Email */}
        <div>
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: 'var(--color-text)' }}
          >
            Email *
          </label>
          <input
            type="email"
            {...register('email')}
            placeholder="user@company.com"
            className="w-full px-3 py-2 rounded-md border text-sm"
            style={{
              backgroundColor: 'var(--color-bg)',
              borderColor: errors.email ? 'var(--color-error)' : 'var(--color-border)',
              color: 'var(--color-text)',
            }}
          />
          {errors.email && (
            <p className="mt-1 text-sm" style={{ color: 'var(--color-error)' }}>
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: 'var(--color-text)' }}
          >
            Password *
          </label>
          <input
            type="password"
            {...register('password')}
            placeholder="Minimum 8 characters"
            className="w-full px-3 py-2 rounded-md border text-sm"
            style={{
              backgroundColor: 'var(--color-bg)',
              borderColor: errors.password ? 'var(--color-error)' : 'var(--color-border)',
              color: 'var(--color-text)',
            }}
          />
          {errors.password && (
            <p className="mt-1 text-sm" style={{ color: 'var(--color-error)' }}>
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Display Name */}
        <div>
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: 'var(--color-text)' }}
          >
            Display Name *
          </label>
          <input
            type="text"
            {...register('displayName')}
            placeholder="John Doe"
            className="w-full px-3 py-2 rounded-md border text-sm"
            style={{
              backgroundColor: 'var(--color-bg)',
              borderColor: errors.displayName ? 'var(--color-error)' : 'var(--color-border)',
              color: 'var(--color-text)',
            }}
          />
          {errors.displayName && (
            <p className="mt-1 text-sm" style={{ color: 'var(--color-error)' }}>
              {errors.displayName.message}
            </p>
          )}
        </div>

        {/* Role */}
        <div>
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: 'var(--color-text)' }}
          >
            Role *
          </label>
          <select
            {...register('role')}
            className="w-full px-3 py-2 rounded-md border text-sm"
            style={{
              backgroundColor: 'var(--color-bg)',
              borderColor: errors.role ? 'var(--color-error)' : 'var(--color-border)',
              color: 'var(--color-text)',
            }}
          >
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Department & Position */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: 'var(--color-text)' }}
            >
              Department
            </label>
            <input
              type="text"
              {...register('department')}
              placeholder="Engineering"
              className="w-full px-3 py-2 rounded-md border text-sm"
              style={{
                backgroundColor: 'var(--color-bg)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
              }}
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: 'var(--color-text)' }}
            >
              Position
            </label>
            <input
              type="text"
              {...register('position')}
              placeholder="Software Engineer"
              className="w-full px-3 py-2 rounded-md border text-sm"
              style={{
                backgroundColor: 'var(--color-bg)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
              }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2 px-4 rounded-md font-medium transition-colors"
            style={{
              backgroundColor: 'var(--color-muted)',
              color: 'var(--color-text)',
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium transition-colors disabled:opacity-50"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-text-on-primary)',
            }}
          >
            <UserPlus className="w-4 h-4" />
            {isLoading ? 'Creating...' : 'Create User'}
          </button>
        </div>
      </form>
    </div>
  );
}
