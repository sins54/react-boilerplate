/**
 * Pulse HR - Attendance Page
 * 
 * Attendance history and adjustment requests
 */

import { useEffect, useState } from 'react';
import { AlertCircle, History, Plus } from 'lucide-react';
import { useAuthStore, useAttendanceStore, formatTime } from '@/stores';
import { AttendanceWidget, AdjustmentRequestForm } from '@/components/pulse-hr/attendance';
import {
  getTodayAttendance,
  checkIn,
  checkOut,
  getUserAttendance,
  submitAdjustmentRequest,
  getUserAdjustments,
} from '@/services';
import type { AttendanceRecord, AdjustmentRequest, CreateAdjustmentRequestInput } from '@/types/pulse-hr';

export function AttendancePage() {
  const { user } = useAuthStore();
  const { setTodayRecord, records, setRecords, adjustmentRequests, setAdjustmentRequests } = useAttendanceStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showAdjustmentForm, setShowAdjustmentForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'history' | 'adjustments'>('history');

  useEffect(() => {
    if (user) {
      loadAttendanceData();
    }
  }, [user]);

  const loadAttendanceData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      // Get last 30 days of attendance
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];

      const [today, history, adjustments] = await Promise.all([
        getTodayAttendance(user.id),
        getUserAttendance(user.id, startDate, endDate),
        getUserAdjustments(user.id),
      ]);

      setTodayRecord(today);
      setRecords(history);
      setAdjustmentRequests(adjustments);
    } catch (error) {
      console.error('Failed to load attendance data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const updated = await checkIn(user.id);
      setTodayRecord(updated);
    } catch (error) {
      console.error('Check-in failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const updated = await checkOut(user.id);
      setTodayRecord(updated);
    } catch (error) {
      console.error('Check-out failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdjustmentSubmit = async (data: CreateAdjustmentRequestInput) => {
    if (!user) return;
    setIsLoading(true);
    try {
      const newRequest = await submitAdjustmentRequest(
        user.id,
        user.displayName,
        data
      );
      setAdjustmentRequests([newRequest, ...adjustmentRequests]);
      setShowAdjustmentForm(false);
    } catch (error) {
      console.error('Failed to submit adjustment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ color: 'var(--color-text)' }}
          >
            Attendance
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Track your work hours and request adjustments
          </p>
        </div>
        <button
          onClick={() => setShowAdjustmentForm(true)}
          className="flex items-center gap-2 py-2 px-4 rounded-lg font-medium text-sm"
          style={{
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-text-on-primary)',
          }}
        >
          <Plus className="w-4 h-4" />
          Request Adjustment
        </button>
      </div>

      {/* Attendance Widget */}
      <AttendanceWidget
        onCheckIn={handleCheckIn}
        onCheckOut={handleCheckOut}
        isLoading={isLoading}
      />

      {/* Adjustment Form Modal */}
      {showAdjustmentForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <AdjustmentRequestForm
              onSubmit={handleAdjustmentSubmit}
              onCancel={() => setShowAdjustmentForm(false)}
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
        <button
          onClick={() => setActiveTab('adjustments')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium text-sm transition-colors`}
          style={{
            backgroundColor: activeTab === 'adjustments' ? 'var(--color-surface)' : 'transparent',
            color: activeTab === 'adjustments' ? 'var(--color-text)' : 'var(--color-text-muted)',
          }}
        >
          <AlertCircle className="w-4 h-4" />
          Adjustments
          {adjustmentRequests.filter((r) => r.status === 'pending').length > 0 && (
            <span
              className="text-xs px-1.5 py-0.5 rounded-full"
              style={{
                backgroundColor: 'var(--color-warning)',
                color: 'var(--color-text-on-primary)',
              }}
            >
              {adjustmentRequests.filter((r) => r.status === 'pending').length}
            </span>
          )}
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'history' ? (
        <AttendanceHistoryTable records={records} />
      ) : (
        <AdjustmentRequestList requests={adjustmentRequests} />
      )}
    </div>
  );
}

interface AttendanceHistoryTableProps {
  records: AttendanceRecord[];
}

function AttendanceHistoryTable({ records }: AttendanceHistoryTableProps) {
  if (records.length === 0) {
    return (
      <div
        className="rounded-lg p-8 text-center"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <History
          className="w-12 h-12 mx-auto mb-3 opacity-50"
          style={{ color: 'var(--color-text-muted)' }}
        />
        <p style={{ color: 'var(--color-text-muted)' }}>
          No attendance records found
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-lg border overflow-hidden"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
              <th
                className="px-4 py-3 text-left text-xs font-medium uppercase"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Date
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium uppercase"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Check In
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium uppercase"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Check Out
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium uppercase"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Hours
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium uppercase"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
            {records.map((record) => (
              <tr key={record.id}>
                <td
                  className="px-4 py-3 text-sm font-medium"
                  style={{ color: 'var(--color-text)' }}
                >
                  {new Date(record.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </td>
                <td
                  className="px-4 py-3 text-sm"
                  style={{ color: 'var(--color-text)' }}
                >
                  {record.checkInTime ? formatTime(record.checkInTime) : '--:--'}
                </td>
                <td
                  className="px-4 py-3 text-sm"
                  style={{ color: 'var(--color-text)' }}
                >
                  {record.checkOutTime ? formatTime(record.checkOutTime) : '--:--'}
                </td>
                <td
                  className="px-4 py-3 text-sm"
                  style={{ color: 'var(--color-text)' }}
                >
                  {record.totalHours ? `${record.totalHours.toFixed(1)}h` : '-'}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={record.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface AdjustmentRequestListProps {
  requests: AdjustmentRequest[];
}

function AdjustmentRequestList({ requests }: AdjustmentRequestListProps) {
  if (requests.length === 0) {
    return (
      <div
        className="rounded-lg p-8 text-center"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <AlertCircle
          className="w-12 h-12 mx-auto mb-3 opacity-50"
          style={{ color: 'var(--color-text-muted)' }}
        />
        <p style={{ color: 'var(--color-text-muted)' }}>
          No adjustment requests found
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {requests.map((request) => (
        <div
          key={request.id}
          className="rounded-lg p-4 border"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <div className="flex items-start justify-between mb-2">
            <div>
              <p
                className="font-medium"
                style={{ color: 'var(--color-text)' }}
              >
                {new Date(request.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              <p
                className="text-sm capitalize"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {request.requestType.replace('-', ' ')} correction
              </p>
            </div>
            <StatusBadge status={request.status} />
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
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const getConfig = () => {
    switch (status) {
      case 'present':
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
      case 'absent':
        return {
          bg: 'var(--color-error-bg)',
          text: 'var(--color-error-text)',
        };
      case 'on-leave':
        return {
          bg: 'var(--color-info-bg)',
          text: 'var(--color-info-text)',
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
      {status.replace('-', ' ')}
    </span>
  );
}
