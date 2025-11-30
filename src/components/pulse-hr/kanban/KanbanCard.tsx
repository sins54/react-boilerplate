/**
 * Pulse HR - Kanban Card Component
 * 
 * Individual ticket card for the Kanban board
 */

import React from 'react';
import { GripVertical, User, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import type { Ticket, TicketPriority } from '@/types/pulse-hr';

interface KanbanCardProps {
  ticket: Ticket;
  onClick: () => void;
  isDragging?: boolean;
  isMobile?: boolean;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}

export function KanbanCard({
  ticket,
  onClick,
  isDragging = false,
  isMobile = false,
  dragHandleProps,
}: KanbanCardProps) {
  const getPriorityConfig = (priority: TicketPriority) => {
    switch (priority) {
      case 'high':
        return {
          label: 'High',
          bg: 'var(--color-error-bg)',
          text: 'var(--color-error-text)',
          icon: <AlertCircle className="w-3 h-3" />,
        };
      case 'medium':
        return {
          label: 'Medium',
          bg: 'var(--color-warning-bg)',
          text: 'var(--color-warning-text)',
          icon: <Clock className="w-3 h-3" />,
        };
      case 'low':
        return {
          label: 'Low',
          bg: 'var(--color-success-bg)',
          text: 'var(--color-success-text)',
          icon: <CheckCircle className="w-3 h-3" />,
        };
    }
  };

  const priorityConfig = getPriorityConfig(ticket.priority);

  return (
    <div
      onClick={onClick}
      className={`rounded-lg p-3 shadow-sm border cursor-pointer transition-all ${
        isDragging ? 'shadow-lg scale-105' : 'hover:shadow-md'
      }`}
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: isDragging ? 'var(--color-primary)' : 'var(--color-border)',
      }}
    >
      <div className="flex items-start gap-2">
        {/* Drag Handle (Desktop) */}
        {!isMobile && dragHandleProps && (
          <div
            {...dragHandleProps}
            className="mt-0.5 cursor-grab active:cursor-grabbing"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <GripVertical className="w-4 h-4" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          {/* Title */}
          <h4
            className="font-medium text-sm mb-2 line-clamp-2"
            style={{ color: 'var(--color-text)' }}
          >
            {ticket.title}
          </h4>

          {/* Description */}
          {ticket.description && (
            <p
              className="text-xs mb-3 line-clamp-2"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {ticket.description}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between">
            {/* Priority Badge */}
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
              style={{
                backgroundColor: priorityConfig.bg,
                color: priorityConfig.text,
              }}
            >
              {priorityConfig.icon}
              {priorityConfig.label}
            </span>

            {/* Assignee */}
            {ticket.assigneeName && (
              <div
                className="flex items-center gap-1"
                style={{ color: 'var(--color-text-muted)' }}
              >
                <User className="w-3 h-3" />
                <span className="text-xs truncate max-w-[80px]">
                  {ticket.assigneeName}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
