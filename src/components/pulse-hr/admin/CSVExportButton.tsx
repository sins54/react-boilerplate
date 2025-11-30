/**
 * Pulse HR - CSV Export Button
 * 
 * Button to export data as CSV
 */

import { Download } from 'lucide-react';

interface CSVExportButtonProps<T> {
  data: T[];
  columns: { key: keyof T; header: string }[];
  filename: string;
  label?: string;
  isLoading?: boolean;
}

export function CSVExportButton<T extends object>({
  data,
  columns,
  filename,
  label = 'Export CSV',
  isLoading = false,
}: CSVExportButtonProps<T>) {
  const handleExport = () => {
    if (data.length === 0) return;

    // Build CSV content
    const headers = columns.map((col) => col.header).join(',');
    const rows = data.map((row) =>
      columns
        .map((col) => {
          const value = row[col.key];
          // Escape quotes and wrap in quotes if contains comma or quote
          const strValue = String(value ?? '');
          if (strValue.includes(',') || strValue.includes('"') || strValue.includes('\n')) {
            return `"${strValue.replace(/"/g, '""')}"`;
          }
          return strValue;
        })
        .join(',')
    );

    const csv = [headers, ...rows].join('\n');

    // Create download link
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      disabled={isLoading || data.length === 0}
      className="flex items-center gap-2 py-2 px-4 rounded-md font-medium text-sm transition-colors disabled:opacity-50"
      style={{
        backgroundColor: 'var(--color-primary)',
        color: 'var(--color-text-on-primary)',
      }}
    >
      <Download className="w-4 h-4" />
      {label}
    </button>
  );
}
