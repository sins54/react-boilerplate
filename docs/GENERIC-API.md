# Generic API Layer Documentation

This document explains the centralized API management architecture using Axios and TanStack Query (React Query).

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Axios Client](#axios-client)
- [Generic API Functions](#generic-api-functions)
- [React Query Hooks](#react-query-hooks)
- [Examples](#examples)
- [Error Handling](#error-handling)
- [Token Override](#token-override)

## Overview

The API layer provides:

1. **Axios Client** - Configured instance with interceptors for auth and error handling
2. **Generic API Functions** - Type-safe wrapper functions (`apiGet`, `apiPost`, etc.)
3. **React Query Hooks** - Custom hooks for data fetching and mutations

## Installation

```bash
npm install axios @tanstack/react-query
```

### Setup QueryClient

In your `main.tsx` or `App.tsx`:

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {/* Your app */}
      </AuthProvider>
    </QueryClientProvider>
  );
}
```

## Axios Client

### Configuration

The Axios client is pre-configured with:

- Base URL from environment variable `VITE_API_BASE_URL`
- 30-second timeout
- JSON content type
- Request interceptor for auth token
- Response interceptor for error handling

### File: `src/api/client.ts`

```typescript
import { apiClient, getAuthToken, setAuthToken, removeAuthToken } from '@/api';
```

### Token Management

```typescript
import { getAuthToken, setAuthToken, removeAuthToken } from '@/api';

// Get current token
const token = getAuthToken();

// Set token (typically after login)
setAuthToken('your-jwt-token');

// Remove token (logout)
removeAuthToken();
```

### Interceptors

#### Request Interceptor

Automatically attaches `Authorization: Bearer <token>` header if:
1. No custom Authorization header is provided
2. A token exists in localStorage

#### Response Interceptor

Handles global errors:

- **401 Unauthorized**: Clears token and dispatches `auth:unauthorized` event
- **403 Forbidden**: Dispatches `auth:forbidden` event with error message

Listen for these events in your app:

```typescript
// In AuthContext or a global handler
useEffect(() => {
  const handleUnauthorized = () => {
    // Redirect to login, clear state, etc.
  };

  const handleForbidden = (e: CustomEvent) => {
    // Show toast notification
    toast.error(e.detail.message);
  };

  window.addEventListener('auth:unauthorized', handleUnauthorized);
  window.addEventListener('auth:forbidden', handleForbidden);

  return () => {
    window.removeEventListener('auth:unauthorized', handleUnauthorized);
    window.removeEventListener('auth:forbidden', handleForbidden);
  };
}, []);
```

## Generic API Functions

### File: `src/api/generic-api.ts`

All functions are generic and type-safe.

### apiGet

```typescript
import { apiGet } from '@/api';

// Basic usage
const users = await apiGet<User[]>('/users');

// With query parameters
const filteredUsers = await apiGet<User[]>('/users', { status: 'active', page: 1 });

// With custom config
const data = await apiGet<Data>('/endpoint', undefined, {
  headers: { 'X-Custom-Header': 'value' }
});
```

### apiPost

```typescript
import { apiPost } from '@/api';

// Create a resource
const newUser = await apiPost<User, CreateUserDto>('/users', {
  name: 'John Doe',
  email: 'john@example.com',
});

// Without body
const result = await apiPost<ActionResult>('/actions/trigger');
```

### apiPut

```typescript
import { apiPut } from '@/api';

// Full update
const updatedUser = await apiPut<User, UpdateUserDto>('/users/123', {
  name: 'Jane Doe',
  email: 'jane@example.com',
});
```

### apiPatch

```typescript
import { apiPatch } from '@/api';

// Partial update
const patchedUser = await apiPatch<User, Partial<UpdateUserDto>>('/users/123', {
  name: 'Jane',
});
```

### apiDelete

```typescript
import { apiDelete } from '@/api';

// Delete a resource
await apiDelete<void>('/users/123');

// With response
const result = await apiDelete<DeleteResult>('/users/123');
```

## React Query Hooks

### useFetch

A wrapper around `useQuery` for GET requests.

```typescript
import { useFetch } from '@/hooks';

// Basic usage
function UserList() {
  const { data, isLoading, error, refetch } = useFetch<User[]>('users', '/users');

  if (isLoading) return <Loading />;
  if (error) return <Error message={error.message} />;

  return (
    <ul>
      {data?.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}
```

#### With Query Parameters

```typescript
const { data } = useFetch<User[]>(
  ['users', { status: 'active' }],  // Query key includes params
  '/users',
  { params: { status: 'active' } }
);
```

#### With Options

```typescript
const { data } = useFetch<User>(
  ['user', userId],
  `/users/${userId}`,
  {
    enabled: !!userId,              // Only fetch when userId exists
    staleTime: 5 * 60 * 1000,       // Cache for 5 minutes
    refetchOnWindowFocus: false,    // Don't refetch on window focus
    onSuccess: (data) => {
      console.log('User loaded:', data);
    },
    onError: (error) => {
      console.error('Failed to load user:', error);
    },
  }
);
```

### useGenericMutation

A wrapper around `useMutation` for POST/PUT/PATCH/DELETE operations.

#### POST (Create)

```typescript
import { useGenericMutation } from '@/hooks';

function CreateUserForm() {
  const createUser = useGenericMutation<User, CreateUserDto>({
    method: 'POST',
    url: '/users',
    invalidateKeys: [['users']],  // Invalidate users list cache
    onSuccess: (newUser) => {
      toast.success(`User ${newUser.name} created!`);
      navigate('/users');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (data: CreateUserDto) => {
    createUser.mutate({ data });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button type="submit" disabled={createUser.isPending}>
        {createUser.isPending ? 'Creating...' : 'Create User'}
      </button>
    </form>
  );
}
```

#### PUT (Full Update)

```typescript
const updateUser = useGenericMutation<User, UpdateUserDto>({
  method: 'PUT',
  url: '/users',
  invalidateKeys: [['users'], ['user', userId]],
});

// Usage - appends ID to URL
updateUser.mutate({
  urlParams: `/${userId}`,  // Results in PUT /users/123
  data: { name: 'Jane', email: 'jane@example.com' },
});
```

#### PATCH (Partial Update)

```typescript
const patchUser = useGenericMutation<User, Partial<UpdateUserDto>>({
  method: 'PATCH',
  url: '/users',
  invalidateKeys: [['users'], ['user', userId]],
});

patchUser.mutate({
  urlParams: `/${userId}`,
  data: { name: 'Jane' },  // Only update name
});
```

#### DELETE

```typescript
const deleteUser = useGenericMutation<void>({
  method: 'DELETE',
  url: '/users',
  invalidateKeys: [['users']],
  onSuccess: () => {
    toast.success('User deleted');
  },
});

deleteUser.mutate({ urlParams: `/${userId}` });
```

## Examples

### Complete CRUD Example

```typescript
import { useFetch, useGenericMutation } from '@/hooks';

interface Badge {
  id: string;
  name: string;
  description: string;
}

interface CreateBadgeDto {
  name: string;
  description: string;
}

function BadgeManagement() {
  // Read - list all badges
  const { data: badges, isLoading } = useFetch<Badge[]>('badges', '/badges');

  // Create
  const createBadge = useGenericMutation<Badge, CreateBadgeDto>({
    method: 'POST',
    url: '/badges',
    invalidateKeys: [['badges']],
  });

  // Update
  const updateBadge = useGenericMutation<Badge, Partial<CreateBadgeDto>>({
    method: 'PATCH',
    url: '/badges',
    invalidateKeys: [['badges']],
  });

  // Delete
  const deleteBadge = useGenericMutation<void>({
    method: 'DELETE',
    url: '/badges',
    invalidateKeys: [['badges']],
  });

  const handleCreate = () => {
    createBadge.mutate({
      data: { name: 'New Badge', description: 'A new badge' },
    });
  };

  const handleUpdate = (id: string) => {
    updateBadge.mutate({
      urlParams: `/${id}`,
      data: { name: 'Updated Badge' },
    });
  };

  const handleDelete = (id: string) => {
    deleteBadge.mutate({ urlParams: `/${id}` });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <button onClick={handleCreate}>Create Badge</button>
      <ul>
        {badges?.map(badge => (
          <li key={badge.id}>
            {badge.name}
            <button onClick={() => handleUpdate(badge.id)}>Update</button>
            <button onClick={() => handleDelete(badge.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Dependent Queries

```typescript
function UserProjects({ userId }: { userId: string }) {
  // First, fetch the user
  const { data: user } = useFetch<User>(
    ['user', userId],
    `/users/${userId}`,
    { enabled: !!userId }
  );

  // Then fetch their projects (only when user is loaded)
  const { data: projects } = useFetch<Project[]>(
    ['projects', userId],
    `/users/${userId}/projects`,
    { enabled: !!user }
  );

  return (/* ... */);
}
```

### Polling

```typescript
const { data } = useFetch<Status>(
  'status',
  '/system/status',
  {
    refetchInterval: 5000,  // Poll every 5 seconds
  }
);
```

## Error Handling

### Global Error Handling

The Axios interceptor handles 401 and 403 errors globally. For other errors:

```typescript
const { error } = useFetch<User[]>('users', '/users');

if (error) {
  // error is typed as Error
  console.error(error.message);
}
```

### Mutation Error Handling

```typescript
const mutation = useGenericMutation<User, CreateUserDto>({
  method: 'POST',
  url: '/users',
  onError: (error) => {
    // Handle error
    if (error.message.includes('duplicate')) {
      toast.error('User already exists');
    } else {
      toast.error('Failed to create user');
    }
  },
});
```

### Try-Catch with Direct API Calls

```typescript
import { apiPost } from '@/api';
import type { AxiosError } from 'axios';

async function createUser(data: CreateUserDto) {
  try {
    const user = await apiPost<User>('/users', data);
    return user;
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    console.error('API Error:', axiosError.response?.data?.message);
    throw error;
  }
}
```

## Token Override

### For Specific Request

Use the `axiosConfig` option to override the default token:

```typescript
// With useFetch
const { data } = useFetch<Data>(
  'protected',
  '/protected',
  {
    axiosConfig: {
      headers: { Authorization: 'Bearer custom-token' }
    }
  }
);

// With useGenericMutation
const mutation = useGenericMutation<Data>({
  method: 'POST',
  url: '/protected',
  axiosConfig: {
    headers: { Authorization: 'Bearer custom-token' }
  },
});

// With direct API call
const data = await apiGet<Data>('/protected', undefined, {
  headers: { Authorization: 'Bearer custom-token' }
});
```

### Service-to-Service Calls

For backend service tokens or API keys:

```typescript
const serviceToken = 'service-api-key';

const { data } = useFetch<ExternalData>(
  'external',
  '/external-api',
  {
    axiosConfig: {
      headers: {
        Authorization: `Bearer ${serviceToken}`,
        'X-API-Key': 'api-key-value',
      }
    }
  }
);
```

## File Structure

```
src/
├── api/
│   ├── index.ts         # Exports all API utilities
│   ├── client.ts        # Axios instance with interceptors
│   └── generic-api.ts   # Generic API functions (apiGet, apiPost, etc.)
└── hooks/
    ├── index.ts             # Exports all hooks
    ├── useFetch.ts          # useQuery wrapper
    └── useGenericMutation.ts # useMutation wrapper
```

## Environment Variables

Create a `.env` file:

```env
VITE_API_BASE_URL=https://api.example.com
```

Or use the default `/api` prefix for same-origin requests.
