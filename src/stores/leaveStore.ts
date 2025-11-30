/**
 * Pulse HR - Leave Store (Zustand)
 * 
 * Manages leave requests and balances
 */

import { create } from 'zustand';
import type { LeaveRequest, LeaveBalance, LeaveType } from '@/types/pulse-hr';

interface LeaveState {
  requests: LeaveRequest[];
  balances: LeaveBalance[];
  pendingRequests: LeaveRequest[];
  isLoading: boolean;
  error: string | null;
}

interface LeaveActions {
  setRequests: (requests: LeaveRequest[]) => void;
  setBalances: (balances: LeaveBalance[]) => void;
  setPendingRequests: (requests: LeaveRequest[]) => void;
  addRequest: (request: LeaveRequest) => void;
  updateRequest: (requestId: string, updates: Partial<LeaveRequest>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  getBalance: (leaveType: LeaveType) => LeaveBalance | undefined;
  hasNegativeBalance: (leaveType: LeaveType) => boolean;
  reset: () => void;
}

type LeaveStore = LeaveState & LeaveActions;

const initialState: LeaveState = {
  requests: [],
  balances: [],
  pendingRequests: [],
  isLoading: false,
  error: null,
};

export const useLeaveStore = create<LeaveStore>()((set, get) => ({
  ...initialState,

  setRequests: (requests) =>
    set({
      requests,
      pendingRequests: requests.filter((r) => r.status === 'pending'),
    }),

  setBalances: (balances) => set({ balances }),

  setPendingRequests: (pendingRequests) => set({ pendingRequests }),

  addRequest: (request) =>
    set((state) => ({
      requests: [...state.requests, request],
      pendingRequests:
        request.status === 'pending'
          ? [...state.pendingRequests, request]
          : state.pendingRequests,
    })),

  updateRequest: (requestId, updates) =>
    set((state) => {
      const updatedRequests = state.requests.map((r) =>
        r.id === requestId ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r
      );
      return {
        requests: updatedRequests,
        pendingRequests: updatedRequests.filter((r) => r.status === 'pending'),
      };
    }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error, isLoading: false }),

  getBalance: (leaveType) => {
    const { balances } = get();
    return balances.find((b) => b.leaveType === leaveType);
  },

  hasNegativeBalance: (leaveType) => {
    const balance = get().getBalance(leaveType);
    return balance?.isNegative ?? false;
  },

  reset: () => set(initialState),
}));

/** Calculate leave balance from quotas */
export function calculateLeaveBalance(
  leaveType: LeaveType,
  total: number,
  used: number
): LeaveBalance {
  const remaining = total - used;
  return {
    leaveType,
    total,
    used,
    remaining,
    isNegative: remaining < 0,
  };
}
