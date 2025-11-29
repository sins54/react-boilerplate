import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/navigation/DropdownMenu";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useAuth, useCanAccessScreen } from "@/hooks/useAuth";
import type { Screen } from "@/types/auth";

// ============================================================================
// Sidebar Context
// ============================================================================

interface SidebarContextValue {
  isCollapsed: boolean;
  toggleCollapsed: () => void;
  isMobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a DashboardLayout");
  }
  return context;
}

// ============================================================================
// Navigation Configuration
// ============================================================================

interface NavItem {
  label: string;
  href: string;
  screen: Screen;
  icon: ReactNode;
}

const navigationItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    screen: "DASHBOARD",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: "Badges",
    href: "/badges",
    screen: "BADGE",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M12 15l-3.5 2 1-4L6 10l4-.5L12 6l2 3.5 4 .5-3.5 3 1 4z" />
      </svg>
    ),
  },
  {
    label: "Projects",
    href: "/projects",
    screen: "PROJECT",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    ),
  },
  {
    label: "Users",
    href: "/users",
    screen: "USERS",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    label: "Reports",
    href: "/reports",
    screen: "REPORTS",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    label: "Settings",
    href: "/settings",
    screen: "SETTINGS",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
      </svg>
    ),
  },
];

// ============================================================================
// Theme Toggle Component
// ============================================================================

function ThemeToggle() {
  const [theme, setTheme] = useLocalStorage<"light" | "dark" | "system">(
    "theme-preference",
    "system"
  );

  const cycleTheme = useCallback(() => {
    const nextTheme = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
    setTheme(nextTheme);

    // Update document class
    if (nextTheme === "system") {
      document.documentElement.classList.remove("light", "dark");
    } else {
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(nextTheme);
    }
  }, [theme, setTheme]);

  const icon = theme === "light" ? (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  ) : theme === "dark" ? (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  ) : (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );

  return (
    <button
      onClick={cycleTheme}
      className="p-2 rounded-[length:var(--radius-md)] transition-colors"
      style={{
        color: "var(--color-text-secondary)",
        backgroundColor: "transparent",
      }}
      aria-label={`Current theme: ${theme}. Click to change.`}
      title={`Theme: ${theme}`}
    >
      {icon}
    </button>
  );
}

// ============================================================================
// Sidebar Navigation Item
// ============================================================================

interface SidebarNavItemProps {
  item: NavItem;
}

function SidebarNavItem({ item }: SidebarNavItemProps) {
  const { isCollapsed, setMobileOpen } = useSidebar();
  const location = useLocation();
  const canAccess = useCanAccessScreen(item.screen);

  // Don't render items the user can't access
  if (!canAccess) return null;

  const isActive = location.pathname === item.href || location.pathname.startsWith(`${item.href}/`);

  return (
    <NavLink
      to={item.href}
      onClick={() => setMobileOpen(false)}
      className="flex items-center gap-3 px-3 py-2.5 rounded-[length:var(--radius-md)] transition-colors"
      style={{
        backgroundColor: isActive ? "var(--color-primary)" : "transparent",
        color: isActive ? "var(--color-text-on-primary)" : "var(--color-text-secondary)",
      }}
      title={isCollapsed ? item.label : undefined}
    >
      <span className="flex-shrink-0">{item.icon}</span>
      {!isCollapsed && (
        <span className="font-medium truncate">{item.label}</span>
      )}
    </NavLink>
  );
}

// ============================================================================
// Sidebar Content
// ============================================================================

