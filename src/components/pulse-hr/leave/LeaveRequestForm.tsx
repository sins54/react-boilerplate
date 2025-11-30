/**
 * Pulse HR - Leave Request Form
 * 
 * Form for submitting leave requests with balance checking
 */

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar, AlertTriangle, Send } from 'lucide-react';
import type { CreateLeaveRequestInput, LeaveBalance, LeaveType } from '@/types/pulse-hr';

const leaveSchema = z.object({
  leaveType: z.enum(['sick', 'vacation', 'personal']),
  duration: z.enum(['full-day', 'half-day']),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  reason: z.string().min(5, 'Please provide a reason (min 5 characters)'),
}).refine((data) => {
  return new Date(data.endDate) >= new Date(data.startDate);
}, {
  message: 'End date must be on or after start date',
  path: ['endDate'],
});

type LeaveFormData = z.infer<typeof leaveSchema>;

interface LeaveRequestFormProps {
  balances: LeaveBalance[];
  onSubmit: (data: CreateLeaveRequestInput) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function LeaveRequestForm({
  balances,
  onSubmit,
  onCancel,
  isLoading = false,
}: LeaveRequestFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LeaveFormData>({
    resolver: zodResolver(leaveSchema),
    defaultValues: {
      leaveType: 'vacation',
      duration: 'full-day',
    },
  });

  const selectedType = watch('leaveType') as LeaveType;
  const selectedBalance = balances.find((b) => b.leaveType === selectedType);

  const handleFormSubmit = async (data: LeaveFormData) => {
    await onSubmit(data as CreateLeaveRequestInput);
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
        <Calendar
          className="w-5 h-5"
          style={{ color: 'var(--color-primary)' }}
        />
        <h3
          className="text-lg font-semibold"
          style={{ color: 'var(--color-text)' }}
        >
          Request Leave
        </h3>
      </div>

      {/* Balance Display */}
      <div
        className="rounded-md p-4 mb-4"
        style={{ backgroundColor: 'var(--color-bg-secondary)' }}
      >
        <p
          className="text-sm font-medium mb-2"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Leave Balances
        </p>
        <div className="grid grid-cols-3 gap-2">
          {balances.map((balance) => (
            <div
              key={balance.leaveType}
              className={`text-center p-2 rounded-md ${
                balance.leaveType === selectedType ? 'ring-2 ring-[var(--color-primary)]' : ''
              }`}
              style={{
                backgroundColor: balance.isNegative
                  ? 'var(--color-error-bg)'
                  : 'var(--color-surface)',
              }}
            >
              <p
                className="text-xs capitalize"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {balance.leaveType}
              </p>
              <p
                className="text-lg font-semibold"
                style={{
                  color: balance.isNegative
                    ? 'var(--color-error)'
                    : 'var(--color-text)',
                }}
              >
                {balance.remaining}
              </p>
              <p
                className="text-xs"
                style={{ color: 'var(--color-text-muted)' }}
              >
                of {balance.total}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Overdraft Warning */}
      {selectedBalance && selectedBalance.remaining <= 0 && (
        <div
          className="flex items-center gap-2 p-3 rounded-md mb-4"
          style={{
            backgroundColor: 'var(--color-warning-bg)',
            color: 'var(--color-warning-text)',
          }}
        >
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">
            <strong>Overdraft Warning:</strong> You have no remaining {selectedType} days.
            You can still apply, but admin will see a negative balance warning.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* Leave Type */}
        <div>
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: 'var(--color-text)' }}
          >
            Leave Type
          </label>
          <select
            {...register('leaveType')}
            className="w-full px-3 py-2 rounded-md border text-sm"
            style={{
              backgroundColor: 'var(--color-bg)',
              borderColor: errors.leaveType ? 'var(--color-error)' : 'var(--color-border)',
              color: 'var(--color-text)',
            }}
          >
            <option value="vacation">Vacation</option>
            <option value="sick">Sick Leave</option>
            <option value="personal">Personal</option>
          </select>
        </div>

        {/* Duration */}
        <div>
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: 'var(--color-text)' }}
          >
            Duration
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="full-day"
                {...register('duration')}
                className="w-4 h-4"
              />
              <span style={{ color: 'var(--color-text)' }}>Full Day</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="half-day"
                {...register('duration')}
                className="w-4 h-4"
              />
              <span style={{ color: 'var(--color-text)' }}>Half Day</span>
            </label>
          </div>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: 'var(--color-text)' }}
            >
              Start Date
            </label>
            <input
              type="date"
              {...register('startDate')}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 rounded-md border text-sm"
              style={{
                backgroundColor: 'var(--color-bg)',
                borderColor: errors.startDate ? 'var(--color-error)' : 'var(--color-border)',
                color: 'var(--color-text)',
              }}
            />
            {errors.startDate && (
              <p className="mt-1 text-sm" style={{ color: 'var(--color-error)' }}>
                {errors.startDate.message}
              </p>
            )}
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: 'var(--color-text)' }}
            >
              End Date
            </label>
            <input
              type="date"
              {...register('endDate')}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 rounded-md border text-sm"
              style={{
                backgroundColor: 'var(--color-bg)',
                borderColor: errors.endDate ? 'var(--color-error)' : 'var(--color-border)',
                color: 'var(--color-text)',
              }}
            />
            {errors.endDate && (
              <p className="mt-1 text-sm" style={{ color: 'var(--color-error)' }}>
                {errors.endDate.message}
              </p>
            )}
          </div>
        </div>

        {/* Reason */}
        <div>
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: 'var(--color-text)' }}
          >
            Reason
          </label>
          <textarea
            {...register('reason')}
            rows={3}
            placeholder="Please provide a reason for your leave..."
            className="w-full px-3 py-2 rounded-md border text-sm resize-none"
            style={{
              backgroundColor: 'var(--color-bg)',
              borderColor: errors.reason ? 'var(--color-error)' : 'var(--color-border)',
              color: 'var(--color-text)',
            }}
          />
          {errors.reason && (
            <p className="mt-1 text-sm" style={{ color: 'var(--color-error)' }}>
              {errors.reason.message}
            </p>
          )}
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
            <Send className="w-4 h-4" />
            {isLoading ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </form>
    </div>
  );
}
