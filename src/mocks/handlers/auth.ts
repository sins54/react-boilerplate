import { http, HttpResponse, delay } from 'msw';
import { faker } from '@faker-js/faker';
import type { User, Permission, AuthResponse } from '@/types/auth';

/**
 * All available permissions in the system.
 */
const FULL_PERMISSIONS: Permission[] = [
  { screen: 'BADGE', privilege: 'VIEW' },
  { screen: 'BADGE', privilege: 'CREATE' },
  { screen: 'BADGE', privilege: 'EDIT' },
  { screen: 'BADGE', privilege: 'DELETE' },
  { screen: 'PROJECT', privilege: 'VIEW' },
  { screen: 'PROJECT', privilege: 'CREATE' },
  { screen: 'PROJECT', privilege: 'EDIT' },
  { screen: 'PROJECT', privilege: 'DELETE' },
  { screen: 'USERS', privilege: 'VIEW' },
  { screen: 'USERS', privilege: 'CREATE' },
  { screen: 'USERS', privilege: 'EDIT' },
  { screen: 'USERS', privilege: 'DELETE' },
  { screen: 'DASHBOARD', privilege: 'VIEW' },
  { screen: 'SETTINGS', privilege: 'VIEW' },
  { screen: 'SETTINGS', privilege: 'CONFIGURE' },
  { screen: 'REPORTS', privilege: 'VIEW' },
  { screen: 'DEMO', privilege: 'VIEW' },
  { screen: 'DEMO', privilege: 'CREATE' },
];

/**
 * Limited permissions for regular users.
 */
const LIMITED_PERMISSIONS: Permission[] = [
  { screen: 'BADGE', privilege: 'VIEW' },
  { screen: 'DASHBOARD', privilege: 'VIEW' },
];

/**
 * Generate a fake JWT token.
 */
function generateFakeToken(): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      sub: faker.string.uuid(),
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
    })
  );
  const signature = faker.string.alphanumeric(43);
  return `${header}.${payload}.${signature}`;
}

/**
 * Create a mock user based on email.
 */
function createMockUser(email: string, isAdmin: boolean): User {
  return {
    id: faker.string.uuid(),
    email,
    name: isAdmin ? 'Admin User' : 'Regular User',
    avatar: faker.image.avatar(),
    permissions: isAdmin ? FULL_PERMISSIONS : LIMITED_PERMISSIONS,
  };
}

/**
 * Stored mock users for session persistence.
 */
const mockUsers: Record<string, User> = {};

/**
 * Authentication handlers for MSW.
 */
export const authHandlers = [
  /**
   * POST /api/auth/login
   * Authenticates user based on email.
   */
  http.post('/api/auth/login', async ({ request }) => {
    await delay(500);

    const body = (await request.json()) as { email: string; password: string };
    const { email } = body;

    // Admin user - full permissions
    if (email === 'admin@example.com') {
      const user = createMockUser(email, true);
      const token = generateFakeToken();
      mockUsers[token] = user;

      const response: AuthResponse = {
        user,
        token,
        refreshToken: generateFakeToken(),
      };

      return HttpResponse.json(response, { status: 200 });
    }

    // Regular user - limited permissions
    if (email === 'user@example.com') {
      const user = createMockUser(email, false);
      const token = generateFakeToken();
      mockUsers[token] = user;

      const response: AuthResponse = {
        user,
        token,
        refreshToken: generateFakeToken(),
      };

      return HttpResponse.json(response, { status: 200 });
    }

    // Invalid credentials
    return HttpResponse.json(
      { message: 'Invalid email or password', code: 'INVALID_CREDENTIALS' },
      { status: 401 }
    );
  }),

  /**
   * GET /api/auth/me
   * Returns the current user profile based on Authorization header.
   */
  http.get('/api/auth/me', async ({ request }) => {
    await delay(300);

    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        { message: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const user = mockUsers[token];

    if (!user) {
      // If token is not in our mock store, create a default admin user
      // This handles cases where the token was set before the mock was started
      const defaultUser = createMockUser('admin@example.com', true);
      return HttpResponse.json(defaultUser, { status: 200 });
    }

    return HttpResponse.json(user, { status: 200 });
  }),
];
