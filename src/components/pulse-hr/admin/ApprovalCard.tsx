/**
 * Pulse HR - Approval Card
 * 
 * Generic card for approval workflows (Leave, Adjustments)
 */

import React from 'react';
import { Check, X, AlertTriangle, Calendar, User, Clock } from 'lucide-react';

export interface ApprovalItem {
  id: string;
  type: 'leave' | 'adjustment';
  userName: string;
  date: string;
  details: string;
  reason: string;
  hasWarning?: boolean;
  warningMessage?: string;
  createdAt: string;
}

interface ApprovalCardProps {
  item: ApprovalItem;
  onApprove: (id: string, notes?: string) => Promise<void>;
  onReject: (id: string, notes?: string) => Promise<void>;
  isLoading?: boolean;
}

export function ApprovalCard({
  item,
  onApprove,
  onReject,
  isLoading = false,
}: ApprovalCardProps) {
  const [notes, setNotes] = React.useState('');
  const [showNotes, setShowNotes] = React.useState(false);

  const handleApprove = async () => {
    await onApprove(item.id, notes || undefined);
  };

  const handleReject = async () => {
    setShowNotes(true);
  };

  const confirmReject = async () => {
    await onReject(item.id, notes || undefined);
    setShowNotes(false);
    setNotes('');
  };

  return (
    <div
      className="rounded-lg p-4 shadow-sm border"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: item.hasWarning ? 'var(--color-warning)' : 'var(--color-border)',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
          <span
            className="font-semibold"
            style={{ color: 'var(--color-text)' }}
          >
            {item.userName}
          </span>
        </div>
        <span
          className="text-xs px-2 py-1 rounded-full capitalize"
          style={{
            backgroundColor: item.type === 'leave' ? 'var(--color-info-bg)' : 'var(--color-warning-bg)',
            color: item.type === 'leave' ? 'var(--color-info-text)' : 'var(--color-warning-text)',
          }}
        >
          {item.type === 'leave' ? 'Leave Request' : 'Adjustment'}
        </span>
      </div>

      {/* Warning */}
      {item.hasWarning && item.warningMessage && (
        <div
          className="flex items-center gap-2 p-2 rounded-md mb-3"
          style={{
            backgroundColor: 'var(--color-warning-bg)',
            color: 'var(--color-warning-text)',
          }}
        >
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <p className="text-xs font-medium">{item.warningMessage}</p>
        </div>
      )}

      {/* Details */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2">
          <Calendar
            className="w-4 h-4"
            style={{ color: 'var(--color-text-muted)' }}
          />
          <span className="text-sm" style={{ color: 'var(--color-text)' }}>
            {item.date}
          </span>
        </div>
        <p
          className="text-sm font-medium"
          style={{ color: 'var(--color-text)' }}
        >
          {item.details}
        </p>
        <p
          className="text-sm"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <strong>Reason:</strong> {item.reason}
        </p>
        <div className="flex items-center gap-1">
          <Clock
            className="w-3 h-3"
            style={{ color: 'var(--color-text-muted)' }}
          />
          <span
            className="text-xs"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Submitted {new Date(item.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Notes Input (for rejection) */}
      {showNotes && (
        <div className="mb-3">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes (optional)..."
            rows={2}
            className="w-full px-3 py-2 rounded-md border text-sm resize-none"
            style={{
              backgroundColor: 'var(--color-bg)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setShowNotes(false)}
              className="flex-1 py-1.5 px-3 rounded-md text-sm font-medium"
              style={{
                backgroundColor: 'var(--color-muted)',
                color: 'var(--color-text)',
              }}
            >
              Cancel
            </button>
            <button
              onClick={confirmReject}
              disabled={isLoading}
              className="flex-1 py-1.5 px-3 rounded-md text-sm font-medium disabled:opacity-50"
              style={{
                backgroundColor: 'var(--color-error)',
                color: 'var(--color-text-on-primary)',
              }}
            >
              Confirm Reject
            </button>
          </div>
        </div>
      )}

      {/* Actions */}
      {!showNotes && (
        <div className="flex gap-2">
          <button
            onClick={handleReject}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-md font-medium text-sm transition-colors disabled:opacity-50"
            style={{
              backgroundColor: 'var(--color-error-bg)',
              color: 'var(--color-error)',
            }}
          >
            <X className="w-4 h-4" />
            Reject
          </button>
          <button
            onClick={handleApprove}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-md font-medium text-sm transition-colors disabled:opacity-50"
            style={{
              backgroundColor: 'var(--color-success)',
              color: 'var(--color-text-on-primary)',
            }}
          >
            <Check className="w-4 h-4" />
            Approve
          </button>
        </div>
      )}
    </div>
  );
}
