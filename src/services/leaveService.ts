/**
 * Pulse HR - Leave Service
 * 
 * Handles leave requests and balance management
 */

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import type {
  LeaveRequest,
  CreateLeaveRequestInput,
  LeaveBalance,
  LeaveType,
  PulseUser,
} from '@/types/pulse-hr';
import { calculateLeaveBalance } from '@/stores';

const LEAVE_COLLECTION = 'leaveRequests';
const USERS_COLLECTION = 'users';

/**
 * Submit a new leave request
 */
export async function submitLeaveRequest(
  userId: string,
  userDisplayName: string,
  input: CreateLeaveRequestInput,
  currentBalance: LeaveBalance
): Promise<LeaveRequest> {
  const now = new Date().toISOString();
  const id = `leave_${userId}_${Date.now()}`;

  // Calculate days requested
  const start = new Date(input.startDate);
  const end = new Date(input.endDate);
  let daysRequested = 0;
  
  // Count business days
  const current = new Date(start);
  while (current <= end) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) {
      daysRequested += input.duration === 'half-day' ? 0.5 : 1;
    }
    current.setDate(current.getDate() + 1);
  }

  // Check if this is an overdraft
  const isOverdraft = currentBalance.remaining - daysRequested < 0;

  const request: LeaveRequest = {
    id,
    userId,
    userDisplayName,
    leaveType: input.leaveType,
    duration: input.duration,
    startDate: input.startDate,
    endDate: input.endDate,
    reason: input.reason,
    status: 'pending',
    daysRequested,
    isOverdraft,
    createdAt: now,
    updatedAt: now,
  };

  if (!isFirebaseConfigured || !db) {
    return request;
  }

  await setDoc(doc(db, LEAVE_COLLECTION, id), request);
  return request;
}

/**
 * Get user's leave requests
 */
export async function getUserLeaveRequests(userId: string): Promise<LeaveRequest[]> {
  if (!isFirebaseConfigured || !db) {
    return getMockLeaveRequests().filter((r) => r.userId === userId);
  }

  const q = query(
    collection(db, LEAVE_COLLECTION),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as LeaveRequest);
}

/**
 * Get pending leave requests (admin)
 */
export async function getPendingLeaveRequests(): Promise<LeaveRequest[]> {
  if (!isFirebaseConfigured || !db) {
    return getMockLeaveRequests().filter((r) => r.status === 'pending');
  }

  const q = query(
    collection(db, LEAVE_COLLECTION),
    where('status', '==', 'pending'),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as LeaveRequest);
}

/**
 * Get all leave requests (admin)
 */
export async function getAllLeaveRequests(
  startDate?: string,
  endDate?: string
): Promise<LeaveRequest[]> {
  if (!isFirebaseConfigured || !db) {
    return getMockLeaveRequests();
  }

  let q = query(
    collection(db, LEAVE_COLLECTION),
    orderBy('startDate', 'desc')
  );

  if (startDate && endDate) {
    q = query(
      collection(db, LEAVE_COLLECTION),
      where('startDate', '>=', startDate),
      where('startDate', '<=', endDate),
      orderBy('startDate', 'desc')
    );
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as LeaveRequest);
}

/**
 * Approve or reject leave request (admin)
 */
export async function reviewLeaveRequest(
  requestId: string,
  reviewerId: string,
  approved: boolean,
  notes?: string
): Promise<void> {
  const now = new Date().toISOString();

  if (!isFirebaseConfigured || !db) {
    return;
  }

  const requestRef = doc(db, LEAVE_COLLECTION, requestId);
  const requestDoc = await getDoc(requestRef);
  const request = requestDoc.data() as LeaveRequest;

  await updateDoc(requestRef, {
    status: approved ? 'approved' : 'rejected',
    reviewedBy: reviewerId,
    reviewedAt: now,
    reviewNotes: notes,
    updatedAt: now,
  });

  // If approved, update user's used leave quota
  if (approved) {
    const userRef = doc(db, USERS_COLLECTION, request.userId);
    const userDoc = await getDoc(userRef);
    const user = userDoc.data() as PulseUser;

    const quotaField = getQuotaField(request.leaveType);
    const currentUsed = user.leaveQuotas[quotaField];

    await updateDoc(userRef, {
      [`leaveQuotas.${quotaField}`]: currentUsed + request.daysRequested,
      updatedAt: now,
    });
  }
}

