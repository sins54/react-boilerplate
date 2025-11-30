/**
 * Pulse HR - Attendance Service
 * 
 * Handles attendance records, check-in/out, and adjustment requests
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
  AttendanceRecord,
  AdjustmentRequest,
  CreateAdjustmentRequestInput,
  AttendanceStatus,
} from '@/types/pulse-hr';
import { getTodayDateString } from '@/stores';

const ATTENDANCE_COLLECTION = 'attendance';
const ADJUSTMENT_COLLECTION = 'adjustmentRequests';

/**
 * Get or create today's attendance record
 */
export async function getTodayAttendance(userId: string): Promise<AttendanceRecord> {
  const today = getTodayDateString();
  const recordId = `${userId}_${today}`;

  if (!isFirebaseConfigured || !db) {
    return getMockTodayAttendance(userId, today);
  }

  const docRef = doc(db, ATTENDANCE_COLLECTION, recordId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as AttendanceRecord;
  }

  // Create new record for today
  const now = new Date().toISOString();
  const newRecord: AttendanceRecord = {
    id: recordId,
    userId,
    date: today,
    status: 'absent',
    createdAt: now,
    updatedAt: now,
  };

  await setDoc(docRef, newRecord);
  return newRecord;
}

/**
 * Check in for the day
 */
export async function checkIn(userId: string): Promise<AttendanceRecord> {
  const today = getTodayDateString();
  const recordId = `${userId}_${today}`;
  const now = new Date().toISOString();

  if (!isFirebaseConfigured || !db) {
    return {
      id: recordId,
      userId,
      date: today,
      checkInTime: now,
      status: 'present',
      createdAt: now,
      updatedAt: now,
    };
  }

  const docRef = doc(db, ATTENDANCE_COLLECTION, recordId);
  
  await updateDoc(docRef, {
    checkInTime: now,
    status: 'present',
    updatedAt: now,
  });

  const updated = await getDoc(docRef);
  return updated.data() as AttendanceRecord;
}

/**
 * Check out for the day
 */
export async function checkOut(userId: string): Promise<AttendanceRecord> {
  const today = getTodayDateString();
  const recordId = `${userId}_${today}`;
  const now = new Date().toISOString();

  if (!isFirebaseConfigured || !db) {
    return {
      id: recordId,
      userId,
      date: today,
      checkInTime: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      checkOutTime: now,
      status: 'present',
      totalHours: 8,
      createdAt: now,
      updatedAt: now,
    };
  }

  const docRef = doc(db, ATTENDANCE_COLLECTION, recordId);
  const docSnap = await getDoc(docRef);
  const current = docSnap.data() as AttendanceRecord;

  let totalHours: number | undefined;
  if (current.checkInTime) {
    const checkIn = new Date(current.checkInTime);
    const checkOutTime = new Date(now);
    totalHours = Math.round(
      ((checkOutTime.getTime() - checkIn.getTime()) / (1000 * 60 * 60)) * 100
    ) / 100;
  }

  await updateDoc(docRef, {
    checkOutTime: now,
    totalHours,
    updatedAt: now,
  });

  const updated = await getDoc(docRef);
  return updated.data() as AttendanceRecord;
}

/**
 * Get attendance records for a user within a date range
 */
