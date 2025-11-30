/**
 * Pulse HR - Leave Balance Card
 * 
 * Displays leave balance summary with visual indicators
 */

import { Briefcase, Thermometer, User } from 'lucide-react';
import type { LeaveBalance } from '@/types/pulse-hr';

interface LeaveBalanceCardProps {
  balances: LeaveBalance[];
}

export function LeaveBalanceCard({ balances }: LeaveBalanceCardProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'vacation':
        return <Briefcase className="w-5 h-5" />;
      case 'sick':
        return <Thermometer className="w-5 h-5" />;
      case 'personal':
        return <User className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getLabel = (type: string) => {
    switch (type) {
      case 'vacation':
        return 'Vacation Days';
      case 'sick':
        return 'Sick Days';
      case 'personal':
        return 'Personal Days';
      default:
        return type;
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
      <h3
        className="text-lg font-semibold mb-4"
        style={{ color: 'var(--color-text)' }}
      >
        Leave Balance
      </h3>

      <div className="space-y-4">
        {balances.map((balance) => (
          <div key={balance.leaveType}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span style={{ color: 'var(--color-primary)' }}>
                  {getIcon(balance.leaveType)}
                </span>
                <span
                  className="text-sm font-medium"
                  style={{ color: 'var(--color-text)' }}
                >
                  {getLabel(balance.leaveType)}
                </span>
              </div>
              <span
                className="text-sm font-semibold"
                style={{
                  color: balance.isNegative
                    ? 'var(--color-error)'
                    : 'var(--color-text)',
                }}
              >
                {balance.remaining} / {balance.total}
              </span>
            </div>

            {/* Progress Bar */}
            <div
              className="h-2 rounded-full overflow-hidden"
              style={{ backgroundColor: 'var(--color-muted)' }}
            >
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, Math.max(0, (balance.remaining / balance.total) * 100))}%`,
                  backgroundColor: balance.isNegative
                    ? 'var(--color-error)'
                    : balance.remaining <= balance.total * 0.2
                    ? 'var(--color-warning)'
                    : 'var(--color-success)',
                }}
              />
            </div>

            {/* Used label */}
            <p
              className="text-xs mt-1"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {balance.used} days used
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
