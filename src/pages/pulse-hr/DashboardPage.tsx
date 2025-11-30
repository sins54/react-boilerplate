/**
 * Pulse HR - Dashboard Page
 * 
 * Main dashboard with attendance widget, daily updates, and overview
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, FolderKanban, CheckCircle } from 'lucide-react';
import { useAuthStore, useAttendanceStore, useDailyLogStore, getYesterdayDateString, wasYesterdayWeekday } from '@/stores';
import { AttendanceWidget } from '@/components/pulse-hr/attendance';
import { LeaveBalanceCard } from '@/components/pulse-hr/leave';
import { DailyTaskWidget } from '@/components/pulse-hr/daily-log';
import { YesterdayUpdateModal } from '@/components/pulse-hr/daily-log';
import { 
  getTodayAttendance, 
  checkIn, 
  checkOut,
  getUserLeaveBalances,
} from '@/services';
import {
  getTodayDailyLog,
  getDailyLog,
  addManualTask,
  updateDailyLog,
} from '@/services/dailyLogService';
import type { LeaveBalance } from '@/types/pulse-hr';

export function DashboardPage() {
  const { user } = useAuthStore();
  const { todayRecord, setTodayRecord } = useAttendanceStore();
  const { todayLog, setTodayLog, showYesterdayModal, setShowYesterdayModal } = useDailyLogStore();
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [yesterdayDate, setYesterdayDate] = useState<string>('');

  useEffect(() => {
    if (user) {
      loadDashboardData();
      checkYesterdayUpdate();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [attendance, balances, dailyLog] = await Promise.all([
        getTodayAttendance(user.id),
        getUserLeaveBalances(user.id),
        getTodayDailyLog(user.id),
      ]);
      setTodayRecord(attendance);
      setLeaveBalances(balances);
      setTodayLog(dailyLog);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkYesterdayUpdate = async () => {
    if (!user || !wasYesterdayWeekday()) return;

    const yesterday = getYesterdayDateString();
    const yesterdayLog = await getDailyLog(user.id, yesterday);
    
    // Show modal if no log exists for yesterday
    if (!yesterdayLog) {
      setYesterdayDate(yesterday);
      setShowYesterdayModal(true, yesterday);
    }
  };

  const handleCheckIn = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const updated = await checkIn(user.id);
      setTodayRecord(updated);
    } catch (error) {
      console.error('Check-in failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const updated = await checkOut(user.id);
      setTodayRecord(updated);
    } catch (error) {
      console.error('Check-out failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = async (task: string) => {
    if (!user) return;
    try {
      const updated = await addManualTask(user.id, task);
      setTodayLog(updated);
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };

  const handleYesterdaySubmit = async (tasks: string[]) => {
    if (!user || !yesterdayDate) return;
    setIsLoading(true);
    try {
      await updateDailyLog(user.id, yesterdayDate, {
        date: yesterdayDate,
        manualTasks: tasks,
      });
      setShowYesterdayModal(false);
    } catch (error) {
      console.error('Failed to update yesterday:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleYesterdaySkip = () => {
    setShowYesterdayModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1
          className="text-2xl font-bold"
          style={{ color: 'var(--color-text)' }}
        >
          Welcome back, {user?.displayName?.split(' ')[0] || 'User'}!
        </h1>
        <p
          className="text-sm mt-1"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <QuickStatCard
          icon={<Clock className="w-5 h-5" />}
          label="Today's Status"
          value={todayRecord?.checkInTime ? 'Checked In' : 'Not Yet'}
          variant={todayRecord?.checkInTime ? 'success' : 'warning'}
        />
        <QuickStatCard
          icon={<Calendar className="w-5 h-5" />}
          label="Leave Balance"
          value={`${leaveBalances.reduce((acc, b) => acc + b.remaining, 0)} days`}
          variant="info"
        />
        <QuickStatCard
          icon={<FolderKanban className="w-5 h-5" />}
          label="Tasks Today"
          value={`${(todayLog?.manualTasks.length || 0) + (todayLog?.completedTickets.length || 0)}`}
          variant="default"
        />
        <QuickStatCard
          icon={<CheckCircle className="w-5 h-5" />}
          label="Tickets Done"
          value={`${todayLog?.completedTickets.length || 0}`}
          variant="success"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <AttendanceWidget
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
            isLoading={isLoading}
          />
          <LeaveBalanceCard balances={leaveBalances} />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <DailyTaskWidget
            log={todayLog}
            onAddTask={handleAddTask}
            isLoading={isLoading}
          />

          {/* Quick Links */}
          <div
            className="rounded-lg p-6 shadow-sm border"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <h3
              className="font-semibold mb-4"
              style={{ color: 'var(--color-text)' }}
            >
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/pulse/leave"
                className="flex items-center gap-2 p-3 rounded-lg transition-colors"
                style={{ backgroundColor: 'var(--color-bg-secondary)' }}
              >
                <Calendar
                  className="w-5 h-5"
                  style={{ color: 'var(--color-primary)' }}
                />
                <span
                  className="text-sm font-medium"
                  style={{ color: 'var(--color-text)' }}
                >
                  Request Leave
                </span>
              </Link>
              <Link
                to="/pulse/projects"
                className="flex items-center gap-2 p-3 rounded-lg transition-colors"
                style={{ backgroundColor: 'var(--color-bg-secondary)' }}
              >
                <FolderKanban
                  className="w-5 h-5"
                  style={{ color: 'var(--color-primary)' }}
                />
                <span
                  className="text-sm font-medium"
                  style={{ color: 'var(--color-text)' }}
                >
                  View Projects
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Yesterday Update Modal */}
      {showYesterdayModal && yesterdayDate && (
        <YesterdayUpdateModal
          date={yesterdayDate}
          onSubmit={handleYesterdaySubmit}
          onSkip={handleYesterdaySkip}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}

interface QuickStatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  variant: 'default' | 'success' | 'warning' | 'info';
}

function QuickStatCard({ icon, label, value, variant }: QuickStatCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return {
          bg: 'var(--color-success-bg)',
          icon: 'var(--color-success)',
        };
      case 'warning':
        return {
          bg: 'var(--color-warning-bg)',
          icon: 'var(--color-warning)',
        };
      case 'info':
        return {
          bg: 'var(--color-info-bg)',
          icon: 'var(--color-info)',
        };
      default:
        return {
          bg: 'var(--color-muted)',
          icon: 'var(--color-primary)',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div
      className="rounded-lg p-4 shadow-sm border"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
        style={{ backgroundColor: styles.bg }}
      >
        <span style={{ color: styles.icon }}>{icon}</span>
      </div>
      <p
        className="text-xs font-medium"
        style={{ color: 'var(--color-text-muted)' }}
      >
        {label}
      </p>
      <p
        className="text-lg font-semibold"
        style={{ color: 'var(--color-text)' }}
      >
        {value}
      </p>
    </div>
  );
}
