/**
 * Pulse HR - Project Service
 * 
 * Handles projects, tickets, and kanban board operations
 */

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  writeBatch,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import type {
  Project,
  Ticket,
  TicketFormInput,
  CreateProjectInput,
  TicketStatus,
} from '@/types/pulse-hr';

const PROJECTS_COLLECTION = 'projects';
const TICKETS_COLLECTION = 'tickets';

/**
 * Create a new project
 */
export async function createProject(
  input: CreateProjectInput,
  createdBy: string
): Promise<Project> {
  const now = new Date().toISOString();
  const id = `project_${Date.now()}`;

  const project: Project = {
    id,
    name: input.name,
    description: input.description,
    createdBy,
    createdAt: now,
    updatedAt: now,
    isArchived: false,
    members: input.members,
  };

  if (!isFirebaseConfigured || !db) {
    return project;
  }

  await setDoc(doc(db, PROJECTS_COLLECTION, id), project);
  return project;
}

/**
 * Get all projects for a user
 */
export async function getUserProjects(userId: string): Promise<Project[]> {
  if (!isFirebaseConfigured || !db) {
    return getMockProjects();
  }

  const q = query(
    collection(db, PROJECTS_COLLECTION),
    where('members', 'array-contains', userId),
    where('isArchived', '==', false),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as Project);
}

/**
 * Get all projects (admin)
 */
export async function getAllProjects(): Promise<Project[]> {
  if (!isFirebaseConfigured || !db) {
    return getMockProjects();
  }

  const q = query(
    collection(db, PROJECTS_COLLECTION),
    where('isArchived', '==', false),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as Project);
}

/**
 * Get a single project
 */
export async function getProject(projectId: string): Promise<Project | null> {
  if (!isFirebaseConfigured || !db) {
    return getMockProjects().find((p) => p.id === projectId) || null;
  }

  const docSnap = await getDoc(doc(db, PROJECTS_COLLECTION, projectId));
  return docSnap.exists() ? (docSnap.data() as Project) : null;
}

/**
 * Update a project
 */
export async function updateProject(
  projectId: string,
  updates: Partial<Project>
): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    return;
  }

  await updateDoc(doc(db, PROJECTS_COLLECTION, projectId), {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
}

/**
 * Archive a project
 */
export async function archiveProject(projectId: string): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    return;
  }

  await updateDoc(doc(db, PROJECTS_COLLECTION, projectId), {
    isArchived: true,
    updatedAt: new Date().toISOString(),
  });
}

/**
 * Create a new ticket
 */
export async function createTicket(
  projectId: string,
  input: TicketFormInput,
  createdBy: string,
  assigneeName?: string
): Promise<Ticket> {
  const now = new Date().toISOString();
  const id = `ticket_${Date.now()}`;

  // Get current max order in the column
  const existingTickets = await getProjectTickets(projectId);
  const columnTickets = existingTickets.filter((t) => t.status === input.status);
  const maxOrder = Math.max(0, ...columnTickets.map((t) => t.order));

  const ticket: Ticket = {
    id,
    projectId,
    title: input.title,
    description: input.description,
    priority: input.priority,
    status: input.status,
    assigneeId: input.assigneeId,
    assigneeName,
    createdBy,
    createdAt: now,
    updatedAt: now,
    order: maxOrder + 1,
  };

  if (!isFirebaseConfigured || !db) {
    return ticket;
  }

  await setDoc(doc(db, TICKETS_COLLECTION, id), ticket);
  return ticket;
}

/**
 * Get all tickets for a project
 */
export async function getProjectTickets(projectId: string): Promise<Ticket[]> {
  if (!isFirebaseConfigured || !db) {
    return getMockTickets().filter((t) => t.projectId === projectId);
  }

  const q = query(
    collection(db, TICKETS_COLLECTION),
    where('projectId', '==', projectId),
    orderBy('order', 'asc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as Ticket);
}

/**
 * Update a ticket
 */
export async function updateTicket(
  ticketId: string,
  updates: Partial<Ticket>
): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    return;
  }

  await updateDoc(doc(db, TICKETS_COLLECTION, ticketId), {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
}

/**
 * Move a ticket to a new status/column
 */
export async function moveTicket(
  ticketId: string,
  newStatus: TicketStatus,
  newOrder: number
): Promise<Ticket | null> {
  const now = new Date().toISOString();

  if (!isFirebaseConfigured || !db) {
    const mockTickets = getMockTickets();
    const ticket = mockTickets.find((t) => t.id === ticketId);
    if (ticket) {
      return {
        ...ticket,
        status: newStatus,
        order: newOrder,
        updatedAt: now,
        completedAt: newStatus === 'done' ? now : ticket.completedAt,
      };
    }
    return null;
  }

  const ticketRef = doc(db, TICKETS_COLLECTION, ticketId);
  const updates: Partial<Ticket> = {
    status: newStatus,
    order: newOrder,
    updatedAt: now,
  };

  if (newStatus === 'done') {
    updates.completedAt = now;
  }

  await updateDoc(ticketRef, updates);

  const updated = await getDoc(ticketRef);
  return updated.exists() ? (updated.data() as Ticket) : null;
}

/**
 * Delete a ticket
 */
export async function deleteTicket(ticketId: string): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    return;
  }

  await deleteDoc(doc(db, TICKETS_COLLECTION, ticketId));
}