/**
 * Cancel leave request (user)
 */
export async function cancelLeaveRequest(requestId: string): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    return;
  }

  await updateDoc(doc(db, LEAVE_COLLECTION, requestId), {
    status: 'cancelled',
    updatedAt: new Date().toISOString(),
  });
}

/**
 * Get user's leave balances
 */
export async function getUserLeaveBalances(userId: string): Promise<LeaveBalance[]> {
  if (!isFirebaseConfigured || !db) {
    return getMockLeaveBalances();
  }

  const userDoc = await getDoc(doc(db, USERS_COLLECTION, userId));
  
  if (!userDoc.exists()) {
    return [];
  }

  const user = userDoc.data() as PulseUser;
  const { leaveQuotas } = user;

  return [
    calculateLeaveBalance('sick', leaveQuotas.sickDays, leaveQuotas.usedSickDays),
    calculateLeaveBalance('vacation', leaveQuotas.vacationDays, leaveQuotas.usedVacationDays),
    calculateLeaveBalance('personal', leaveQuotas.personalDays, leaveQuotas.usedPersonalDays),
  ];
}

/**
 * Update user's leave quotas (admin)
 */
export async function updateLeaveQuotas(
  userId: string,
  quotas: { sickDays?: number; vacationDays?: number; personalDays?: number }
): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    return;
  }

  const updates: Record<string, number | string> = {
    updatedAt: new Date().toISOString(),
  };

  if (quotas.sickDays !== undefined) {
    updates['leaveQuotas.sickDays'] = quotas.sickDays;
  }
  if (quotas.vacationDays !== undefined) {
    updates['leaveQuotas.vacationDays'] = quotas.vacationDays;
  }
  if (quotas.personalDays !== undefined) {
    updates['leaveQuotas.personalDays'] = quotas.personalDays;
  }

  await updateDoc(doc(db, USERS_COLLECTION, userId), updates);
}

// Helper functions
function getQuotaField(leaveType: LeaveType): keyof PulseUser['leaveQuotas'] {
  switch (leaveType) {
    case 'sick':
      return 'usedSickDays';
    case 'vacation':
      return 'usedVacationDays';
    case 'personal':
      return 'usedPersonalDays';
  }
}

// Mock data generators
function getMockLeaveRequests(): LeaveRequest[] {
  const now = new Date().toISOString();
  
  return [
    {
      id: 'leave-mock-1',
      userId: 'mock-employee-1',
      userDisplayName: 'John Doe',
      leaveType: 'vacation',
      duration: 'full-day',
      startDate: '2024-02-01',
      endDate: '2024-02-05',
      reason: 'Family vacation',
      status: 'pending',
      daysRequested: 5,
      isOverdraft: false,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'leave-mock-2',
      userId: 'mock-employee-2',
      userDisplayName: 'Jane Smith',
      leaveType: 'sick',
      duration: 'full-day',
      startDate: '2024-01-20',
      endDate: '2024-01-20',
      reason: 'Doctor appointment',
      status: 'approved',
      daysRequested: 1,
      isOverdraft: false,
      reviewedBy: 'mock-admin-1',
      reviewedAt: now,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'leave-mock-3',
      userId: 'mock-employee-1',
      userDisplayName: 'John Doe',
      leaveType: 'vacation',
      duration: 'full-day',
      startDate: '2024-03-15',
      endDate: '2024-03-20',
      reason: 'Extended vacation - requesting despite low balance',
      status: 'pending',
      daysRequested: 6,
      isOverdraft: true,
      createdAt: now,
      updatedAt: now,
    },
  ];
}

function getMockLeaveBalances(): LeaveBalance[] {
  return [
    calculateLeaveBalance('sick', 12, 3),
    calculateLeaveBalance('vacation', 15, 8),
    calculateLeaveBalance('personal', 5, 1),
  ];
}
