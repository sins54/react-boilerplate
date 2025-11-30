/**
 * Pulse HR - Ticket Form
 * 
 * Form for creating and editing tickets
 */

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ticket, Plus, Save } from 'lucide-react';
import type { TicketFormInput, TicketStatus, PulseUser } from '@/types/pulse-hr';

const ticketSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z.string().max(500, 'Description too long').optional(),
  priority: z.enum(['high', 'medium', 'low']),
  status: z.enum(['todo', 'in-progress', 'done']),
  assigneeId: z.string().optional(),
});

type TicketFormData = z.infer<typeof ticketSchema>;

interface TicketFormProps {
  initialData?: Partial<TicketFormInput>;
  defaultStatus?: TicketStatus;
  users: PulseUser[];
  onSubmit: (data: TicketFormInput) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  isEditing?: boolean;
}

export function TicketForm({
  initialData,
  defaultStatus = 'todo',
  users,
  onSubmit,
  onCancel,
  isLoading = false,
  isEditing = false,
}: TicketFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      priority: initialData?.priority || 'medium',
      status: initialData?.status || defaultStatus,
      assigneeId: initialData?.assigneeId || '',
    },
  });

  const handleFormSubmit = async (data: TicketFormData) => {
    await onSubmit({
      ...data,
      assigneeId: data.assigneeId || undefined,
    });
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
        <Ticket
          className="w-5 h-5"
          style={{ color: 'var(--color-primary)' }}
        />
        <h3
          className="text-lg font-semibold"
          style={{ color: 'var(--color-text)' }}
        >
          {isEditing ? 'Edit Ticket' : 'Create Ticket'}
        </h3>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* Title */}
        <div>
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: 'var(--color-text)' }}
          >
            Title *
          </label>
          <input
            type="text"
            {...register('title')}
            placeholder="Enter ticket title..."
            className="w-full px-3 py-2 rounded-md border text-sm"
            style={{
              backgroundColor: 'var(--color-bg)',
              borderColor: errors.title ? 'var(--color-error)' : 'var(--color-border)',
              color: 'var(--color-text)',
            }}
          />
          {errors.title && (
            <p className="mt-1 text-sm" style={{ color: 'var(--color-error)' }}>
              {errors.title.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: 'var(--color-text)' }}
          >
            Description
          </label>
          <textarea
            {...register('description')}
            rows={3}
            placeholder="Describe the ticket..."
            className="w-full px-3 py-2 rounded-md border text-sm resize-none"
            style={{
              backgroundColor: 'var(--color-bg)',
              borderColor: errors.description ? 'var(--color-error)' : 'var(--color-border)',
              color: 'var(--color-text)',
            }}
          />
        </div>

        {/* Priority & Status */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: 'var(--color-text)' }}
            >
              Priority *
            </label>
            <select
              {...register('priority')}
              className="w-full px-3 py-2 rounded-md border text-sm"
              style={{
                backgroundColor: 'var(--color-bg)',
                borderColor: errors.priority ? 'var(--color-error)' : 'var(--color-border)',
                color: 'var(--color-text)',
              }}
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: 'var(--color-text)' }}
            >
              Status *
            </label>
            <select
              {...register('status')}
              className="w-full px-3 py-2 rounded-md border text-sm"
              style={{
                backgroundColor: 'var(--color-bg)',
                borderColor: errors.status ? 'var(--color-error)' : 'var(--color-border)',
                color: 'var(--color-text)',
              }}
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
        </div>

        {/* Assignee */}
        <div>
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: 'var(--color-text)' }}
          >
            Assignee
          </label>
          <select
            {...register('assigneeId')}
            className="w-full px-3 py-2 rounded-md border text-sm"
            style={{
              backgroundColor: 'var(--color-bg)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
          >
            <option value="">Unassigned</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.displayName}
              </option>
            ))}
          </select>
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
            {isEditing ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {isLoading ? 'Saving...' : isEditing ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
}
