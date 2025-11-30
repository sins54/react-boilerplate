/**
 * Pulse HR - Leave Management Types
 */

/** Leave types */
export type LeaveType = 'sick' | 'vacation' | 'personal';

/** Leave duration options */
export type LeaveDuration = 'full-day' | 'half-day';

/** Leave request status */
export type LeaveRequestStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

/** Leave request entity */
export interface LeaveRequest {
  id: string;
  userId: string;
  userDisplayName: string;
  leaveType: LeaveType;
  duration: LeaveDuration;
  startDate: string; // YYYY-MM-DD format
  endDate: string; // YYYY-MM-DD format
  reason: string;
  status: LeaveRequestStatus;
  /** Days requested (calculated from start/end date) */
  daysRequested: number;
  /** Indicates negative balance warning */
  isOverdraft: boolean;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  createdAt: string;
  updatedAt: string;
}

/** Form data for creating leave request */
export interface CreateLeaveRequestInput {
  leaveType: LeaveType;
  duration: LeaveDuration;
  startDate: string;
  endDate: string;
  reason: string;
}

/** Leave balance summary */
export interface LeaveBalance {
  leaveType: LeaveType;
  total: number;
  used: number;
  remaining: number;
  isNegative: boolean;
}
