/**
 * Pulse HR - Daily Task Update Widget
 * 
 * Widget for adding manual task updates
 */

import React, { useState } from 'react';
import { ListTodo, Plus, CheckCircle, Briefcase } from 'lucide-react';
import type { DailyLog } from '@/types/pulse-hr';

interface DailyTaskWidgetProps {
  log: DailyLog | null;
  onAddTask: (task: string) => Promise<void>;
  isLoading?: boolean;
}

export function DailyTaskWidget({
  log,
  onAddTask,
  isLoading = false,
}: DailyTaskWidgetProps) {
  const [newTask, setNewTask] = useState('');

  const handleAddTask = async () => {
    if (newTask.trim()) {
      await onAddTask(newTask.trim());
      setNewTask('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddTask();
    }
  };

  const totalTasks =
    (log?.manualTasks.length || 0) + (log?.completedTickets.length || 0);

  return (
    <div
      className="rounded-lg p-6 shadow-sm border"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ListTodo
            className="w-5 h-5"
            style={{ color: 'var(--color-primary)' }}
          />
          <h3
            className="text-lg font-semibold"
            style={{ color: 'var(--color-text)' }}
          >
            Today's Updates
          </h3>
        </div>
        <span
          className="text-sm px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: 'var(--color-muted)',
            color: 'var(--color-text-muted)',
          }}
        >
          {totalTasks} {totalTasks === 1 ? 'task' : 'tasks'}
        </span>
      </div>

      {/* Add Task Input */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What did you work on?"
          className="flex-1 px-3 py-2 rounded-md border text-sm"
          style={{
            backgroundColor: 'var(--color-bg)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-text)',
          }}
        />
        <button
          onClick={handleAddTask}
          disabled={isLoading || !newTask.trim()}
          className="px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50"
          style={{
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-text-on-primary)',
          }}
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {/* Completed Tickets (auto-generated) */}
        {log?.completedTickets.map((ticket, index) => (
          <div
            key={`ticket-${index}`}
            className="flex items-start gap-2 p-2 rounded-md"
            style={{ backgroundColor: 'var(--color-success-bg)' }}
          >
            <Briefcase
              className="w-4 h-4 mt-0.5 flex-shrink-0"
              style={{ color: 'var(--color-success)' }}
            />
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-medium"
                style={{ color: 'var(--color-success-text)' }}
              >
                {ticket.ticketTitle}
              </p>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                {ticket.projectName}
              </p>
            </div>
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: 'var(--color-success)',
                color: 'var(--color-text-on-primary)',
              }}
            >
              Auto
            </span>
          </div>
        ))}

        {/* Manual Tasks */}
        {log?.manualTasks.map((task, index) => (
          <div
            key={`manual-${index}`}
            className="flex items-start gap-2 p-2 rounded-md"
            style={{ backgroundColor: 'var(--color-bg-secondary)' }}
          >
            <CheckCircle
              className="w-4 h-4 mt-0.5 flex-shrink-0"
              style={{ color: 'var(--color-primary)' }}
            />
            <p
              className="text-sm flex-1"
              style={{ color: 'var(--color-text)' }}
            >
              {task}
            </p>
          </div>
        ))}

        {/* Empty State */}
        {totalTasks === 0 && (
          <div
            className="text-center py-6"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <ListTodo className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No tasks recorded yet today</p>
          </div>
        )}
      </div>
    </div>
  );
}
