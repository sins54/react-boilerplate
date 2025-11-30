/**
 * Pulse HR - Reports Page
 * 
 * Task history and CSV export
 */

import { useEffect, useState } from 'react';
import { FileText, Search, Calendar } from 'lucide-react';
import { useAuthStore } from '@/stores';
import { CSVExportButton } from '@/components/pulse-hr/admin';
import { getTaskHistory } from '@/services/dailyLogService';
import { getAllAttendance, getUserAttendance } from '@/services/attendanceService';
import { getAllUsers } from '@/services/authService';
import type { TaskHistoryItem, AttendanceRecord, PulseUser } from '@/types/pulse-hr';

export function ReportsPage() {
  const { user, isAdmin } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'tasks' | 'attendance'>('tasks');
  const [taskHistory, setTaskHistory] = useState<TaskHistoryItem[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [users, setUsers] = useState<PulseUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (user) {
      loadReportData();
    }
  }, [user, dateRange]);

  const loadUsers = async () => {
    try {
      const userList = await getAllUsers();
      setUsers(userList);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const loadReportData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [tasks, attendance] = await Promise.all([
        getTaskHistory(dateRange.startDate, dateRange.endDate, isAdmin() ? undefined : user.id),
        isAdmin()
          ? getAllAttendance(dateRange.startDate, dateRange.endDate)
          : getUserAttendance(user.id, dateRange.startDate, dateRange.endDate),
      ]);

      // Populate user names
      const tasksWithNames = tasks.map((task) => ({
        ...task,
        userDisplayName: users.find((u) => u.id === task.userId)?.displayName || 'Unknown',
      }));

      setTaskHistory(tasksWithNames);
      setAttendanceRecords(attendance);
    } catch (error) {
      console.error('Failed to load report data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTasks = taskHistory.filter(
    (task) =>
      task.taskDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.userDisplayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.projectName && task.projectName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const attendanceCSVColumns: { key: keyof AttendanceRecord; header: string }[] = [
    { key: 'date', header: 'Date' },
    { key: 'userId', header: 'User ID' },
    { key: 'checkInTime', header: 'Check In' },
    { key: 'checkOutTime', header: 'Check Out' },
    { key: 'totalHours', header: 'Hours' },
    { key: 'status', header: 'Status' },
  ];

  const taskCSVColumns: { key: keyof TaskHistoryItem; header: string }[] = [
    { key: 'date', header: 'Date' },
    { key: 'userDisplayName', header: 'User' },
    { key: 'taskDescription', header: 'Task' },
    { key: 'taskType', header: 'Type' },
    { key: 'projectName', header: 'Project' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ color: 'var(--color-text)' }}
          >
            Reports
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: 'var(--color-text-muted)' }}
          >
            View task history and export reports
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex gap-2">
          <CSVExportButton
            data={attendanceRecords}
            columns={attendanceCSVColumns}
            filename="attendance_report"
            label="Export Attendance"
          />
          <CSVExportButton
            data={filteredTasks}
            columns={taskCSVColumns}
            filename="task_report"
            label="Export Tasks"
          />
        </div>
      </div>

      {/* Date Range Filter */}
      <div
        className="flex flex-wrap items-center gap-4 p-4 rounded-lg"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        <div className="flex items-center gap-2">
          <Calendar
            className="w-5 h-5"
            style={{ color: 'var(--color-primary)' }}
          />
          <span
            className="font-medium text-sm"
            style={{ color: 'var(--color-text)' }}
          >
            Date Range
          </span>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) =>
              setDateRange({ ...dateRange, startDate: e.target.value })
            }
            className="px-3 py-2 rounded-md border text-sm"
            style={{
              backgroundColor: 'var(--color-bg)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
          />
          <span style={{ color: 'var(--color-text-muted)' }}>to</span>
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) =>
              setDateRange({ ...dateRange, endDate: e.target.value })
            }
            className="px-3 py-2 rounded-md border text-sm"
            style={{
              backgroundColor: 'var(--color-bg)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
          />
        </div>
        <button
          onClick={loadReportData}
          className="py-2 px-4 rounded-md font-medium text-sm"
          style={{
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-text-on-primary)',
          }}
        >
          Apply Filter
        </button>
      </div>

      {/* Tabs */}
      <div
        className="flex gap-1 p-1 rounded-lg"
        style={{ backgroundColor: 'var(--color-muted)' }}
      >
        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium text-sm transition-colors`}
          style={{
            backgroundColor: activeTab === 'tasks' ? 'var(--color-surface)' : 'transparent',
            color: activeTab === 'tasks' ? 'var(--color-text)' : 'var(--color-text-muted)',
          }}
        >
          <FileText className="w-4 h-4" />
          Task History ({filteredTasks.length})
        </button>
        <button
          onClick={() => setActiveTab('attendance')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium text-sm transition-colors`}
          style={{
            backgroundColor: activeTab === 'attendance' ? 'var(--color-surface)' : 'transparent',
            color: activeTab === 'attendance' ? 'var(--color-text)' : 'var(--color-text-muted)',
          }}
        >
          <Calendar className="w-4 h-4" />
          Attendance ({attendanceRecords.length})
        </button>
      </div>

      {/* Search */}
      {activeTab === 'tasks' && (
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
            style={{ color: 'var(--color-text-muted)' }}
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tasks, users, or projects..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border text-sm"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
          />
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <div
          className="flex items-center justify-center py-12"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <div
            className="w-8 h-8 border-4 rounded-full animate-spin"
            style={{
              borderColor: 'var(--color-border)',
              borderTopColor: 'var(--color-primary)',
            }}
          />
        </div>
      ) : activeTab === 'tasks' ? (
        <TaskHistoryTable tasks={filteredTasks} />
      ) : (
        <AttendanceTable records={attendanceRecords} users={users} />
      )}
    </div>
  );
}