function SidebarContent() {
  const { isCollapsed, toggleCollapsed } = useSidebar();

  return (
    <div className="flex flex-col h-full">
      {/* Logo/Brand */}
      <div
        className="flex items-center gap-3 px-4 py-4 border-b"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div
          className="w-8 h-8 rounded-[length:var(--radius-md)] flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            style={{ color: "var(--color-text-on-primary)" }}
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        {!isCollapsed && (
          <span
            className="font-semibold text-lg truncate"
            style={{ color: "var(--color-text)" }}
          >
            App Name
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navigationItems.map((item) => (
          <SidebarNavItem key={item.href} item={item} />
        ))}
      </nav>

      {/* Collapse toggle (desktop only) */}
      <div
        className="hidden md:flex items-center justify-center p-3 border-t"
        style={{ borderColor: "var(--color-border)" }}
      >
        <button
          onClick={toggleCollapsed}
          className="p-2 rounded-[length:var(--radius-md)] transition-colors w-full flex items-center justify-center gap-2"
          style={{
            backgroundColor: "var(--color-surface-hover)",
            color: "var(--color-text-secondary)",
          }}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg
            className={`w-5 h-5 transition-transform ${isCollapsed ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M11 19l-7-7 7-7M18 19l-7-7 7-7" />
          </svg>
          {!isCollapsed && <span className="text-sm">Collapse</span>}
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// User Avatar Dropdown
// ============================================================================

function UserAvatarDropdown() {
  const { user, logout } = useAuth();

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "??";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-2 p-1 rounded-[length:var(--radius-md)] transition-colors"
          style={{
            backgroundColor: "transparent",
          }}
        >
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
              style={{
                backgroundColor: "var(--color-primary)",
                color: "var(--color-text-on-primary)",
              }}
            >
              {initials}
            </div>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span style={{ color: "var(--color-text)" }}>{user?.name || "User"}</span>
            <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              {user?.email || ""}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
          </svg>
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ============================================================================
// Header Component
// ============================================================================

function Header() {
  const { setMobileOpen } = useSidebar();

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-6 h-16 border-b"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden p-2 rounded-[length:var(--radius-md)] transition-colors"
        style={{
          color: "var(--color-text)",
          backgroundColor: "transparent",
        }}
        aria-label="Open navigation menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Spacer for desktop */}
      <div className="hidden md:block" />

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <UserAvatarDropdown />
      </div>
    </header>
  );
}

// ============================================================================
// Mobile Sidebar Drawer
// ============================================================================

function MobileSidebar() {
  const { isMobileOpen, setMobileOpen } = useSidebar();

  return (
    <Dialog.Root open={isMobileOpen} onOpenChange={setMobileOpen}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-40 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        />
        <Dialog.Content
          className="fixed left-0 top-0 bottom-0 z-50 w-72 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left"
          style={{
            backgroundColor: "var(--color-surface)",
            borderRight: "1px solid var(--color-border)",
          }}
        >
          <Dialog.Title className="sr-only">Navigation Menu</Dialog.Title>
          <Dialog.Description className="sr-only">
            Main navigation menu for the application
          </Dialog.Description>
          
          {/* Close button */}
          <Dialog.Close
            className="absolute top-4 right-4 p-1 rounded-[length:var(--radius-sm)]"
            style={{ color: "var(--color-text-muted)" }}
            aria-label="Close navigation menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </Dialog.Close>

          <SidebarContent />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// ============================================================================
// Dashboard Layout Component
// ============================================================================

interface DashboardLayoutProps {
  /** Custom children to render instead of Outlet */
  children?: ReactNode;
}

/**
 * Dashboard layout with collapsible sidebar, sticky header, and responsive behavior.
 * Uses Design System semantic variables - NO hardcoded hex values.
 *
 * Features:
 * - Collapsible sidebar (state persisted to localStorage)
 * - Sticky header with theme toggle and user avatar dropdown
 * - Scrollable main content area with proper padding
 * - Mobile: Sidebar becomes a drawer/sheet
 * - Navigation items are filtered based on user permissions (screen-based RBAC)
 *
 * @example
 * // In your routes:
 * <Route element={<DashboardLayout />}>
 *   <Route path="/dashboard" element={<DashboardPage />} />
 *   <Route path="/badges" element={<BadgesPage />} />
 * </Route>
 */
export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useLocalStorage("sidebar-collapsed", false);
  const [isMobileOpen, setMobileOpen] = useState(false);

  const toggleCollapsed = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, [setIsCollapsed]);

  const contextValue: SidebarContextValue = {
    isCollapsed,
    toggleCollapsed,
    isMobileOpen,
    setMobileOpen,
  };

  return (
    <SidebarContext.Provider value={contextValue}>
      <div
        className="min-h-screen flex"
        style={{ backgroundColor: "var(--color-bg)" }}
      >
        {/* Desktop Sidebar */}
        <aside
          className={`hidden md:flex flex-col transition-all duration-300 ${
            isCollapsed ? "w-16" : "w-64"
          }`}
          style={{
            backgroundColor: "var(--color-surface)",
            borderRight: "1px solid var(--color-border)",
          }}
        >
          <SidebarContent />
        </aside>

        {/* Mobile Sidebar (drawer) */}
        <MobileSidebar />

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <main className="flex-1 overflow-auto p-6 md:p-8">
            {children ?? <Outlet />}
          </main>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}
