/**
 * Pulse HR - Kanban Column Component
 * 
 * Droppable column for the Kanban board
 */

import { useDroppable } from '@dnd-kit/core';
import type { Ticket } from '@/types/pulse-hr';
import { SortableKanbanCard } from './SortableKanbanCard';

interface KanbanColumnProps {
  id: string;
  tickets: Ticket[];
  onTicketClick: (ticket: Ticket) => void;
  isMobile: boolean;
}

export function KanbanColumn({
  id,
  tickets,
  onTicketClick,
  isMobile,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[200px] space-y-3 transition-colors rounded-lg p-2 ${
        isOver ? 'ring-2 ring-[var(--color-primary)]' : ''
      }`}
      style={{
        backgroundColor: isOver
          ? 'var(--color-surface-hover)'
          : 'transparent',
      }}
    >
      {tickets.length === 0 ? (
        <div
          className="flex items-center justify-center h-24 rounded-md border-2 border-dashed"
          style={{
            borderColor: 'var(--color-border)',
            color: 'var(--color-text-muted)',
          }}
        >
          <p className="text-sm">Drop tickets here</p>
        </div>
      ) : (
        tickets.map((ticket) => (
          <SortableKanbanCard
            key={ticket.id}
            ticket={ticket}
            onClick={() => onTicketClick(ticket)}
            isMobile={isMobile}
          />
        ))
      )}
    </div>
  );
}
