# Phantom Backend (MSW Mock Service Worker)

This document explains the "Phantom Backend" implementation using [MSW (Mock Service Worker)](https://mswjs.io/). This setup allows full simulation of Authentication, Permission Management, and Server-Side Pagination without a real server.

## Table of Contents

- [Overview](#overview)
- [How It Works](#how-it-works)
- [Quick Start](#quick-start)
- [Available Endpoints](#available-endpoints)
- [Test Accounts](#test-accounts)
- [How to Add New Mocks](#how-to-add-new-mocks)
- [How to Remove Mocks](#how-to-remove-mocks)

## Overview

The Phantom Backend intercepts HTTP requests made by Axios and returns dynamic, realistic responses generated using `@faker-js/faker`. This enables:

- **Frontend development without a backend** - Build and test UI features independently
- **Realistic data simulation** - Use faker to generate consistent, realistic test data
- **Authentication testing** - Simulate login flows with different permission levels
- **Server-side pagination** - Test table components with paginated data

## How It Works

MSW uses a Service Worker to intercept network requests at the browser level:

1. **Service Worker Registration**: On app startup (dev mode only), MSW registers a Service Worker (`public/mockServiceWorker.js`)
2. **Request Interception**: All HTTP requests are intercepted by the Service Worker before reaching the network
3. **Mock Response**: If a handler matches the request, it returns a mock response; otherwise, the request proceeds normally
4. **Seamless Experience**: The browser and app cannot distinguish between mock and real responses

```
[App] → [Axios] → [Service Worker] → [MSW Handler] → [Mock Response]
                         ↓
                   [Real Network] (if no handler matches)
```

## Quick Start

1. **Install dependencies** (already done):
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Login with test accounts**:
   - **Admin**: `admin@example.com` / `password` (any password works)
   - **User**: `user@example.com` / `password`

4. **Open DevTools**: You'll see MSW logs in the console showing intercepted requests

## Available Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login with email/password |
| GET | `/api/auth/me` | Get current user profile |

### Badges (`/api/badges`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/badges` | List badges (paginated) |
| GET | `/api/badges/:id` | Get single badge |
| POST | `/api/badges` | Create new badge |
| PUT | `/api/badges/:id` | Update badge |
| DELETE | `/api/badges/:id` | Delete badge |

#### Badge Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10) |
| `search` | string | Filter by name (case-insensitive) |
| `status` | string | Filter by status: `active`, `inactive`, `pending` |

**Example**: `GET /api/badges?page=2&limit=20&search=gold&status=active`

## Test Accounts

| Email | Password | Permissions |
|-------|----------|-------------|
| `admin@example.com` | any | Full access to all screens |
| `user@example.com` | any | Limited access (BADGE_VIEW, DASHBOARD_VIEW only) |
| Any other email | any | Returns 401 Unauthorized |

### Admin Permissions

- BADGE: VIEW, CREATE, EDIT, DELETE
- PROJECT: VIEW, CREATE, EDIT, DELETE
- USERS: VIEW, CREATE, EDIT, DELETE
- DASHBOARD: VIEW
- SETTINGS: VIEW, CONFIGURE
- REPORTS: VIEW

### User Permissions

- BADGE: VIEW
- DASHBOARD: VIEW

## How to Add New Mocks

### Step 1: Create a Handler File

Create a new file in `src/mocks/handlers/`:

```typescript
// src/mocks/handlers/projects.ts
import { http, HttpResponse, delay } from 'msw';
import { faker } from '@faker-js/faker';

export const projectHandlers = [
  http.get('/api/projects', async () => {
    await delay(500); // Simulate network latency

    const projects = Array.from({ length: 10 }, () => ({
      id: faker.string.uuid(),
      name: faker.company.name(),
      status: faker.helpers.arrayElement(['active', 'completed', 'on-hold']),
    }));

    return HttpResponse.json({ data: projects });
  }),

  http.post('/api/projects', async ({ request }) => {
    await delay(500);
    const body = await request.json();
    
    return HttpResponse.json({
      id: faker.string.uuid(),
      ...body,
      createdAt: new Date().toISOString(),
    }, { status: 201 });
  }),
];
```

### Step 2: Register the Handler

Add the handler to `src/mocks/handlers/index.ts`:

```typescript
import { authHandlers } from './auth';
import { badgeHandlers } from './badges';
import { projectHandlers } from './projects'; // Add import

export const handlers = [
  ...authHandlers,
  ...badgeHandlers,
  ...projectHandlers, // Add to handlers array
];
```

### Step 3: Restart Dev Server

The changes will take effect after restarting the development server.

## How to Remove Mocks

When connecting to a real backend, follow these steps to remove the Phantom Backend:

### Step 1: Remove the MSW Start Logic

Edit `src/main.tsx` and remove the mocking code:

```typescript
// Remove this function
async function enableMocking(): Promise<void> {
  if (import.meta.env.DEV) {
    const { worker } = await import('@/mocks/browser')
    await worker.start({
      onUnhandledRequest: 'bypass',
    })
  }
}

// Change from this:
enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(/* ... */)
})

// To this:
createRoot(document.getElementById('root')!).render(/* ... */)
```

### Step 2: Delete the Mocks Folder

```bash
rm -rf src/mocks
```

### Step 3: Delete the Service Worker File

```bash
rm public/mockServiceWorker.js
```

### Step 4: Remove the msw Configuration from package.json

Remove the `msw` section from `package.json`:

```json
{
  "msw": {
    "workerDirectory": ["public"]
  }
}
```

### Step 5: (Optional) Uninstall Dependencies

If you no longer need the mock dependencies:

```bash
npm uninstall msw @faker-js/faker
```

### Step 6: Update Environment Variables

Set `VITE_API_BASE_URL` in your `.env` file to point to your real backend:

```env
VITE_API_BASE_URL=https://api.your-domain.com
```

## File Structure

```
src/
├── mocks/
│   ├── browser.ts           # MSW browser setup
│   └── handlers/
│       ├── index.ts         # Handler registry
│       ├── auth.ts          # Authentication handlers
│       └── badges.ts        # Badge CRUD handlers
public/
└── mockServiceWorker.js     # Generated MSW service worker
```

## Troubleshooting

### Mocks not working?

1. **Check the console**: MSW logs intercepted requests
2. **Clear Service Worker**: In DevTools → Application → Service Workers → Unregister
3. **Hard refresh**: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### Request not being intercepted?

- Verify the handler URL matches exactly (including `/api` prefix)
- Check if the HTTP method matches (GET vs POST, etc.)
- Ensure the handler is registered in `handlers/index.ts`

### Getting CORS errors?

MSW intercepts requests before they reach the network, so CORS shouldn't be an issue. If you see CORS errors, the request might not be intercepted - check the handler configuration.
