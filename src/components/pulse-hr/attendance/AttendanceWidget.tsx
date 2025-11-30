/**
 * Pulse HR - Attendance Widget Component
 * 
 * Displays check-in/out buttons with time validation
 */

import { Clock, LogIn, LogOut, AlertCircle } from 'lucide-react';
import { useAttendanceStore, formatTime } from '@/stores';

interface AttendanceWidgetProps {
  onCheckIn: () => Promise<void>;
  onCheckOut: () => Promise<void>;
  isLoading?: boolean;
}

export function AttendanceWidget({
  onCheckIn,
  onCheckOut,
  isLoading = false,
}: AttendanceWidgetProps) {
  const { todayRecord, canCheckIn, canCheckOut } = useAttendanceStore();

  const handleCheckIn = async () => {
    if (canCheckIn() && !isLoading) {
      await onCheckIn();
    }
  };

  const handleCheckOut = async () => {
    if (canCheckOut() && !isLoading) {
      await onCheckOut();
    }
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
        <Clock
          className="w-5 h-5"
          style={{ color: 'var(--color-primary)' }}
        />
        <h3
          className="text-lg font-semibold"
          style={{ color: 'var(--color-text)' }}
        >
          Today's Attendance
        </h3>
      </div>

      {/* Current Status */}
      <div
        className="rounded-md p-4 mb-4"
        style={{ backgroundColor: 'var(--color-bg-secondary)' }}
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p
              className="text-sm font-medium mb-1"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Check In
            </p>
            <p
              className="text-lg font-semibold"
              style={{ color: 'var(--color-text)' }}
            >
              {todayRecord?.checkInTime
                ? formatTime(todayRecord.checkInTime)
                : '--:--'}
            </p>
          </div>
          <div>
            <p
              className="text-sm font-medium mb-1"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Check Out
            </p>
            <p
              className="text-lg font-semibold"
              style={{ color: 'var(--color-text)' }}
            >
              {todayRecord?.checkOutTime
                ? formatTime(todayRecord.checkOutTime)
                : '--:--'}
            </p>
          </div>
        </div>

        {todayRecord?.totalHours && (
          <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <p
              className="text-sm"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Total Hours:{' '}
              <span
                className="font-semibold"
                style={{ color: 'var(--color-text)' }}
              >
                {todayRecord.totalHours.toFixed(2)}h
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleCheckIn}
          disabled={!canCheckIn() || isLoading}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: canCheckIn()
              ? 'var(--color-success)'
              : 'var(--color-muted)',
            color: canCheckIn()
              ? 'var(--color-text-on-primary)'
              : 'var(--color-text-muted)',
          }}
        >
          <LogIn className="w-4 h-4" />
          {isLoading ? 'Loading...' : 'Check In'}
        </button>

        <button
          onClick={handleCheckOut}
          disabled={!canCheckOut() || isLoading}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: canCheckOut()
              ? 'var(--color-error)'
              : 'var(--color-muted)',
            color: canCheckOut()
              ? 'var(--color-text-on-primary)'
              : 'var(--color-text-muted)',
          }}
        >
          <LogOut className="w-4 h-4" />
          {isLoading ? 'Loading...' : 'Check Out'}
        </button>
      </div>

      {/* Status Badge */}
      <div className="mt-4 flex items-center justify-center">
        <StatusBadge status={todayRecord?.status || 'absent'} />
      </div>
    </div>
  );
}

interface StatusBadgeProps {
  status: string;
}

function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'present':
        return {
          label: 'Present',
          bg: 'var(--color-success-bg)',
          text: 'var(--color-success-text)',
        };
      case 'absent':
        return {
          label: 'Not Checked In',
          bg: 'var(--color-warning-bg)',
          text: 'var(--color-warning-text)',
        };
      case 'on-leave':
        return {
          label: 'On Leave',
          bg: 'var(--color-info-bg)',
          text: 'var(--color-info-text)',
        };
      case 'half-day':
        return {
          label: 'Half Day',
          bg: 'var(--color-warning-bg)',
          text: 'var(--color-warning-text)',
        };
      default:
        return {
          label: status,
          bg: 'var(--color-muted)',
          text: 'var(--color-text-muted)',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <span
      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium"
      style={{
        backgroundColor: config.bg,
        color: config.text,
      }}
    >
      {status === 'absent' && <AlertCircle className="w-4 h-4" />}
      {config.label}
    </span>
  );
}
