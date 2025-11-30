/**
 * Pulse HR - Leave Management Page
 * 
 * Leave requests and balance management
 */

import { useEffect, useState } from 'react';
import { Calendar, Plus, History, Clock } from 'lucide-react';
import { useAuthStore, useLeaveStore } from '@/stores';
import { LeaveRequestForm, LeaveBalanceCard } from '@/components/pulse-hr/leave';
import {
  submitLeaveRequest,
  getUserLeaveRequests,
  getUserLeaveBalances,
  cancelLeaveRequest,
} from '@/services';
import type { CreateLeaveRequestInput, LeaveRequest } from '@/types/pulse-hr';

export function LeavePage() {
  const { user } = useAuthStore();
  const { requests, setRequests, balances, setBalances } = useLeaveStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');

  useEffect(() => {
    if (user) {
      loadLeaveData();
    }
  }, [user]);

  const loadLeaveData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [leaveRequests, leaveBalances] = await Promise.all([
        getUserLeaveRequests(user.id),
        getUserLeaveBalances(user.id),
      ]);
      setRequests(leaveRequests);
      setBalances(leaveBalances);
    } catch (error) {
      console.error('Failed to load leave data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitRequest = async (data: CreateLeaveRequestInput) => {
    if (!user) return;
    setIsLoading(true);
    try {
      const balance = balances.find((b) => b.leaveType === data.leaveType);
      if (!balance) throw new Error('Balance not found');

      const newRequest = await submitLeaveRequest(
        user.id,
        user.displayName,
        data,
        balance
      );
      setRequests([newRequest, ...requests]);
      setShowRequestForm(false);
    } catch (error) {
      console.error('Failed to submit leave request:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    setIsLoading(true);
    try {
      await cancelLeaveRequest(requestId);
      setRequests(
        requests.map((r) =>
          r.id === requestId ? { ...r, status: 'cancelled' } : r
        )
      );
    } catch (error) {
      console.error('Failed to cancel request:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const pendingRequests = requests.filter((r) => r.status === 'pending');
  const historyRequests = requests.filter((r) => r.status !== 'pending');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ color: 'var(--color-text)' }}
          >
            Leave Management
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: 'var(--color-text-muted)' }}
          >
            View your leave balance and submit requests
          </p>
        </div>
        <button
          onClick={() => setShowRequestForm(true)}
          className="flex items-center gap-2 py-2 px-4 rounded-lg font-medium text-sm"
          style={{
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-text-on-primary)',
          }}
        >
          <Plus className="w-4 h-4" />
          Request Leave
        </button>
      </div>

      {/* Leave Balance */}
      <LeaveBalanceCard balances={balances} />

      {/* Request Form Modal */}
      {showRequestForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <LeaveRequestForm
              balances={balances}
              onSubmit={handleSubmitRequest}
              onCancel={() => setShowRequestForm(false)}
              isLoading={isLoading}
            />
          </div>
        </div>
      )}

      {/* Tabs */}
      <div
        className="flex gap-1 p-1 rounded-lg"
        style={{ backgroundColor: 'var(--color-muted)' }}
      >
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium text-sm transition-colors`}
          style={{
            backgroundColor: activeTab === 'pending' ? 'var(--color-surface)' : 'transparent',
            color: activeTab === 'pending' ? 'var(--color-text)' : 'var(--color-text-muted)',
          }}
        >
          <Clock className="w-4 h-4" />
          Pending
          {pendingRequests.length > 0 && (
            <span
              className="text-xs px-1.5 py-0.5 rounded-full"
              style={{
                backgroundColor: 'var(--color-warning)',
                color: 'var(--color-text-on-primary)',
              }}
            >
              {pendingRequests.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium text-sm transition-colors`}
          style={{
            backgroundColor: activeTab === 'history' ? 'var(--color-surface)' : 'transparent',
            color: activeTab === 'history' ? 'var(--color-text)' : 'var(--color-text-muted)',
          }}
        >
          <History className="w-4 h-4" />
          History
        </button>
      </div>

      {/* Request List */}
      <LeaveRequestList
        requests={activeTab === 'pending' ? pendingRequests : historyRequests}
        onCancel={handleCancelRequest}
        showCancel={activeTab === 'pending'}
        isLoading={isLoading}
      />
    </div>
  );
}

interface LeaveRequestListProps {
  requests: LeaveRequest[];
  onCancel: (id: string) => void;
  showCancel: boolean;
  isLoading: boolean;
}

function LeaveRequestList({
  requests,
  onCancel,
  showCancel,
  isLoading,
}: LeaveRequestListProps) {
  if (requests.length === 0) {
    return (
      <div
        className="rounded-lg p-8 text-center"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <Calendar
          className="w-12 h-12 mx-auto mb-3 opacity-50"
          style={{ color: 'var(--color-text-muted)' }}
        />
        <p style={{ color: 'var(--color-text-muted)' }}>
          No leave requests found
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {requests.map((request) => (
        <div
          key={request.id}
          className={`rounded-lg p-4 border ${request.isOverdraft ? 'ring-2 ring-[var(--color-warning)]' : ''}`}
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: request.isOverdraft
              ? 'var(--color-warning)'
              : 'var(--color-border)',
          }}
        >
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="flex items-center gap-2">
                <p
                  className="font-medium capitalize"
                  style={{ color: 'var(--color-text)' }}
                >
                  {request.leaveType} Leave
                </p>
                {request.isOverdraft && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: 'var(--color-warning-bg)',
                      color: 'var(--color-warning-text)',
                    }}
                  >
                    Overdraft
                  </span>
                )}
              </div>
              <p
                className="text-sm"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {new Date(request.startDate).toLocaleDateString()} -{' '}
                {new Date(request.endDate).toLocaleDateString()}
              </p>
            </div>
            <StatusBadge status={request.status} />
          </div>

          <div className="flex items-center gap-4 text-sm mb-2">
            <span style={{ color: 'var(--color-text-secondary)' }}>
              <strong>{request.daysRequested}</strong> day(s)
            </span>
            <span
              className="capitalize"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {request.duration.replace('-', ' ')}
            </span>
          </div>

          <p
            className="text-sm"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {request.reason}
          </p>

          {request.reviewNotes && (
            <p
              className="text-sm mt-2 p-2 rounded"
              style={{
                backgroundColor: 'var(--color-bg-secondary)',
                color: 'var(--color-text-muted)',
              }}
            >
              <strong>Admin Note:</strong> {request.reviewNotes}
            </p>
          )}

          {showCancel && request.status === 'pending' && (
            <button
              onClick={() => onCancel(request.id)}
              disabled={isLoading}
              className="mt-3 text-sm font-medium transition-colors disabled:opacity-50"
              style={{ color: 'var(--color-error)' }}
            >
              Cancel Request
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const getConfig = () => {
    switch (status) {
      case 'approved':
        return {
          bg: 'var(--color-success-bg)',
          text: 'var(--color-success-text)',
        };
      case 'pending':
        return {
          bg: 'var(--color-warning-bg)',
          text: 'var(--color-warning-text)',
        };
      case 'rejected':
        return {
          bg: 'var(--color-error-bg)',
          text: 'var(--color-error-text)',
        };
      case 'cancelled':
        return {
          bg: 'var(--color-muted)',
          text: 'var(--color-text-muted)',
        };
      default:
        return {
          bg: 'var(--color-muted)',
          text: 'var(--color-text-muted)',
        };
    }
  };

  const config = getConfig();

  return (
    <span
      className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium capitalize"
      style={{ backgroundColor: config.bg, color: config.text }}
    >
      {status}
    </span>
  );
}
