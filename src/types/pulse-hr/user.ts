/**
 * Pulse HR - User & Authentication Types
 */

/** User roles in the system */
export type UserRole = 'admin' | 'employee';

/** User entity stored in Firestore */
export interface PulseUser {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  department?: string;
  position?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  /** Leave quotas for this user */
  leaveQuotas: LeaveQuotas;
}

/** Leave quota configuration per user */
export interface LeaveQuotas {
  sickDays: number;
  vacationDays: number;
  personalDays: number;
  /** Used leave days */
  usedSickDays: number;
  usedVacationDays: number;
  usedPersonalDays: number;
}

/** Default leave quotas for new users */
export const DEFAULT_LEAVE_QUOTAS: LeaveQuotas = {
  sickDays: 12,
  vacationDays: 15,
  personalDays: 5,
  usedSickDays: 0,
  usedVacationDays: 0,
  usedPersonalDays: 0,
};

/** Form data for creating a new user (admin only) */
export interface CreateUserInput {
  email: string;
  password: string;
  displayName: string;
  role: UserRole;
  department?: string;
  position?: string;
}
