/**
 * Nexus Admin MSW Handlers
 * Mock handlers for organizations, users, and analytics endpoints.
 */

import { http, HttpResponse, delay } from 'msw';
import { faker } from '@faker-js/faker';
import type {
  Organization,
  NexusUser,
  UserRole,
  UserStatus,
  AnalyticsData,
  RevenueDataPoint,
  UserLocation,
  PaginatedUsersResponse,
  BulkDeleteResponse,
} from '@/features/nexus/types';

// ============================================
// Data Generation
// ============================================

/**
 * Generate consistent mock organizations.
 */
function generateOrganizations(): Organization[] {
  faker.seed(100);
  
  return [
    {
      id: 'org-001',
      name: 'Acme Corporation',
      slug: 'acme-corp',
      logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=acme',
      plan: 'enterprise',
      createdAt: faker.date.past({ years: 3 }).toISOString(),
      memberCount: 247,
    },
    {
      id: 'org-002',
      name: 'TechStart Inc',
      slug: 'techstart',
      logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=techstart',
      plan: 'professional',
      createdAt: faker.date.past({ years: 2 }).toISOString(),
      memberCount: 52,
    },
    {
      id: 'org-003',
      name: 'Global Solutions',
      slug: 'global-solutions',
      logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=global',
      plan: 'starter',
      createdAt: faker.date.past({ years: 1 }).toISOString(),
      memberCount: 18,
    },
    {
      id: 'org-004',
      name: 'Startup Labs',
      slug: 'startup-labs',
      plan: 'free',
      createdAt: faker.date.recent({ days: 90 }).toISOString(),
      memberCount: 5,
    },
  ];
}

// Generate organizations once
const mockOrganizations = generateOrganizations();

/**
 * Generate 10,000 mock users for the Mega User Table.
 */
