/**
 * Pulse HR - Projects Page
 * 
 * Project list and Kanban board
 */

import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FolderKanban, Plus, ArrowLeft, Users } from 'lucide-react';
import { useAuthStore, useProjectStore, useDailyLogStore } from '@/stores';
import { KanbanBoard, TicketForm } from '@/components/pulse-hr/kanban';
import {
  getUserProjects,
  getAllProjects,
  getProject,
  getProjectTickets,
  createTicket,
  moveTicket,
  updateTicket,
} from '@/services';
import { addCompletedTicket } from '@/services/dailyLogService';
import { getAllUsers } from '@/services/authService';
import type { Ticket, TicketStatus, TicketFormInput, PulseUser, CompletedTicketEntry } from '@/types/pulse-hr';

export function ProjectsPage() {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId?: string }>();
  const { user, isAdmin } = useAuthStore();
  const { projects, setProjects, currentProject, setCurrentProject, tickets, setTickets, getKanbanColumns } = useProjectStore();
  const { setTodayLog } = useDailyLogStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState<TicketStatus>('todo');
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [users, setUsers] = useState<PulseUser[]>([]);

  useEffect(() => {
    loadProjects();
    loadUsers();
  }, []);

  useEffect(() => {
    if (projectId) {
      loadProject(projectId);
    } else {
      setCurrentProject(null);
      setTickets([]);
    }
  }, [projectId]);

  const loadProjects = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const projectList = isAdmin()
        ? await getAllProjects()
        : await getUserProjects(user.id);
      setProjects(projectList);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadProject = async (id: string) => {
    setIsLoading(true);
    try {
      const [project, projectTickets] = await Promise.all([
        getProject(id),
        getProjectTickets(id),
      ]);
      setCurrentProject(project);
      setTickets(projectTickets);
    } catch (error) {
      console.error('Failed to load project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const userList = await getAllUsers();
      setUsers(userList);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const handleTicketMove = useCallback(async (
    ticketId: string,
    newStatus: TicketStatus,
    newOrder: number
  ) => {
    if (!user || !currentProject) return;

    const ticket = tickets.find((t) => t.id === ticketId);
    if (!ticket) return;

    const previousStatus = ticket.status;

    // Optimistic update
    setTickets(
      tickets.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              status: newStatus,
              order: newOrder,
              updatedAt: new Date().toISOString(),
              completedAt: newStatus === 'done' ? new Date().toISOString() : t.completedAt,
            }
          : t
      )
    );

    try {
      const updated = await moveTicket(ticketId, newStatus, newOrder);

      // AUTO-APPEND TO DAILY LOG when moved to "Done"
      if (newStatus === 'done' && previousStatus !== 'done' && updated) {
        const entry: CompletedTicketEntry = {
          ticketId: updated.id,
          ticketTitle: updated.title,
          projectId: currentProject.id,
          projectName: currentProject.name,
          completedAt: new Date().toISOString(),
        };

        const updatedLog = await addCompletedTicket(user.id, entry);
        setTodayLog(updatedLog);
      }
    } catch (error) {
      console.error('Failed to move ticket:', error);
      // Revert optimistic update
      loadProject(currentProject.id);
    }
  }, [tickets, user, currentProject, setTickets, setTodayLog]);

  const handleAddTicket = (status: TicketStatus) => {
    setDefaultStatus(status);
    setEditingTicket(null);
    setShowTicketForm(true);
  };

  const handleTicketClick = (ticket: Ticket) => {
    setEditingTicket(ticket);
    setDefaultStatus(ticket.status);
    setShowTicketForm(true);
  };

  const handleTicketSubmit = async (data: TicketFormInput) => {
    if (!user || !currentProject) return;
    setIsLoading(true);
    try {
      const assignee = users.find((u) => u.id === data.assigneeId);
      
      if (editingTicket) {
        // Update existing ticket
        await updateTicket(editingTicket.id, {
          ...data,
          assigneeName: assignee?.displayName,
        });
        setTickets(
          tickets.map((t) =>
            t.id === editingTicket.id
              ? { ...t, ...data, assigneeName: assignee?.displayName, updatedAt: new Date().toISOString() }
              : t
          )
        );
      } else {
        // Create new ticket
        const newTicket = await createTicket(
          currentProject.id,
          data,
          user.id,
          assignee?.displayName
        );
        setTickets([...tickets, newTicket]);
      }
      setShowTicketForm(false);
      setEditingTicket(null);
    } catch (error) {
      console.error('Failed to save ticket:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Show project list if no project selected
  if (!projectId || !currentProject) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1
              className="text-2xl font-bold"
              style={{ color: 'var(--color-text)' }}
            >
              Projects
            </h1>
            <p
              className="text-sm mt-1"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Manage your projects and tasks
            </p>
          </div>
        </div>

        {/* Project Grid */}
        {projects.length === 0 ? (
          <div
            className="rounded-lg p-8 text-center"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <FolderKanban
              className="w-12 h-12 mx-auto mb-3 opacity-50"
              style={{ color: 'var(--color-text-muted)' }}
            />
            <p style={{ color: 'var(--color-text-muted)' }}>
              No projects found
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => navigate(`/pulse/projects/${project.id}`)}
                className="text-left rounded-lg p-5 border shadow-sm transition-all hover:shadow-md"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    <FolderKanban
                      className="w-5 h-5"
                      style={{ color: 'var(--color-text-on-primary)' }}
                    />
                  </div>
                  <div
                    className="flex items-center gap-1 text-xs"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    <Users className="w-3 h-3" />
                    {project.members.length}
                  </div>
                </div>
                <h3
                  className="font-semibold mb-1"
                  style={{ color: 'var(--color-text)' }}
                >
                  {project.name}
                </h3>
                {project.description && (
                  <p
                    className="text-sm line-clamp-2"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {project.description}
                  </p>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Show Kanban board for selected project
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/pulse/projects')}
            className="p-2 rounded-lg transition-colors"
            style={{ backgroundColor: 'var(--color-muted)' }}
          >
            <ArrowLeft
              className="w-5 h-5"
              style={{ color: 'var(--color-text)' }}
            />
          </button>
          <div>
            <h1
              className="text-2xl font-bold"
              style={{ color: 'var(--color-text)' }}
            >
              {currentProject.name}
            </h1>
            {currentProject.description && (
              <p
                className="text-sm mt-1"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {currentProject.description}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={() => handleAddTicket('todo')}
          className="flex items-center gap-2 py-2 px-4 rounded-lg font-medium text-sm"
          style={{
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-text-on-primary)',
          }}
        >
          <Plus className="w-4 h-4" />
          Add Ticket
        </button>
      </div>

      {/* Kanban Board */}
      <KanbanBoard
        columns={getKanbanColumns()}
        onTicketMove={handleTicketMove}
        onTicketClick={handleTicketClick}
        onAddTicket={handleAddTicket}
      />

      {/* Ticket Form Modal */}
      {showTicketForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <TicketForm
              initialData={editingTicket || undefined}
              defaultStatus={defaultStatus}
              users={users}
              onSubmit={handleTicketSubmit}
              onCancel={() => {
                setShowTicketForm(false);
                setEditingTicket(null);
              }}
              isLoading={isLoading}
              isEditing={!!editingTicket}
            />
          </div>
        </div>
      )}
    </div>
  );
}
