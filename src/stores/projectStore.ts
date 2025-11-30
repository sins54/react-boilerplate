/**
 * Pulse HR - Project Store (Zustand)
 * 
 * Manages project and ticket state for Kanban board
 */

import { create } from 'zustand';
import type { Project, Ticket, TicketStatus, KanbanColumn } from '@/types/pulse-hr';

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  tickets: Ticket[];
  isLoading: boolean;
  error: string | null;
}

interface ProjectActions {
  setProjects: (projects: Project[]) => void;
  setCurrentProject: (project: Project | null) => void;
  setTickets: (tickets: Ticket[]) => void;
  addTicket: (ticket: Ticket) => void;
  updateTicket: (ticketId: string, updates: Partial<Ticket>) => void;
  moveTicket: (ticketId: string, newStatus: TicketStatus, newOrder: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  getKanbanColumns: () => KanbanColumn[];
  reset: () => void;
}

type ProjectStore = ProjectState & ProjectActions;

const initialState: ProjectState = {
  projects: [],
  currentProject: null,
  tickets: [],
  isLoading: false,
  error: null,
};

export const useProjectStore = create<ProjectStore>()((set, get) => ({
  ...initialState,

  setProjects: (projects) => set({ projects }),

  setCurrentProject: (currentProject) => set({ currentProject }),

  setTickets: (tickets) => set({ tickets }),

  addTicket: (ticket) =>
    set((state) => ({
      tickets: [...state.tickets, ticket],
    })),

  updateTicket: (ticketId, updates) =>
    set((state) => ({
      tickets: state.tickets.map((t) =>
        t.id === ticketId ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
      ),
    })),

  moveTicket: (ticketId, newStatus, newOrder) =>
    set((state) => ({
      tickets: state.tickets.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              status: newStatus,
              order: newOrder,
              updatedAt: new Date().toISOString(),
              completedAt: newStatus === 'done' ? new Date().toISOString() : t.completedAt,
            }
          : t
      ),
    })),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error, isLoading: false }),

  getKanbanColumns: () => {
    const { tickets } = get();

    const columns: KanbanColumn[] = [
      {
        id: 'todo',
        title: 'To Do',
        tickets: tickets
          .filter((t) => t.status === 'todo')
          .sort((a, b) => a.order - b.order),
      },
      {
        id: 'in-progress',
        title: 'In Progress',
        tickets: tickets
          .filter((t) => t.status === 'in-progress')
          .sort((a, b) => a.order - b.order),
      },
      {
        id: 'done',
        title: 'Done',
        tickets: tickets
          .filter((t) => t.status === 'done')
          .sort((a, b) => a.order - b.order),
      },
    ];

    return columns;
  },

  reset: () => set(initialState),
}));