interface TaskHistoryTableProps {
  tasks: TaskHistoryItem[];
}

function TaskHistoryTable({ tasks }: TaskHistoryTableProps) {
  if (tasks.length === 0) {
    return (
      <div
        className="rounded-lg p-8 text-center"
        style={{
          backgroundColor: 'var(--color-surface)',
        }}
      >
        <FileText
          className="w-12 h-12 mx-auto mb-3 opacity-50"
          style={{ color: 'var(--color-text-muted)' }}
        />
        <p style={{ color: 'var(--color-text-muted)' }}>
          No tasks found for the selected date range
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-lg border overflow-hidden"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
              <th
                className="px-4 py-3 text-left text-xs font-medium uppercase"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Date
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium uppercase"
                style={{ color: 'var(--color-text-muted)' }}
              >
                User
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium uppercase"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Task
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium uppercase"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Type
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium uppercase"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Project
              </th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td
                  className="px-4 py-3 text-sm"
                  style={{ color: 'var(--color-text)' }}
                >
                  {new Date(task.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </td>
                <td
                  className="px-4 py-3 text-sm font-medium"
                  style={{ color: 'var(--color-text)' }}
                >
                  {task.userDisplayName}
                </td>
                <td
                  className="px-4 py-3 text-sm max-w-xs truncate"
                  style={{ color: 'var(--color-text)' }}
                >
                  {task.taskDescription}
                </td>
                <td className="px-4 py-3">
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-medium capitalize"
                    style={{
                      backgroundColor:
                        task.taskType === 'ticket'
                          ? 'var(--color-success-bg)'
                          : 'var(--color-info-bg)',
                      color:
                        task.taskType === 'ticket'
                          ? 'var(--color-success-text)'
                          : 'var(--color-info-text)',
                    }}
                  >
                    {task.taskType}
                  </span>
                </td>
                <td
                  className="px-4 py-3 text-sm"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {task.projectName || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface AttendanceTableProps {
  records: AttendanceRecord[];
  users: PulseUser[];
}

function AttendanceTable({ records, users }: AttendanceTableProps) {
  const getUserName = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    return user?.displayName || userId;
  };

  const formatTime = (iso?: string) => {
    if (!iso) return '--:--';
    return new Date(iso).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (records.length === 0) {
    return (
      <div
        className="rounded-lg p-8 text-center"
        style={{
          backgroundColor: 'var(--color-surface)',
        }}
      >
        <Calendar
          className="w-12 h-12 mx-auto mb-3 opacity-50"
          style={{ color: 'var(--color-text-muted)' }}
        />
        <p style={{ color: 'var(--color-text-muted)' }}>
          No attendance records found for the selected date range
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-lg border overflow-hidden"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
              <th
                className="px-4 py-3 text-left text-xs font-medium uppercase"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Date
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium uppercase"
                style={{ color: 'var(--color-text-muted)' }}
              >
                User
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium uppercase"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Check In
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium uppercase"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Check Out
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium uppercase"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Hours
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium uppercase"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
            {records.map((record) => (
              <tr key={record.id}>
                <td
                  className="px-4 py-3 text-sm"
                  style={{ color: 'var(--color-text)' }}
                >
                  {new Date(record.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </td>
                <td
                  className="px-4 py-3 text-sm font-medium"
                  style={{ color: 'var(--color-text)' }}
                >
                  {getUserName(record.userId)}
                </td>
                <td
                  className="px-4 py-3 text-sm"
                  style={{ color: 'var(--color-text)' }}
                >
                  {formatTime(record.checkInTime)}
                </td>
                <td
                  className="px-4 py-3 text-sm"
                  style={{ color: 'var(--color-text)' }}
                >
                  {formatTime(record.checkOutTime)}
                </td>
                <td
                  className="px-4 py-3 text-sm"
                  style={{ color: 'var(--color-text)' }}
                >
                  {record.totalHours ? `${record.totalHours.toFixed(1)}h` : '-'}
                </td>
                <td className="px-4 py-3">
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-medium capitalize"
                    style={{
                      backgroundColor:
                        record.status === 'present'
                          ? 'var(--color-success-bg)'
                          : record.status === 'on-leave'
                          ? 'var(--color-info-bg)'
                          : 'var(--color-warning-bg)',
                      color:
                        record.status === 'present'
                          ? 'var(--color-success-text)'
                          : record.status === 'on-leave'
                          ? 'var(--color-info-text)'
                          : 'var(--color-warning-text)',
                    }}
                  >
                    {record.status.replace('-', ' ')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
