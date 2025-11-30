/**
 * Pulse HR - Yesterday Update Modal
 * 
 * Modal shown when user forgot to update yesterday's daily log
 */

import { useState } from 'react';
import { AlertTriangle, X, Plus, Save, Trash2 } from 'lucide-react';

interface YesterdayUpdateModalProps {
  date: string;
  onSubmit: (tasks: string[]) => Promise<void>;
  onSkip: () => void;
  isLoading?: boolean;
}

export function YesterdayUpdateModal({
  date,
  onSubmit,
  onSkip,
  isLoading = false,
}: YesterdayUpdateModalProps) {
  const [tasks, setTasks] = useState<string[]>(['']);

  const addTask = () => {
    setTasks([...tasks, '']);
  };

  const removeTask = (index: number) => {
    if (tasks.length > 1) {
      setTasks(tasks.filter((_, i) => i !== index));
    }
  };

  const updateTask = (index: number, value: string) => {
    const newTasks = [...tasks];
    newTasks[index] = value;
    setTasks(newTasks);
  };

  const handleSubmit = async () => {
    const validTasks = tasks.filter((t) => t.trim().length > 0);
    if (validTasks.length > 0) {
      await onSubmit(validTasks);
    }
  };

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="w-full max-w-lg rounded-lg shadow-xl animate-fade-in"
          style={{ backgroundColor: 'var(--color-surface)' }}
        >
          {/* Header */}
          <div
            className="flex items-start gap-3 p-4 border-b"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <div
              className="p-2 rounded-full"
              style={{ backgroundColor: 'var(--color-warning-bg)' }}
            >
              <AlertTriangle
                className="w-6 h-6"
                style={{ color: 'var(--color-warning)' }}
              />
            </div>
            <div className="flex-1">
              <h3
                className="text-lg font-semibold"
                style={{ color: 'var(--color-text)' }}
              >
                Missing Daily Update
              </h3>
              <p
                className="text-sm mt-1"
                style={{ color: 'var(--color-text-muted)' }}
              >
                You forgot to update your tasks for <strong>{formattedDate}</strong>.
                Please fill it now.
              </p>
            </div>
            <button
              onClick={onSkip}
              className="p-1 rounded-md transition-colors hover:opacity-80"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 max-h-[400px] overflow-y-auto">
            <p
              className="text-sm font-medium mb-3"
              style={{ color: 'var(--color-text)' }}
            >
              What did you work on?
            </p>

            <div className="space-y-2">
              {tasks.map((task, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={task}
                    onChange={(e) => updateTask(index, e.target.value)}
                    placeholder={`Task ${index + 1}...`}
                    className="flex-1 px-3 py-2 rounded-md border text-sm"
                    style={{
                      backgroundColor: 'var(--color-bg)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text)',
                    }}
                  />
                  {tasks.length > 1 && (
                    <button
                      onClick={() => removeTask(index)}
                      className="p-2 rounded-md transition-colors"
                      style={{
                        backgroundColor: 'var(--color-error-bg)',
                        color: 'var(--color-error)',
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={addTask}
              className="flex items-center gap-1 mt-3 text-sm font-medium"
              style={{ color: 'var(--color-primary)' }}
            >
              <Plus className="w-4 h-4" />
              Add another task
            </button>
          </div>

          {/* Footer */}
          <div
            className="flex gap-3 p-4 border-t"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <button
              onClick={onSkip}
              className="flex-1 py-2 px-4 rounded-md font-medium transition-colors"
              style={{
                backgroundColor: 'var(--color-muted)',
                color: 'var(--color-text)',
              }}
            >
              Skip for Now
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading || tasks.every((t) => !t.trim())}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium transition-colors disabled:opacity-50"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-text-on-primary)',
              }}
            >
              <Save className="w-4 h-4" />
              {isLoading ? 'Saving...' : 'Save Update'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
