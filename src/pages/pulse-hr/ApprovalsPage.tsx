/**
 * Pulse HR - Approvals Page (Admin Only)
 * 
 * Approve/reject leave requests and attendance adjustments
 */

import { useEffect, useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { useAuthStore } from '@/stores';
import { ApprovalCard, type ApprovalItem } from '@/components/pulse-hr/admin';
import { getPendingLeaveRequests, reviewLeaveRequest } from '@/services/leaveService';
import { getPendingAdjustments, reviewAdjustment } from '@/services/attendanceService';
import type { LeaveRequest, AdjustmentRequest } from '@/types/pulse-hr';

export function ApprovalsPage() {
  const { user } = useAuthStore();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [adjustments, setAdjustments] = useState<AdjustmentRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'leave' | 'adjustments'>('leave');

  useEffect(() => {
    loadPendingItems();
  }, []);

  const loadPendingItems = async () => {
    setIsLoading(true);
    try {
      const [leaves, adjs] = await Promise.all([
        getPendingLeaveRequests(),
        getPendingAdjustments(),
      ]);
      setLeaveRequests(leaves);
      setAdjustments(adjs);
    } catch (error) {
      console.error('Failed to load pending items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeaveApprove = async (id: string, notes?: string) => {
    if (!user) return;
    setIsLoading(true);
    try {
      await reviewLeaveRequest(id, user.id, true, notes);
      setLeaveRequests(leaveRequests.filter((r) => r.id !== id));
    } catch (error) {
      console.error('Failed to approve leave:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeaveReject = async (id: string, notes?: string) => {
    if (!user) return;
    setIsLoading(true);
    try {
      await reviewLeaveRequest(id, user.id, false, notes);
      setLeaveRequests(leaveRequests.filter((r) => r.id !== id));
    } catch (error) {
      console.error('Failed to reject leave:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdjustmentApprove = async (id: string, notes?: string) => {
    if (!user) return;
    setIsLoading(true);
    try {
      await reviewAdjustment(id, user.id, true, notes);
      setAdjustments(adjustments.filter((r) => r.id !== id));
    } catch (error) {
      console.error('Failed to approve adjustment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdjustmentReject = async (id: string, notes?: string) => {
    if (!user) return;
    setIsLoading(true);
    try {
      await reviewAdjustment(id, user.id, false, notes);
      setAdjustments(adjustments.filter((r) => r.id !== id));
    } catch (error) {
      console.error('Failed to reject adjustment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const leaveApprovalItems: ApprovalItem[] = leaveRequests.map((r) => ({
    id: r.id,
    type: 'leave',
    userName: r.userDisplayName,
    date: `${new Date(r.startDate).toLocaleDateString()} - ${new Date(r.endDate).toLocaleDateString()}`,
    details: `${r.leaveType} leave (${r.daysRequested} day${r.daysRequested !== 1 ? 's' : ''}, ${r.duration})`,
    reason: r.reason,
    hasWarning: r.isOverdraft,
    warningMessage: r.isOverdraft ? 'Negative balance warning: User is requesting more days than available' : undefined,
    createdAt: r.createdAt,
  }));

  const adjustmentApprovalItems: ApprovalItem[] = adjustments.map((r) => ({
    id: r.id,
    type: 'adjustment',
    userName: r.userDisplayName,
    date: new Date(r.date).toLocaleDateString(),
    details: `${r.requestType.replace('-', ' ')} correction${
      r.requestedCheckInTime
        ? ` - In: ${new Date(r.requestedCheckInTime).toLocaleTimeString()}`
        : ''
    }${
      r.requestedCheckOutTime
        ? ` - Out: ${new Date(r.requestedCheckOutTime).toLocaleTimeString()}`
        : ''
    }`,
    reason: r.reason,
    createdAt: r.createdAt,
  }));

  const totalPending = leaveRequests.length + adjustments.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1
          className="text-2xl font-bold"
          style={{ color: 'var(--color-text)' }}
        >
          Approvals
        </h1>
        <p
          className="text-sm mt-1"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Review and approve pending requests ({totalPending} pending)
        </p>
      </div>

      {/* Tabs */}
      <div
        className="flex gap-1 p-1 rounded-lg"
        style={{ backgroundColor: 'var(--color-muted)' }}
      >
        <button
          onClick={() => setActiveTab('leave')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium text-sm transition-colors`}
          style={{
            backgroundColor: activeTab === 'leave' ? 'var(--color-surface)' : 'transparent',
            color: activeTab === 'leave' ? 'var(--color-text)' : 'var(--color-text-muted)',
          }}
        >
          <Calendar className="w-4 h-4" />
          Leave Requests
          {leaveRequests.length > 0 && (
            <span
              className="text-xs px-1.5 py-0.5 rounded-full"
              style={{
                backgroundColor: 'var(--color-warning)',
                color: 'var(--color-text-on-primary)',
              }}
            >
              {leaveRequests.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('adjustments')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium text-sm transition-colors`}
          style={{
            backgroundColor: activeTab === 'adjustments' ? 'var(--color-surface)' : 'transparent',
            color: activeTab === 'adjustments' ? 'var(--color-text)' : 'var(--color-text-muted)',
          }}
        >
          <Clock className="w-4 h-4" />
          Adjustments
          {adjustments.length > 0 && (
            <span
              className="text-xs px-1.5 py-0.5 rounded-full"
              style={{
                backgroundColor: 'var(--color-warning)',
                color: 'var(--color-text-on-primary)',
              }}
            >
              {adjustments.length}
            </span>
          )}
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
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
      ) : activeTab === 'leave' ? (
        leaveApprovalItems.length === 0 ? (
          <EmptyState
            icon={<Calendar className="w-12 h-12" />}
            message="No pending leave requests"
          />
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {leaveApprovalItems.map((item) => (
              <ApprovalCard
                key={item.id}
                item={item}
                onApprove={handleLeaveApprove}
                onReject={handleLeaveReject}
                isLoading={isLoading}
              />
            ))}
          </div>
        )
      ) : adjustmentApprovalItems.length === 0 ? (
        <EmptyState
          icon={<Clock className="w-12 h-12" />}
          message="No pending adjustment requests"
        />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {adjustmentApprovalItems.map((item) => (
            <ApprovalCard
              key={item.id}
              item={item}
              onApprove={handleAdjustmentApprove}
              onReject={handleAdjustmentReject}
              isLoading={isLoading}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface EmptyStateProps {
  icon: React.ReactNode;
  message: string;
}

function EmptyState({ icon, message }: EmptyStateProps) {
  return (
    <div
      className="rounded-lg p-8 text-center"
      style={{
        backgroundColor: 'var(--color-surface)',
      }}
    >
      <div
        className="mx-auto mb-3 opacity-50"
        style={{ color: 'var(--color-text-muted)' }}
      >
        {icon}
      </div>
      <p style={{ color: 'var(--color-text-muted)' }}>{message}</p>
    </div>
  );
}