/**
 * Reorder tickets within a column
 */
export async function reorderTickets(
  _projectId: string,
  _status: TicketStatus,
  ticketIds: string[]
): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    return;
  }

  const firestore = db;
  const batch = writeBatch(firestore);
  const now = new Date().toISOString();

  ticketIds.forEach((id, index) => {
    batch.update(doc(firestore, TICKETS_COLLECTION, id), {
      order: index,
      updatedAt: now,
    });
  });

  await batch.commit();
}

// Mock data generators
function getMockProjects(): Project[] {
  const now = new Date().toISOString();
  
  return [
    {
      id: 'project-mock-1',
      name: 'Website Redesign',
      description: 'Complete overhaul of the company website',
      createdBy: 'mock-admin-1',
      createdAt: now,
      updatedAt: now,
      isArchived: false,
      members: ['mock-admin-1', 'mock-employee-1', 'mock-employee-2'],
    },
    {
      id: 'project-mock-2',
      name: 'Mobile App Development',
      description: 'Build a new mobile app for customers',
      createdBy: 'mock-admin-1',
      createdAt: now,
      updatedAt: now,
      isArchived: false,
      members: ['mock-admin-1', 'mock-employee-1'],
    },
    {
      id: 'project-mock-3',
      name: 'Internal Tools',
      description: 'Improve internal productivity tools',
      createdBy: 'mock-employee-1',
      createdAt: now,
      updatedAt: now,
      isArchived: false,
      members: ['mock-employee-1', 'mock-employee-2'],
    },
  ];
}

function getMockTickets(): Ticket[] {
  const now = new Date().toISOString();
  
  return [
    // Project 1 tickets
    {
      id: 'ticket-mock-1',
      projectId: 'project-mock-1',
      title: 'Design homepage wireframe',
      description: 'Create initial wireframe designs for the new homepage',
      priority: 'high',
      status: 'done',
      assigneeId: 'mock-employee-2',
      assigneeName: 'Jane Smith',
      createdBy: 'mock-admin-1',
      createdAt: now,
      updatedAt: now,
      order: 0,
      completedAt: now,
    },
    {
      id: 'ticket-mock-2',
      projectId: 'project-mock-1',
      title: 'Implement responsive navigation',
      description: 'Build mobile-first navigation component',
      priority: 'high',
      status: 'in-progress',
      assigneeId: 'mock-employee-1',
      assigneeName: 'John Doe',
      createdBy: 'mock-admin-1',
      createdAt: now,
      updatedAt: now,
      order: 0,
    },
    {
      id: 'ticket-mock-3',
      projectId: 'project-mock-1',
      title: 'Set up CI/CD pipeline',
      description: 'Configure automated deployment',
      priority: 'medium',
      status: 'todo',
      assigneeId: 'mock-employee-1',
      assigneeName: 'John Doe',
      createdBy: 'mock-admin-1',
      createdAt: now,
      updatedAt: now,
      order: 0,
    },
    {
      id: 'ticket-mock-4',
      projectId: 'project-mock-1',
      title: 'Create contact form',
      description: 'Build and validate contact form',
      priority: 'low',
      status: 'todo',
      createdBy: 'mock-admin-1',
      createdAt: now,
      updatedAt: now,
      order: 1,
    },
    // Project 2 tickets
    {
      id: 'ticket-mock-5',
      projectId: 'project-mock-2',
      title: 'Setup React Native project',
      priority: 'high',
      status: 'done',
      assigneeId: 'mock-employee-1',
      assigneeName: 'John Doe',
      createdBy: 'mock-admin-1',
      createdAt: now,
      updatedAt: now,
      order: 0,
      completedAt: now,
    },
    {
      id: 'ticket-mock-6',
      projectId: 'project-mock-2',
      title: 'Design app icon',
      priority: 'medium',
      status: 'in-progress',
      assigneeId: 'mock-employee-2',
      assigneeName: 'Jane Smith',
      createdBy: 'mock-admin-1',
      createdAt: now,
      updatedAt: now,
      order: 0,
    },
  ];
}
