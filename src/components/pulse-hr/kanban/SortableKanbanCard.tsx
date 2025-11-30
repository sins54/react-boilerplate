/**
 * Pulse HR - Sortable Kanban Card
 * 
 * Wrapper for KanbanCard with dnd-kit sortable functionality
 */

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Ticket } from '@/types/pulse-hr';
import { KanbanCard } from './KanbanCard';

interface SortableKanbanCardProps {
  ticket: Ticket;
  onClick: () => void;
  isMobile: boolean;
}

export function SortableKanbanCard({
  ticket,
  onClick,
  isMobile,
}: SortableKanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: ticket.id,
    disabled: isMobile, // Disable drag on mobile
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <KanbanCard
        ticket={ticket}
        onClick={onClick}
        isDragging={isDragging}
        isMobile={isMobile}
        dragHandleProps={isMobile ? undefined : { ...attributes, ...listeners }}
      />
    </div>
  );
}
