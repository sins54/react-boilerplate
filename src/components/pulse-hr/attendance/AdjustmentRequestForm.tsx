/**
 * Pulse HR - Adjustment Request Form
 * 
 * Form for requesting attendance corrections
 */

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Send } from 'lucide-react';
import type { CreateAdjustmentRequestInput } from '@/types/pulse-hr';

const adjustmentSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  requestType: z.enum(['check-in', 'check-out', 'both']),
  requestedCheckInTime: z.string().optional(),
  requestedCheckOutTime: z.string().optional(),
  reason: z.string().min(10, 'Please provide a detailed reason (min 10 characters)'),
}).refine((data) => {
  if (data.requestType === 'check-in' || data.requestType === 'both') {
    return !!data.requestedCheckInTime;
  }
  return true;
}, {
  message: 'Check-in time is required',
  path: ['requestedCheckInTime'],
}).refine((data) => {
  if (data.requestType === 'check-out' || data.requestType === 'both') {
    return !!data.requestedCheckOutTime;
  }
  return true;
}, {
  message: 'Check-out time is required',
  path: ['requestedCheckOutTime'],
});

type AdjustmentFormData = z.infer<typeof adjustmentSchema>;

interface AdjustmentRequestFormProps {
  onSubmit: (data: CreateAdjustmentRequestInput) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function AdjustmentRequestForm({
  onSubmit,
  onCancel,
  isLoading = false,
}: AdjustmentRequestFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AdjustmentFormData>({
    resolver: zodResolver(adjustmentSchema),
    defaultValues: {
      requestType: 'check-in',
    },
  });

  const requestType = watch('requestType');

  const handleFormSubmit = async (data: AdjustmentFormData) => {
    const input: CreateAdjustmentRequestInput = {
      date: data.date,
      requestType: data.requestType,
      requestedCheckInTime: data.requestedCheckInTime
        ? `${data.date}T${data.requestedCheckInTime}:00.000Z`
        : undefined,
      requestedCheckOutTime: data.requestedCheckOutTime
        ? `${data.date}T${data.requestedCheckOutTime}:00.000Z`
        : undefined,
      reason: data.reason,
    };
    await onSubmit(input);
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
        <AlertCircle
          className="w-5 h-5"
          style={{ color: 'var(--color-warning)' }}
        />
        <h3
          className="text-lg font-semibold"
          style={{ color: 'var(--color-text)' }}
        >
          Request Attendance Adjustment
        </h3>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* Date */}
        <div>
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: 'var(--color-text)' }}
          >
            Date
          </label>
          <input
            type="date"
            {...register('date')}
            max={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 rounded-md border text-sm"
            style={{
              backgroundColor: 'var(--color-bg)',
              borderColor: errors.date ? 'var(--color-error)' : 'var(--color-border)',
              color: 'var(--color-text)',
            }}
          />
          {errors.date && (
            <p className="mt-1 text-sm" style={{ color: 'var(--color-error)' }}>
              {errors.date.message}
            </p>
          )}
        </div>

        {/* Request Type */}
        <div>
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: 'var(--color-text)' }}
          >
            Request Type
          </label>
          <select
            {...register('requestType')}
            className="w-full px-3 py-2 rounded-md border text-sm"
            style={{
              backgroundColor: 'var(--color-bg)',
              borderColor: errors.requestType ? 'var(--color-error)' : 'var(--color-border)',
              color: 'var(--color-text)',
            }}
          >
            <option value="check-in">Check-in Correction</option>
            <option value="check-out">Check-out Correction</option>
            <option value="both">Both Check-in & Check-out</option>
          </select>
        </div>

        {/* Check-in Time */}
        {(requestType === 'check-in' || requestType === 'both') && (
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: 'var(--color-text)' }}
            >
              Requested Check-in Time
            </label>
            <input
              type="time"
              {...register('requestedCheckInTime')}
              className="w-full px-3 py-2 rounded-md border text-sm"
              style={{
                backgroundColor: 'var(--color-bg)',
                borderColor: errors.requestedCheckInTime
                  ? 'var(--color-error)'
                  : 'var(--color-border)',
                color: 'var(--color-text)',
              }}
            />
            {errors.requestedCheckInTime && (
              <p className="mt-1 text-sm" style={{ color: 'var(--color-error)' }}>
                {errors.requestedCheckInTime.message}
              </p>
            )}
          </div>
        )}

        {/* Check-out Time */}
        {(requestType === 'check-out' || requestType === 'both') && (
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: 'var(--color-text)' }}
            >
              Requested Check-out Time
            </label>
            <input
              type="time"
              {...register('requestedCheckOutTime')}
              className="w-full px-3 py-2 rounded-md border text-sm"
              style={{
                backgroundColor: 'var(--color-bg)',
                borderColor: errors.requestedCheckOutTime
                  ? 'var(--color-error)'
                  : 'var(--color-border)',
                color: 'var(--color-text)',
              }}
            />
            {errors.requestedCheckOutTime && (
              <p className="mt-1 text-sm" style={{ color: 'var(--color-error)' }}>
                {errors.requestedCheckOutTime.message}
              </p>
            )}
          </div>
        )}

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
            placeholder="Please explain why you need this adjustment..."
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
