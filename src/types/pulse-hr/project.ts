/**
 * Pulse HR - Project Management Types
 */

/** Ticket priority levels */
export type TicketPriority = 'high' | 'medium' | 'low';

/** Kanban column/status options */
export type TicketStatus = 'todo' | 'in-progress' | 'done';

/** Project entity */
export interface Project {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  isArchived: boolean;
  /** Member user IDs */
  members: string[];
}

/** Ticket/Task entity */
export interface Ticket {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  priority: TicketPriority;
  status: TicketStatus;
  assigneeId?: string;
  assigneeName?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  /** Sort order within column */
  order: number;
  /** Date when ticket was moved to done */
  completedAt?: string;
}

/** Form data for creating/updating ticket */
export interface TicketFormInput {
  title: string;
  description?: string;
  priority: TicketPriority;
  status: TicketStatus;
  assigneeId?: string;
}

/** Form data for creating project */
export interface CreateProjectInput {
  name: string;
  description?: string;
  members: string[];
}

/** Kanban column definition */
export interface KanbanColumn {
  id: TicketStatus;
  title: string;
  tickets: Ticket[];
}

/** Drag result from dnd-kit */
export interface DragResult {
  ticketId: string;
  sourceStatus: TicketStatus;
  destinationStatus: TicketStatus;
  newOrder: number;
}