export async function getUserAttendance(
  userId: string,
  startDate: string,
  endDate: string
): Promise<AttendanceRecord[]> {
  if (!isFirebaseConfigured || !db) {
    return getMockAttendanceRecords(userId);
  }

  const q = query(
    collection(db, ATTENDANCE_COLLECTION),
    where('userId', '==', userId),
    where('date', '>=', startDate),
    where('date', '<=', endDate),
    orderBy('date', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as AttendanceRecord);
}

/**
 * Get all attendance records for a date range (admin)
 */
export async function getAllAttendance(
  startDate: string,
  endDate: string
): Promise<AttendanceRecord[]> {
  if (!isFirebaseConfigured || !db) {
    return getMockAttendanceRecords('all');
  }

  const q = query(
    collection(db, ATTENDANCE_COLLECTION),
    where('date', '>=', startDate),
    where('date', '<=', endDate),
    orderBy('date', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as AttendanceRecord);
}

/**
 * Submit adjustment request
 */
export async function submitAdjustmentRequest(
  userId: string,
  userDisplayName: string,
  input: CreateAdjustmentRequestInput
): Promise<AdjustmentRequest> {
  const now = new Date().toISOString();
  const id = `adj_${userId}_${Date.now()}`;

  const request: AdjustmentRequest = {
    id,
    userId,
    userDisplayName,
    date: input.date,
    requestType: input.requestType,
    requestedCheckInTime: input.requestedCheckInTime,
    requestedCheckOutTime: input.requestedCheckOutTime,
    reason: input.reason,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
  };

  if (!isFirebaseConfigured || !db) {
    return request;
  }

  await setDoc(doc(db, ADJUSTMENT_COLLECTION, id), request);
  return request;
}

/**
 * Get pending adjustment requests (admin)
 */
export async function getPendingAdjustments(): Promise<AdjustmentRequest[]> {
  if (!isFirebaseConfigured || !db) {
    return getMockAdjustmentRequests();
  }

  const q = query(
    collection(db, ADJUSTMENT_COLLECTION),
    where('status', '==', 'pending'),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as AdjustmentRequest);
}

/**
 * Get user's adjustment requests
 */
export async function getUserAdjustments(userId: string): Promise<AdjustmentRequest[]> {
  if (!isFirebaseConfigured || !db) {
    return getMockAdjustmentRequests().filter((r) => r.userId === userId);
  }

  const q = query(
    collection(db, ADJUSTMENT_COLLECTION),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as AdjustmentRequest);
}

/**
 * Approve or reject adjustment request (admin)
 */
export async function reviewAdjustment(
  requestId: string,
  reviewerId: string,
  approved: boolean,
  notes?: string
): Promise<void> {
  const now = new Date().toISOString();

  if (!isFirebaseConfigured || !db) {
    return;
  }

  await updateDoc(doc(db, ADJUSTMENT_COLLECTION, requestId), {
    status: approved ? 'approved' : 'rejected',
    reviewedBy: reviewerId,
    reviewedAt: now,
    reviewNotes: notes,
    updatedAt: now,
  });

  // If approved, update the attendance record
  if (approved) {
    const requestDoc = await getDoc(doc(db, ADJUSTMENT_COLLECTION, requestId));
    const request = requestDoc.data() as AdjustmentRequest;
    const attendanceId = `${request.userId}_${request.date}`;

    const updates: Partial<AttendanceRecord> = {
      updatedAt: now,
    };

    if (request.requestedCheckInTime) {
      updates.checkInTime = request.requestedCheckInTime;
      updates.status = 'present';
    }
    if (request.requestedCheckOutTime) {
      updates.checkOutTime = request.requestedCheckOutTime;
    }

    await updateDoc(doc(db, ATTENDANCE_COLLECTION, attendanceId), updates);
  }
}

// Mock data generators
function getMockTodayAttendance(userId: string, today: string): AttendanceRecord {
  const now = new Date().toISOString();
  return {
    id: `${userId}_${today}`,
    userId,
    date: today,
    status: 'absent',
    createdAt: now,
    updatedAt: now,
  };
}

function getMockAttendanceRecords(userId: string): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const now = new Date();
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const day = date.getDay();
    
    // Skip weekends
    if (day === 0 || day === 6) continue;
    
    const checkIn = new Date(date);
    checkIn.setHours(9, Math.floor(Math.random() * 30), 0);
    
    const checkOut = new Date(date);
    checkOut.setHours(17 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60), 0);
    
    const status: AttendanceStatus = i % 10 === 0 ? 'on-leave' : 'present';
    
    records.push({
      id: `${userId === 'all' ? `mock-employee-${(i % 3) + 1}` : userId}_${dateStr}`,
      userId: userId === 'all' ? `mock-employee-${(i % 3) + 1}` : userId,
      date: dateStr,
      checkInTime: status === 'present' ? checkIn.toISOString() : undefined,
      checkOutTime: status === 'present' ? checkOut.toISOString() : undefined,
      status,
      totalHours: status === 'present' ? 8 + Math.random() : undefined,
      createdAt: date.toISOString(),
      updatedAt: date.toISOString(),
    });
  }
  
  return records;
}

function getMockAdjustmentRequests(): AdjustmentRequest[] {
  const now = new Date().toISOString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  return [
    {
      id: 'adj-mock-1',
      userId: 'mock-employee-1',
      userDisplayName: 'John Doe',
      date: yesterday.toISOString().split('T')[0],
      requestType: 'check-in',
      requestedCheckInTime: '2024-01-15T09:00:00.000Z',
      reason: 'Forgot to check in - was in a meeting',
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'adj-mock-2',
      userId: 'mock-employee-2',
      userDisplayName: 'Jane Smith',
      date: yesterday.toISOString().split('T')[0],
      requestType: 'both',
      requestedCheckInTime: '2024-01-15T08:30:00.000Z',
      requestedCheckOutTime: '2024-01-15T17:30:00.000Z',
      reason: 'System was down, could not log attendance',
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    },
  ];
}
