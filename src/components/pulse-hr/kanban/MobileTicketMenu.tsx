/**
 * Pulse HR - Mobile Ticket Menu
 * 
 * Bottom sheet menu for moving tickets on mobile devices
 */

import { X, ArrowRight, Eye } from 'lucide-react';
import type { Ticket, TicketStatus, KanbanColumn } from '@/types/pulse-hr';

interface MobileTicketMenuProps {
  ticket: Ticket;
  columns: KanbanColumn[];
  onMove: (ticket: Ticket, newStatus: TicketStatus) => void;
  onView: () => void;
  onClose: () => void;
}

export function MobileTicketMenu({
  ticket,
  columns,
  onMove,
  onView,
  onClose,
}: MobileTicketMenuProps) {
  const availableColumns = columns.filter((col) => col.id !== ticket.status);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl p-4 pb-8 animate-slide-up"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        {/* Handle */}
        <div className="flex justify-center mb-4">
          <div
            className="w-12 h-1.5 rounded-full"
            style={{ backgroundColor: 'var(--color-border)' }}
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3
            className="font-semibold text-lg"
            style={{ color: 'var(--color-text)' }}
          >
            {ticket.title}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full"
            style={{
              backgroundColor: 'var(--color-muted)',
              color: 'var(--color-text-muted)',
            }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Details */}
        <button
          onClick={onView}
          className="w-full flex items-center gap-3 p-3 rounded-lg mb-3 transition-colors"
          style={{
            backgroundColor: 'var(--color-bg-secondary)',
            color: 'var(--color-text)',
          }}
        >
          <Eye className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
          <span className="font-medium">View Details</span>
        </button>

        {/* Move Options */}
        <p
          className="text-sm font-medium mb-2"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Move to:
        </p>

        <div className="space-y-2">
          {availableColumns.map((column) => (
            <button
              key={column.id}
              onClick={() => onMove(ticket, column.id)}
              className="w-full flex items-center justify-between p-3 rounded-lg transition-colors"
              style={{
                backgroundColor: 'var(--color-bg-secondary)',
                color: 'var(--color-text)',
              }}
            >
              <span className="font-medium">{column.title}</span>
              <ArrowRight
                className="w-5 h-5"
                style={{ color: 'var(--color-text-muted)' }}
              />
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
