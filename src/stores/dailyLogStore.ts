/**
 * Pulse HR - Daily Log Store (Zustand)
 * 
 * Manages daily task updates and logs
 */

import { create } from 'zustand';
import type { DailyLog, CompletedTicketEntry } from '@/types/pulse-hr';

interface DailyLogState {
  todayLog: DailyLog | null;
  logs: DailyLog[];
  showYesterdayModal: boolean;
  yesterdayDate: string | null;
  isLoading: boolean;
  error: string | null;
}

interface DailyLogActions {
  setTodayLog: (log: DailyLog | null) => void;
  setLogs: (logs: DailyLog[]) => void;
  setShowYesterdayModal: (show: boolean, date?: string) => void;
  addManualTask: (task: string) => void;
  addCompletedTicket: (entry: CompletedTicketEntry) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

type DailyLogStore = DailyLogState & DailyLogActions;

const initialState: DailyLogState = {
  todayLog: null,
  logs: [],
  showYesterdayModal: false,
  yesterdayDate: null,
  isLoading: false,
  error: null,
};

export const useDailyLogStore = create<DailyLogStore>()((set, get) => ({
  ...initialState,

  setTodayLog: (todayLog) => set({ todayLog }),

  setLogs: (logs) => set({ logs }),

  setShowYesterdayModal: (show, date) =>
    set({
      showYesterdayModal: show,
      yesterdayDate: date ?? null,
    }),

  addManualTask: (task) => {
    const { todayLog } = get();
    if (todayLog) {
      set({
        todayLog: {
          ...todayLog,
          manualTasks: [...todayLog.manualTasks, task],
          updatedAt: new Date().toISOString(),
        },
      });
    }
  },

  addCompletedTicket: (entry) => {
    const { todayLog } = get();
    if (todayLog) {
      set({
        todayLog: {
          ...todayLog,
          completedTickets: [...todayLog.completedTickets, entry],
          updatedAt: new Date().toISOString(),
        },
      });
    }
  },

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error, isLoading: false }),

  reset: () => set(initialState),
}));

/** Get yesterday's date in YYYY-MM-DD format */
export function getYesterdayDateString(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
}

/** Check if yesterday was a weekday */
export function wasYesterdayWeekday(): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const day = yesterday.getDay();
  return day !== 0 && day !== 6; // Not Sunday (0) or Saturday (6)
}
