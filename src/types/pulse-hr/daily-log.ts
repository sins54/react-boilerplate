/**
 * Pulse HR - Daily Log & Task Update Types
 */

/** Daily task update log */
export interface DailyLog {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD format
  /** Manually entered task updates */
  manualTasks: string[];
  /** Auto-generated from completed tickets */
  completedTickets: CompletedTicketEntry[];
  createdAt: string;
  updatedAt: string;
}

/** Entry for a completed ticket in daily log */
export interface CompletedTicketEntry {
  ticketId: string;
  ticketTitle: string;
  projectId: string;
  projectName: string;
  completedAt: string;
}

/** Form data for daily update */
export interface DailyLogInput {
  date: string;
  manualTasks: string[];
}

/** Task history item for reporting */
export interface TaskHistoryItem {
  id: string;
  userId: string;
  userDisplayName: string;
  date: string;
  taskDescription: string;
  taskType: 'manual' | 'ticket';
  projectName?: string;
  createdAt: string;
}

/** Date range filter for history */
export interface DateRangeFilter {
  startDate: string;
  endDate: string;
}
