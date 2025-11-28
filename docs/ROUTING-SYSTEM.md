# Routing System Documentation

This document explains the routing and access control architecture implemented in this React + TypeScript application.

## Table of Contents

- [Overview](#overview)
- [Core Concepts](#core-concepts)
- [Route Components](#route-components)
- [Permission System](#permission-system)
- [Adding New Routes](#adding-new-routes)
- [Navigation Guards](#navigation-guards)
- [Backend Integration](#backend-integration)

## Overview

The routing system provides three layers of access control:

1. **Public Routes** - Only accessible to unauthenticated users (e.g., login page)
2. **Private Routes** - Require authentication (valid token)
3. **Protected Routes** - Require specific Screen + Privilege permissions (RBAC)

## Core Concepts

### Screens

Screens are defined entities in the application that can be accessed:

```typescript
type Screen =
  | "BADGE"
  | "PROJECT"
  | "USERS"
  | "DASHBOARD"
  | "SETTINGS"
  | "REPORTS";
```

### Privileges

Privileges are actions that can be performed on screens:

```typescript
type Privilege = "VIEW" | "CREATE" | "EDIT" | "DELETE" | "CONFIGURE";
```

### Permissions

A permission is a combination of Screen + Privilege:

```typescript
interface Permission {
  screen: Screen;
  privilege: Privilege;
}
```

**Example:** To access `/badges/create`, the user needs `{ screen: 'BADGE', privilege: 'CREATE' }`.

## Route Components

### PublicRoute

Redirects authenticated users away from public pages (e.g., login).

```tsx
import { Route } from 'react-router-dom';
import { PublicRoute } from '@/routes';

<Route element={<PublicRoute />}>
  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />
</Route>

// With custom redirect destination
<Route element={<PublicRoute redirectTo="/" />}>
  <Route path="/login" element={<LoginPage />} />
</Route>
```

### PrivateRoute

Requires authentication. Redirects unauthenticated users to login.

```tsx
import { Route } from 'react-router-dom';
import { PrivateRoute } from '@/routes';

<Route element={<PrivateRoute />}>
  <Route path="/dashboard" element={<DashboardPage />} />
  <Route path="/profile" element={<ProfilePage />} />
</Route>

// With custom login path
<Route element={<PrivateRoute loginPath="/auth/signin" />}>
  <Route path="/dashboard" element={<DashboardPage />} />
</Route>
```

### ProtectedRoute

The RBAC wrapper that checks Screen + Privilege permissions.

#### Single Privilege

```tsx
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '@/routes';

// Require VIEW privilege for BADGE screen
<Route
  path="/badges"
  element={
    <ProtectedRoute screen="BADGE" privilege="VIEW">
      <BadgeListPage />
    </ProtectedRoute>
  }
/>

// Require CREATE privilege
<Route
  path="/badges/create"
  element={
    <ProtectedRoute screen="BADGE" privilege="CREATE">
      <CreateBadgePage />
    </ProtectedRoute>
  }
/>
```

#### Multiple Privileges (OR Logic)

When you need to allow access if the user has ANY of the specified privileges:

```tsx
// User needs VIEW OR EDIT privilege to access this route
<Route
  path="/badges/:id"
  element={
    <ProtectedRoute screen="BADGE" privileges={["VIEW", "EDIT"]}>
      <BadgeDetailPage />
    </ProtectedRoute>
  }
/>
```

#### Custom Fallback

```tsx
// Redirect to a different page on access denied
<ProtectedRoute screen="SETTINGS" privilege="CONFIGURE" fallbackPath="/dashboard">
  <SettingsPage />
</ProtectedRoute>

// Show a custom component instead of redirecting
<ProtectedRoute
  screen="SETTINGS"
  privilege="CONFIGURE"
  fallbackComponent={<AccessDenied message="Admin access required" />}
>
  <SettingsPage />
</ProtectedRoute>
```

## Permission System

### Using Permission Hooks

#### Check Screen Access

```tsx
import { useCanAccessScreen } from '@/routes';

function Navigation() {
  const canAccessBadges = useCanAccessScreen("BADGE");
  const canAccessUsers = useCanAccessScreen("USERS");

  return (
    <nav>
      {canAccessBadges && <NavLink to="/badges">Badges</NavLink>}
      {canAccessUsers && <NavLink to="/users">Users</NavLink>}
    </nav>
  );
}
```

#### Check Specific Permission

```tsx
import { useHasPermission } from '@/routes';

function BadgeActions() {
  const canCreate = useHasPermission("BADGE", "CREATE");
  const canDelete = useHasPermission("BADGE", "DELETE");

  return (
    <div>
      {canCreate && <Button onClick={handleCreate}>Create Badge</Button>}
      {canDelete && <Button onClick={handleDelete}>Delete</Button>}
    </div>
  );
}
```

### Using Auth Context Directly

```tsx
import { useAuth } from '@/context';

function MyComponent() {
  const { hasPermission, hasAnyPermission, hasAnyPermissionForScreen } = useAuth();

  // Single permission check
  const canEdit = hasPermission("BADGE", "EDIT");

  // Multiple permissions (OR logic)
  const canModify = hasAnyPermission([
    { screen: "BADGE", privilege: "EDIT" },
    { screen: "BADGE", privilege: "DELETE" },
  ]);

  // Any permission for a screen
  const canAccessBadges = hasAnyPermissionForScreen("BADGE");

  return (/* ... */);
}
```

## Adding New Routes

### Step 1: Define the Screen (if new)

Add the screen to `src/types/auth.ts`:

```typescript
export type Screen =
  | "BADGE"
  | "PROJECT"
  | "USERS"
  | "DASHBOARD"
  | "SETTINGS"
  | "REPORTS"
  | "NEW_SCREEN"; // Add your new screen
```

### Step 2: Add the Route

In `src/routes/AppRoutes.tsx`:

```tsx
// Inside the PrivateRoute wrapper
<Route
  path="/new-feature"
  element={
    <ProtectedRoute screen="NEW_SCREEN" privilege="VIEW">
      <NewFeaturePage />
    </ProtectedRoute>
  }
/>
<Route
  path="/new-feature/create"
  element={
    <ProtectedRoute screen="NEW_SCREEN" privilege="CREATE">
      <CreateNewFeaturePage />
    </ProtectedRoute>
  }
/>
```

### Step 3: Add Navigation (if needed)

```tsx
import { useCanAccessScreen } from '@/routes';

function Sidebar() {
  const canAccessNewFeature = useCanAccessScreen("NEW_SCREEN");

  return (
    <nav>
      {/* ... other links */}
      {canAccessNewFeature && (
        <NavLink to="/new-feature">New Feature</NavLink>
      )}
    </nav>
  );
}
```

## Navigation Guards

### Sidebar Visibility

Navigation links should be visible if the user has **any** privilege for that screen:

```tsx
import { useCanAccessScreen } from '@/routes';

function Sidebar() {
  const canAccessBadges = useCanAccessScreen("BADGE");
  const canAccessProjects = useCanAccessScreen("PROJECT");
  const canAccessUsers = useCanAccessScreen("USERS");

  return (
    <aside>
      <nav>
        {canAccessBadges && <NavLink to="/badges">Badges</NavLink>}
        {canAccessProjects && <NavLink to="/projects">Projects</NavLink>}
        {canAccessUsers && <NavLink to="/users">Users</NavLink>}
      </nav>
    </aside>
  );
}
```

### Button/Action Visibility

Show action buttons based on specific privileges:

```tsx
import { useHasPermission } from '@/routes';

function BadgeCard({ badge }) {
  const canEdit = useHasPermission("BADGE", "EDIT");
  const canDelete = useHasPermission("BADGE", "DELETE");

  return (
    <div>
      <h3>{badge.name}</h3>
      {canEdit && <Button onClick={() => navigate(`/badges/${badge.id}/edit`)}>Edit</Button>}
      {canDelete && <Button onClick={() => handleDelete(badge.id)}>Delete</Button>}
    </div>
  );
}
```

## Backend Integration

### Expected Data Structure

The backend should return user permissions as an array of `Permission` objects:

```json
{
  "user": {
    "id": "user-123",
    "email": "john@example.com",
    "name": "John Doe",
    "avatar": "https://example.com/avatar.jpg",
    "permissions": [
      { "screen": "BADGE", "privilege": "VIEW" },
      { "screen": "BADGE", "privilege": "CREATE" },
      { "screen": "BADGE", "privilege": "EDIT" },
      { "screen": "PROJECT", "privilege": "VIEW" },
      { "screen": "USERS", "privilege": "VIEW" },
      { "screen": "DASHBOARD", "privilege": "VIEW" }
    ]
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### TypeScript Types

```typescript
// src/types/auth.ts
interface Permission {
  screen: Screen;
  privilege: Privilege;
}

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  permissions: Permission[];
}

interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}
```

### Example Login Flow

```tsx
import { useAuth } from '@/context';
import { apiPost } from '@/api';
import type { AuthResponse, LoginCredentials } from '@/types/auth';

function LoginPage() {
  const { login } = useAuth();

  const handleLogin = async (credentials: LoginCredentials) => {
    const response = await apiPost<AuthResponse>('/auth/login', credentials);
    login(response.user, response.token);
  };

  return (/* login form */);
}
```

## File Structure

```
src/
├── routes/
│   ├── index.ts          # Exports all route components and hooks
│   ├── AppRoutes.tsx     # Main route configuration
│   ├── PublicRoute.tsx   # Wrapper for public-only routes
│   ├── PrivateRoute.tsx  # Wrapper for authenticated routes
│   └── ProtectedRoute.tsx # RBAC wrapper with permission checks
├── context/
│   ├── index.ts          # Exports AuthProvider and useAuth
│   └── AuthContext.tsx   # Authentication state management
└── types/
    └── auth.ts           # Permission, User, and auth types
```
