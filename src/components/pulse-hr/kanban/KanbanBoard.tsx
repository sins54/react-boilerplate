/**
 * Pulse HR - Kanban Board Component
 * 
 * Drag-and-drop Kanban board using @dnd-kit
 * Desktop: Drag and drop
 * Mobile: Tap to move menu
 */

import { useState, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import type { Ticket, TicketStatus, KanbanColumn as KanbanColumnType } from '@/types/pulse-hr';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';
import { MobileTicketMenu } from './MobileTicketMenu';
import { useIsMobile } from './useIsMobile';

interface KanbanBoardProps {
  columns: KanbanColumnType[];
  onTicketMove: (ticketId: string, newStatus: TicketStatus, newOrder: number) => Promise<void>;
  onTicketClick: (ticket: Ticket) => void;
  onAddTicket: (status: TicketStatus) => void;
}

export function KanbanBoard({
  columns,
  onTicketMove,
  onTicketClick,
  onAddTicket,
}: KanbanBoardProps) {
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [mobileMenuTicket, setMobileMenuTicket] = useState<Ticket | null>(null);
  const isMobile = useIsMobile();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const ticket = columns
      .flatMap((col) => col.tickets)
      .find((t) => t.id === active.id);
    setActiveTicket(ticket || null);
  }, [columns]);

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveTicket(null);

      if (!over) return;

      const activeTicketId = active.id as string;
      const overId = over.id as string;

      // Find the ticket and its current column
      let sourceColumn: KanbanColumnType | undefined;
      let activeTicketData: Ticket | undefined;

      for (const col of columns) {
        const ticket = col.tickets.find((t) => t.id === activeTicketId);
        if (ticket) {
          sourceColumn = col;
          activeTicketData = ticket;
          break;
        }
      }

      if (!activeTicketData || !sourceColumn) return;

      // Determine destination column
      let destinationColumn: KanbanColumnType | undefined;
      let newOrder = 0;

      // Check if dropped on a column directly
      const targetColumn = columns.find((col) => col.id === overId);
      if (targetColumn) {
        destinationColumn = targetColumn;
        newOrder = targetColumn.tickets.length;
      } else {
        // Dropped on another ticket
        for (const col of columns) {
          const ticketIndex = col.tickets.findIndex((t) => t.id === overId);
          if (ticketIndex !== -1) {
            destinationColumn = col;
            newOrder = ticketIndex;
            break;
          }
        }
      }

      if (!destinationColumn) return;

      // Only trigger move if status changed or order changed
      if (
        sourceColumn.id !== destinationColumn.id ||
        activeTicketData.order !== newOrder
      ) {
        await onTicketMove(activeTicketId, destinationColumn.id, newOrder);
      }
    },
    [columns, onTicketMove]
  );

  const handleMobileTicketTap = useCallback((ticket: Ticket) => {
    if (isMobile) {
      setMobileMenuTicket(ticket);
    } else {
      onTicketClick(ticket);
    }
  }, [isMobile, onTicketClick]);

  const handleMobileMove = useCallback(
    async (ticket: Ticket, newStatus: TicketStatus) => {
      const targetColumn = columns.find((col) => col.id === newStatus);
      const newOrder = targetColumn ? targetColumn.tickets.length : 0;
      await onTicketMove(ticket.id, newStatus, newOrder);
      setMobileMenuTicket(null);
    },
    [columns, onTicketMove]
  );

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4 min-h-[500px]">
          {columns.map((column) => (
            <div key={column.id} className="flex-shrink-0 w-80">
              <div
                className="rounded-lg p-4"
                style={{ backgroundColor: 'var(--color-bg-secondary)' }}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h3
                      className="font-semibold"
                      style={{ color: 'var(--color-text)' }}
                    >
                      {column.title}
                    </h3>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: 'var(--color-muted)',
                        color: 'var(--color-text-muted)',
                      }}
                    >
                      {column.tickets.length}
                    </span>
                  </div>
                  <button
                    onClick={() => onAddTicket(column.id)}
                    className="p-1 rounded-md hover:bg-opacity-80 transition-colors"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                {/* Column Content */}
                <SortableContext
                  items={column.tickets.map((t) => t.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <KanbanColumn
                    id={column.id}
                    tickets={column.tickets}
                    onTicketClick={handleMobileTicketTap}
                    isMobile={isMobile}
                  />
                </SortableContext>
              </div>
            </div>
          ))}
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeTicket && (
            <div className="opacity-80">
              <KanbanCard
                ticket={activeTicket}
                onClick={() => {}}
                isDragging
              />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* Mobile Move Menu */}
      {mobileMenuTicket && (
        <MobileTicketMenu
          ticket={mobileMenuTicket}
          columns={columns}
          onMove={handleMobileMove}
          onView={() => {
            onTicketClick(mobileMenuTicket);
            setMobileMenuTicket(null);
          }}
          onClose={() => setMobileMenuTicket(null)}
        />
      )}
    </>
  );
}