function generateUsers(): NexusUser[] {
  faker.seed(200);
  
  const roles: UserRole[] = ['admin', 'editor', 'viewer', 'member'];
  const statuses: UserStatus[] = ['active', 'inactive', 'pending', 'suspended'];
  const departments = ['Engineering', 'Marketing', 'Sales', 'Support', 'HR', 'Finance', 'Operations'];
  
  const users: NexusUser[] = [];
  
  for (let i = 0; i < 10000; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const status = statuses[i % 4];
    
    users.push({
      id: faker.string.uuid(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${lastName}`,
      name: `${firstName} ${lastName}`,
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      role: roles[Math.floor((i * 7) % roles.length)],
      status,
      lastLogin: status === 'active' 
        ? faker.date.recent({ days: 7 }).toISOString()
        : status === 'inactive'
        ? faker.date.past({ years: 1 }).toISOString()
        : null,
      joinedAt: faker.date.past({ years: 3 }).toISOString(),
      department: departments[i % departments.length],
    });
  }
  
  return users;
}

// Generate users once (lazy initialization for performance)
let mockUsers: NexusUser[] | null = null;

function getUsers(): NexusUser[] {
  if (!mockUsers) {
    mockUsers = generateUsers();
  }
  return mockUsers;
}

/**
 * Generate analytics data with real-time simulation.
 */
function generateAnalyticsData(): AnalyticsData {
  const now = new Date();
  const chartData: RevenueDataPoint[] = [];
  
  // Generate 24 hours of data points
  for (let i = 23; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
    chartData.push({
      timestamp: timestamp.toISOString(),
      revenue: Math.floor(Math.random() * 10000) + 5000,
      orders: Math.floor(Math.random() * 100) + 20,
    });
  }
  
  const locations: UserLocation[] = [
    { country: 'United States', countryCode: 'US', users: 4521, percentage: 45.21 },
    { country: 'United Kingdom', countryCode: 'GB', users: 1823, percentage: 18.23 },
    { country: 'Germany', countryCode: 'DE', users: 1245, percentage: 12.45 },
    { country: 'Canada', countryCode: 'CA', users: 892, percentage: 8.92 },
    { country: 'Australia', countryCode: 'AU', users: 654, percentage: 6.54 },
    { country: 'France', countryCode: 'FR', users: 432, percentage: 4.32 },
    { country: 'Other', countryCode: 'XX', users: 433, percentage: 4.33 },
  ];
  
  return {
    revenue: {
      current: 127450,
      change: 12.5,
      chartData,
    },
    users: {
      total: 10000,
      active: 7823,
      new: 234,
      locations,
    },
    lastUpdated: now.toISOString(),
  };
}

// ============================================
// Handlers
// ============================================

export const nexusHandlers = [
  // ----------------------------------------
  // Organization Endpoints
  // ----------------------------------------

  /**
   * GET /api/orgs
   * Returns list of organizations for the authenticated user.
   */
  http.get('/api/orgs', async ({ request }) => {
    await delay(500);
    
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        { message: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }
    
    return HttpResponse.json({ data: mockOrganizations }, { status: 200 });
  }),

  /**
   * GET /api/orgs/:id
   * Returns a single organization by ID.
   */
  http.get('/api/orgs/:id', async ({ params, request }) => {
    await delay(300);
    
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        { message: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }
    
    const { id } = params;
    const org = mockOrganizations.find(o => o.id === id);
    
    if (!org) {
      return HttpResponse.json(
        { message: 'Organization not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }
    
    return HttpResponse.json(org, { status: 200 });
  }),

  // ----------------------------------------
  // User Endpoints (requires x-org-id header)
  // ----------------------------------------

  /**
   * GET /api/users
   * Returns paginated, filterable list of users.
   * Requires x-org-id header.
   */
  http.get('/api/users', async ({ request }) => {
    // Simulate high latency API (real-world constraint)
    await delay(800 + Math.random() * 400);
    
    const orgId = request.headers.get('x-org-id');
    if (!orgId) {
      return HttpResponse.json(
        { message: 'Organization ID required', code: 'ORG_REQUIRED' },
        { status: 400 }
      );
    }
    
    const url = new URL(request.url);
    
    // Parse query parameters
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);
    const search = url.searchParams.get('search') || '';
    const roles = url.searchParams.getAll('roles[]');
    const status = url.searchParams.get('status') as UserStatus | null;
    const joinedFrom = url.searchParams.get('joinedFrom');
    const joinedTo = url.searchParams.get('joinedTo');
    const sortBy = url.searchParams.get('sortBy') || 'name';
    const sortOrder = url.searchParams.get('sortOrder') || 'asc';
    
    let filteredUsers = [...getUsers()];
    
    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase();
      filteredUsers = filteredUsers.filter(user =>
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
    }
    
    // Filter by roles (multi-select)
    if (roles.length > 0) {
      filteredUsers = filteredUsers.filter(user =>
        roles.includes(user.role)
      );
    }
    
    // Filter by status
    if (status) {
      filteredUsers = filteredUsers.filter(user => user.status === status);
    }
    
    // Filter by joined date range
    if (joinedFrom) {
      const fromDate = new Date(joinedFrom);
      filteredUsers = filteredUsers.filter(user =>
        new Date(user.joinedAt) >= fromDate
      );
    }
    if (joinedTo) {
      const toDate = new Date(joinedTo);
      filteredUsers = filteredUsers.filter(user =>
        new Date(user.joinedAt) <= toDate
      );
    }
    
    // Sort
    filteredUsers.sort((a, b) => {
      const aVal = a[sortBy as keyof NexusUser];
      const bVal = b[sortBy as keyof NexusUser];
      
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;
      
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    
    // Calculate pagination
    const total = filteredUsers.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
    
    const response: PaginatedUsersResponse = {
      data: paginatedUsers,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
    
    return HttpResponse.json(response, { status: 200 });
  }),

  /**
   * PATCH /api/users/:id/status
   * Updates a user's status (inline edit).
   * Requires x-org-id header.
   */
  http.patch('/api/users/:id/status', async ({ params, request }) => {
    await delay(300 + Math.random() * 200);
    
    const orgId = request.headers.get('x-org-id');
    if (!orgId) {
      return HttpResponse.json(
        { message: 'Organization ID required', code: 'ORG_REQUIRED' },
        { status: 400 }
      );
    }
    
    const { id } = params;
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      return HttpResponse.json(
        { message: 'User not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }
    
    const body = (await request.json()) as { status: UserStatus };
    
    // Simulate occasional failure (10% chance)
    if (Math.random() < 0.1) {
      return HttpResponse.json(
        { message: 'Failed to update user status', code: 'UPDATE_FAILED' },
        { status: 500 }
      );
    }
    
    // Update the user
    users[userIndex] = { ...users[userIndex], status: body.status };
    
    return HttpResponse.json(users[userIndex], { status: 200 });
  }),

  /**
   * POST /api/users/bulk-delete
   * Deletes multiple users at once.
   * Requires x-org-id header.
   */
  http.post('/api/users/bulk-delete', async ({ request }) => {
    await delay(1000 + Math.random() * 500);
    
    const orgId = request.headers.get('x-org-id');
    if (!orgId) {
      return HttpResponse.json(
        { message: 'Organization ID required', code: 'ORG_REQUIRED' },
        { status: 400 }
      );
    }
    
    const body = (await request.json()) as { userIds: string[] };
    const { userIds } = body;
    
    if (!userIds || userIds.length === 0) {
      return HttpResponse.json(
        { message: 'No user IDs provided', code: 'INVALID_REQUEST' },
        { status: 400 }
      );
    }
    
    const users = getUsers();
    let deleted = 0;
    const failed: string[] = [];
    
    for (const userId of userIds) {
      const index = users.findIndex(u => u.id === userId);
      if (index !== -1) {
        // Simulate occasional individual failure (5% chance per user)
        if (Math.random() < 0.05) {
          failed.push(userId);
        } else {
          users.splice(index, 1);
          deleted++;
        }
      } else {
        failed.push(userId);
      }
    }
    
    const response: BulkDeleteResponse = {
      deleted,
      failed,
    };
    
    return HttpResponse.json(response, { status: 200 });
  }),

  // ----------------------------------------
  // Analytics Endpoints
  // ----------------------------------------

  /**
   * GET /api/analytics
   * Returns analytics dashboard data.
   * Requires x-org-id header.
   */
  http.get('/api/analytics', async ({ request }) => {
    // Simulate high latency API
    await delay(600 + Math.random() * 400);
    
    const orgId = request.headers.get('x-org-id');
    if (!orgId) {
      return HttpResponse.json(
        { message: 'Organization ID required', code: 'ORG_REQUIRED' },
        { status: 400 }
      );
    }
    
    const analyticsData = generateAnalyticsData();
    
    return HttpResponse.json(analyticsData, { status: 200 });
  }),

  /**
   * GET /api/analytics/revenue/realtime
   * Returns real-time revenue data (for polling every 5s).
   * Requires x-org-id header.
   */
  http.get('/api/analytics/revenue/realtime', async ({ request }) => {
    await delay(200);
    
    const orgId = request.headers.get('x-org-id');
    if (!orgId) {
      return HttpResponse.json(
        { message: 'Organization ID required', code: 'ORG_REQUIRED' },
        { status: 400 }
      );
    }
    
    // Generate a single new data point
    const dataPoint: RevenueDataPoint = {
      timestamp: new Date().toISOString(),
      revenue: Math.floor(Math.random() * 10000) + 5000,
      orders: Math.floor(Math.random() * 100) + 20,
    };
    
    return HttpResponse.json(dataPoint, { status: 200 });
  }),

  // ----------------------------------------
  // Settings Endpoints
  // ----------------------------------------

  /**
   * POST /api/onboarding
   * Submits onboarding wizard data.
   * Requires x-org-id header.
   */
  http.post('/api/onboarding', async ({ request }) => {
    await delay(1500);
    
    const orgId = request.headers.get('x-org-id');
    if (!orgId) {
      return HttpResponse.json(
        { message: 'Organization ID required', code: 'ORG_REQUIRED' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    // Validate the request (in reality, the backend would do this)
    if (!body || typeof body !== 'object') {
      return HttpResponse.json(
        { message: 'Invalid request body', code: 'INVALID_REQUEST' },
        { status: 400 }
      );
    }
    
    // Return success
    return HttpResponse.json(
      { 
        success: true, 
        message: 'Onboarding completed successfully',
        redirectUrl: '/dashboard',
      },
      { status: 200 }
    );
  }),
];
