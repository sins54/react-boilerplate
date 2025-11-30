/**
 * Pulse HR - Daily Log Service
 * 
 * Handles daily task updates and task history
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
  DailyLog,
  CompletedTicketEntry,
  DailyLogInput,
  TaskHistoryItem,
} from '@/types/pulse-hr';
import { getTodayDateString } from '@/stores';

const DAILY_LOGS_COLLECTION = 'dailyLogs';

/**
 * Get or create today's daily log
 */
export async function getTodayDailyLog(userId: string): Promise<DailyLog> {
  const today = getTodayDateString();
  const logId = `${userId}_${today}`;

  if (!isFirebaseConfigured || !db) {
    return getMockDailyLog(userId, today);
  }

  const docRef = doc(db, DAILY_LOGS_COLLECTION, logId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as DailyLog;
  }

  // Create new log for today
  const now = new Date().toISOString();
  const newLog: DailyLog = {
    id: logId,
    userId,
    date: today,
    manualTasks: [],
    completedTickets: [],
    createdAt: now,
    updatedAt: now,
  };

  await setDoc(docRef, newLog);
  return newLog;
}

/**
 * Get daily log for a specific date
 */
export async function getDailyLog(
  userId: string,
  date: string
): Promise<DailyLog | null> {
  const logId = `${userId}_${date}`;

  if (!isFirebaseConfigured || !db) {
    // Return null for past dates in demo mode (to trigger yesterday modal)
    const today = getTodayDateString();
    if (date !== today) {
      return null;
    }
    return getMockDailyLog(userId, date);
  }

  const docRef = doc(db, DAILY_LOGS_COLLECTION, logId);
  const docSnap = await getDoc(docRef);

  return docSnap.exists() ? (docSnap.data() as DailyLog) : null;
}

/**
 * Add a manual task to today's log
 */
export async function addManualTask(
  userId: string,
  task: string
): Promise<DailyLog> {
  const today = getTodayDateString();
  const logId = `${userId}_${today}`;
  const now = new Date().toISOString();

  if (!isFirebaseConfigured || !db) {
    const log = getMockDailyLog(userId, today);
    return {
      ...log,
      manualTasks: [...log.manualTasks, task],
      updatedAt: now,
    };
  }

  const docRef = doc(db, DAILY_LOGS_COLLECTION, logId);
  let logSnap = await getDoc(docRef);

  if (!logSnap.exists()) {
    // Create new log
    const newLog: DailyLog = {
      id: logId,
      userId,
      date: today,
      manualTasks: [task],
      completedTickets: [],
      createdAt: now,
      updatedAt: now,
    };
    await setDoc(docRef, newLog);
    return newLog;
  }

  const currentLog = logSnap.data() as DailyLog;
  await updateDoc(docRef, {
    manualTasks: [...currentLog.manualTasks, task],
    updatedAt: now,
  });

  logSnap = await getDoc(docRef);
  return logSnap.data() as DailyLog;
}

/**
 * Add a completed ticket to today's log (called when ticket is moved to "Done")
 */
export async function addCompletedTicket(
  userId: string,
  entry: CompletedTicketEntry
): Promise<DailyLog> {
  const today = getTodayDateString();
  const logId = `${userId}_${today}`;
  const now = new Date().toISOString();

  if (!isFirebaseConfigured || !db) {
    const log = getMockDailyLog(userId, today);
    return {
      ...log,
      completedTickets: [...log.completedTickets, entry],
      updatedAt: now,
    };
  }

  const docRef = doc(db, DAILY_LOGS_COLLECTION, logId);
  let logSnap = await getDoc(docRef);

  if (!logSnap.exists()) {
    // Create new log
    const newLog: DailyLog = {
      id: logId,
      userId,
      date: today,
      manualTasks: [],
      completedTickets: [entry],
      createdAt: now,
      updatedAt: now,
    };
    await setDoc(docRef, newLog);
    return newLog;
  }

  const currentLog = logSnap.data() as DailyLog;
  await updateDoc(docRef, {
    completedTickets: [...currentLog.completedTickets, entry],
    updatedAt: now,
  });

  logSnap = await getDoc(docRef);
  return logSnap.data() as DailyLog;
}

/**
 * Update daily log for a specific date (for backfilling yesterday)
 */
