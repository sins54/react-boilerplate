/**
 * Pulse HR - Attendance Types
 */

/** Attendance status options */
export type AttendanceStatus = 'present' | 'absent' | 'on-leave' | 'half-day';

/** Daily attendance record */
export interface AttendanceRecord {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD format
  checkInTime?: string; // ISO timestamp
  checkOutTime?: string; // ISO timestamp
  status: AttendanceStatus;
  totalHours?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/** Adjustment request status */
export type AdjustmentRequestStatus = 'pending' | 'approved' | 'rejected';

/** Adjustment request for forgotten check-in/out */
export interface AdjustmentRequest {
  id: string;
  userId: string;
  userDisplayName: string;
  date: string; // YYYY-MM-DD format
  requestType: 'check-in' | 'check-out' | 'both';
  requestedCheckInTime?: string;
  requestedCheckOutTime?: string;
  reason: string;
  status: AdjustmentRequestStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  createdAt: string;
  updatedAt: string;
}

/** Form data for creating adjustment request */
export interface CreateAdjustmentRequestInput {
  date: string;
  requestType: 'check-in' | 'check-out' | 'both';
  requestedCheckInTime?: string;
  requestedCheckOutTime?: string;
  reason: string;
}

/** Check-in/out action payload */
export interface AttendanceAction {
  userId: string;
  action: 'check-in' | 'check-out';
  timestamp: string;
}
