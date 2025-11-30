/**
 * Pulse HR - Dashboard Layout
 * 
 * Main layout with sidebar navigation and mobile header
 */

import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Clock,
  Calendar,
  FolderKanban,
  FileText,
  Users,
  CheckSquare,
  Menu,
  X,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { useAuthStore } from '@/stores';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  {
    icon: <LayoutDashboard className="w-5 h-5" />,
    label: 'Dashboard',
    path: '/pulse',
  },
  {
    icon: <Clock className="w-5 h-5" />,
    label: 'Attendance',
    path: '/pulse/attendance',
  },
  {
    icon: <Calendar className="w-5 h-5" />,
    label: 'Leave',
    path: '/pulse/leave',
  },
  {
    icon: <FolderKanban className="w-5 h-5" />,
    label: 'Projects',
    path: '/pulse/projects',
  },
  {
    icon: <FileText className="w-5 h-5" />,
    label: 'Reports',
    path: '/pulse/reports',
  },
  {
    icon: <CheckSquare className="w-5 h-5" />,
    label: 'Approvals',
    path: '/pulse/approvals',
    adminOnly: true,
  },
  {
    icon: <Users className="w-5 h-5" />,
    label: 'Users',
    path: '/pulse/users',
    adminOnly: true,
  },
];

export function PulseLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, logout, isAdmin } = useAuthStore();

  const visibleNavItems = navItems.filter(
    (item) => !item.adminOnly || isAdmin()
  );

  const isActive = (path: string) => {
    if (path === '/pulse') {
      return location.pathname === '/pulse';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      {/* Desktop Sidebar */}
      <aside
        className="hidden md:flex flex-col w-64 border-r"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        {/* Logo */}
        <div
          className="h-16 flex items-center px-4 border-b"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <Link to="/pulse" className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-lg"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-text-on-primary)',
              }}
            >
              P
            </div>
            <span
              className="font-bold text-xl"
              style={{ color: 'var(--color-text)' }}
            >
              Pulse HR
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {visibleNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive(item.path) ? 'font-medium' : ''
              }`}
              style={{
                backgroundColor: isActive(item.path)
                  ? 'var(--color-primary)'
                  : 'transparent',
                color: isActive(item.path)
                  ? 'var(--color-text-on-primary)'
                  : 'var(--color-text)',
              }}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User Info */}
        <div
          className="p-4 border-t"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-medium"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-text-on-primary)',
              }}
            >
              {user?.displayName?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="font-medium truncate"
                style={{ color: 'var(--color-text)' }}
              >
                {user?.displayName || 'User'}
              </p>
              <p
                className="text-xs truncate capitalize"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {user?.role || 'Employee'}
              </p>
            </div>
          </div>
          <button
            onClick={() => logout()}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg transition-colors"
            style={{
              backgroundColor: 'var(--color-muted)',
              color: 'var(--color-text)',
            }}
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-200 md:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        {/* Close Button */}
        <div className="h-16 flex items-center justify-between px-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <span
            className="font-bold text-xl"
            style={{ color: 'var(--color-text)' }}
          >
            Pulse HR
          </span>
          <button
            onClick={() => setSidebarOpen(false)}
            style={{ color: 'var(--color-text)' }}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className="p-4 space-y-1">
          {visibleNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center justify-between px-3 py-3 rounded-lg transition-colors ${
                isActive(item.path) ? 'font-medium' : ''
              }`}
              style={{
                backgroundColor: isActive(item.path)
                  ? 'var(--color-primary)'
                  : 'transparent',
                color: isActive(item.path)
                  ? 'var(--color-text-on-primary)'
                  : 'var(--color-text)',
              }}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                {item.label}
              </div>
              <ChevronRight className="w-4 h-4" />
            </Link>
          ))}
        </nav>

        {/* Mobile User Info */}
        <div
          className="absolute bottom-0 left-0 right-0 p-4 border-t"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-medium"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-text-on-primary)',
              }}
            >
              {user?.displayName?.charAt(0) || 'U'}
            </div>
            <div className="flex-1">
              <p
                className="font-medium"
                style={{ color: 'var(--color-text)' }}
              >
                {user?.displayName || 'User'}
              </p>
              <p
                className="text-xs capitalize"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {user?.role || 'Employee'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              setSidebarOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg"
            style={{
              backgroundColor: 'var(--color-muted)',
              color: 'var(--color-text)',
            }}
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header
          className="md:hidden h-16 flex items-center justify-between px-4 border-b"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            style={{ color: 'var(--color-text)' }}
          >
            <Menu className="w-6 h-6" />
          </button>
          <span
            className="font-bold text-lg"
            style={{ color: 'var(--color-text)' }}
          >
            Pulse HR
          </span>
          <div className="w-6" /> {/* Spacer for alignment */}
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