export async function updateDailyLog(
  userId: string,
  date: string,
  input: DailyLogInput
): Promise<DailyLog> {
  const logId = `${userId}_${date}`;
  const now = new Date().toISOString();

  if (!isFirebaseConfigured || !db) {
    return {
      id: logId,
      userId,
      date,
      manualTasks: input.manualTasks,
      completedTickets: [],
      createdAt: now,
      updatedAt: now,
    };
  }

  const docRef = doc(db, DAILY_LOGS_COLLECTION, logId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    await updateDoc(docRef, {
      manualTasks: input.manualTasks,
      updatedAt: now,
    });
  } else {
    const newLog: DailyLog = {
      id: logId,
      userId,
      date,
      manualTasks: input.manualTasks,
      completedTickets: [],
      createdAt: now,
      updatedAt: now,
    };
    await setDoc(docRef, newLog);
  }

  const updated = await getDoc(docRef);
  return updated.data() as DailyLog;
}

/**
 * Get user's daily logs for a date range
 */
export async function getUserDailyLogs(
  userId: string,
  startDate: string,
  endDate: string
): Promise<DailyLog[]> {
  if (!isFirebaseConfigured || !db) {
    return getMockDailyLogs(userId);
  }

  const q = query(
    collection(db, DAILY_LOGS_COLLECTION),
    where('userId', '==', userId),
    where('date', '>=', startDate),
    where('date', '<=', endDate),
    orderBy('date', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as DailyLog);
}

/**
 * Get all daily logs for a date range (admin)
 */
export async function getAllDailyLogs(
  startDate: string,
  endDate: string
): Promise<DailyLog[]> {
  if (!isFirebaseConfigured || !db) {
    return getMockDailyLogs('all');
  }

  const q = query(
    collection(db, DAILY_LOGS_COLLECTION),
    where('date', '>=', startDate),
    where('date', '<=', endDate),
    orderBy('date', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as DailyLog);
}

/**
 * Get task history items for reporting
 */
export async function getTaskHistory(
  startDate: string,
  endDate: string,
  userId?: string
): Promise<TaskHistoryItem[]> {
  const logs = userId
    ? await getUserDailyLogs(userId, startDate, endDate)
    : await getAllDailyLogs(startDate, endDate);

  const historyItems: TaskHistoryItem[] = [];

  logs.forEach((log) => {
    // Add manual tasks
    log.manualTasks.forEach((task, index) => {
      historyItems.push({
        id: `${log.id}_manual_${index}`,
        userId: log.userId,
        userDisplayName: '', // Will be populated by caller
        date: log.date,
        taskDescription: task,
        taskType: 'manual',
        createdAt: log.updatedAt,
      });
    });

    // Add completed tickets
    log.completedTickets.forEach((ticket) => {
      historyItems.push({
        id: `${log.id}_ticket_${ticket.ticketId}`,
        userId: log.userId,
        userDisplayName: '',
        date: log.date,
        taskDescription: ticket.ticketTitle,
        taskType: 'ticket',
        projectName: ticket.projectName,
        createdAt: ticket.completedAt,
      });
    });
  });

  return historyItems.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

// Mock data generators
function getMockDailyLog(userId: string, date: string): DailyLog {
  const now = new Date().toISOString();
  
  return {
    id: `${userId}_${date}`,
    userId,
    date,
    manualTasks: [
      'Reviewed pull requests',
      'Attended standup meeting',
    ],
    completedTickets: [
      {
        ticketId: 'ticket-mock-1',
        ticketTitle: 'Design homepage wireframe',
        projectId: 'project-mock-1',
        projectName: 'Website Redesign',
        completedAt: now,
      },
    ],
    createdAt: now,
    updatedAt: now,
  };
}

function getMockDailyLogs(userId: string): DailyLog[] {
  const logs: DailyLog[] = [];
  const now = new Date();
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const day = date.getDay();
    
    // Skip weekends
    if (day === 0 || day === 6) continue;
    
    const currentUserId = userId === 'all' 
      ? `mock-employee-${(i % 2) + 1}` 
      : userId;
    
    logs.push({
      id: `${currentUserId}_${dateStr}`,
      userId: currentUserId,
      date: dateStr,
      manualTasks: [
        'Code review and PR feedback',
        'Team meeting',
        i % 3 === 0 ? 'Documentation updates' : 'Bug fixes',
      ],
      completedTickets: i % 2 === 0 ? [
        {
          ticketId: `ticket-${i}`,
          ticketTitle: `Task ${i + 1} completed`,
          projectId: 'project-mock-1',
          projectName: 'Website Redesign',
          completedAt: date.toISOString(),
        },
      ] : [],
      createdAt: date.toISOString(),
      updatedAt: date.toISOString(),
    });
  }
  
  return logs;
}
