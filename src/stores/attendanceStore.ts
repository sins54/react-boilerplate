/**
 * Pulse HR - Attendance Store (Zustand)
 * 
 * Manages attendance state including check-in/out and daily records
 */

import { create } from 'zustand';
import type { AttendanceRecord, AdjustmentRequest } from '@/types/pulse-hr';

interface AttendanceState {
  todayRecord: AttendanceRecord | null;
  records: AttendanceRecord[];
  adjustmentRequests: AdjustmentRequest[];
  isLoading: boolean;
  error: string | null;
}

interface AttendanceActions {
  setTodayRecord: (record: AttendanceRecord | null) => void;
  setRecords: (records: AttendanceRecord[]) => void;
  setAdjustmentRequests: (requests: AdjustmentRequest[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  checkIn: (time: string) => void;
  checkOut: (time: string) => void;
  canCheckIn: () => boolean;
  canCheckOut: () => boolean;
  reset: () => void;
}

type AttendanceStore = AttendanceState & AttendanceActions;

const initialState: AttendanceState = {
  todayRecord: null,
  records: [],
  adjustmentRequests: [],
  isLoading: false,
  error: null,
};

export const useAttendanceStore = create<AttendanceStore>()((set, get) => ({
  ...initialState,

  setTodayRecord: (todayRecord) => set({ todayRecord }),

  setRecords: (records) => set({ records }),

  setAdjustmentRequests: (adjustmentRequests) => set({ adjustmentRequests }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error, isLoading: false }),

  checkIn: (time) => {
    const { todayRecord } = get();
    if (todayRecord) {
      set({
        todayRecord: {
          ...todayRecord,
          checkInTime: time,
          status: 'present',
          updatedAt: new Date().toISOString(),
        },
      });
    }
  },

  checkOut: (time) => {
    const { todayRecord } = get();
    if (todayRecord && todayRecord.checkInTime) {
      const checkIn = new Date(todayRecord.checkInTime);
      const checkOut = new Date(time);
      const totalHours = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);

      set({
        todayRecord: {
          ...todayRecord,
          checkOutTime: time,
          totalHours: Math.round(totalHours * 100) / 100,
          updatedAt: new Date().toISOString(),
        },
      });
    }
  },

  canCheckIn: () => {
    const { todayRecord } = get();
    return !todayRecord?.checkInTime;
  },

  canCheckOut: () => {
    const { todayRecord } = get();
    return !!todayRecord?.checkInTime && !todayRecord?.checkOutTime;
  },

  reset: () => set(initialState),
}));

/** Get today's date in YYYY-MM-DD format */
export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

/** Format time for display */
export function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}
