import { http, HttpResponse, delay } from 'msw';
import { faker } from '@faker-js/faker';

/**
 * Badge status options.
 */
type BadgeStatus = 'active' | 'inactive' | 'pending';

/**
 * Badge entity structure.
 */
interface Badge {
  id: string;
  name: string;
  status: BadgeStatus;
  createdAt: string;
}

/**
 * Paginated response structure.
 */
interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Generate a seeded array of 100 fake badges.
 * Using a seed ensures consistent data across requests.
 */
function generateBadges(): Badge[] {
  // Use a consistent seed for reproducible data
  faker.seed(42);

  const statuses: BadgeStatus[] = ['active', 'inactive', 'pending'];

  return Array.from({ length: 100 }, (_, index) => ({
    id: faker.string.uuid(),
    name: `${faker.word.adjective()} ${faker.word.noun()} Badge`,
    status: statuses[index % 3],
    createdAt: faker.date.past({ years: 2 }).toISOString(),
  }));
}

// Generate badges once and reuse
const allBadges = generateBadges();

/**
 * Badge handlers for MSW.
 */
export const badgeHandlers = [
  /**
   * GET /api/badges
   * Returns paginated, filterable list of badges.
   */
  http.get('/api/badges', async ({ request }) => {
    // Artificial delay to test loading skeletons
    await delay(800);

    const url = new URL(request.url);

    // Parse query parameters
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);
    const search = url.searchParams.get('search') || '';
    const status = url.searchParams.get('status') as BadgeStatus | null;

    // Start with all badges
    let filteredBadges = [...allBadges];

    // Filter by search term (case-insensitive name search)
    if (search) {
      const searchLower = search.toLowerCase();
      filteredBadges = filteredBadges.filter((badge) =>
        badge.name.toLowerCase().includes(searchLower)
      );
    }

    // Filter by status
    if (status && ['active', 'inactive', 'pending'].includes(status)) {
      filteredBadges = filteredBadges.filter(
        (badge) => badge.status === status
      );
    }

    // Calculate pagination
    const total = filteredBadges.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    // Slice for current page
    const paginatedBadges = filteredBadges.slice(startIndex, endIndex);

    const response: PaginatedResponse<Badge> = {
      data: paginatedBadges,
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
   * GET /api/badges/:id
   * Returns a single badge by ID.
   */
  http.get('/api/badges/:id', async ({ params }) => {
    await delay(300);

    const { id } = params;
    const badge = allBadges.find((b) => b.id === id);

    if (!badge) {
      return HttpResponse.json(
        { message: 'Badge not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    return HttpResponse.json(badge, { status: 200 });
  }),

  /**
   * POST /api/badges
   * Creates a new badge.
   */
  http.post('/api/badges', async ({ request }) => {
    await delay(500);

    const body = (await request.json()) as { name: string; status?: BadgeStatus };

    const newBadge: Badge = {
      id: faker.string.uuid(),
      name: body.name,
      status: body.status || 'pending',
      createdAt: new Date().toISOString(),
    };

    // Persist the new badge
    allBadges.push(newBadge);

    return HttpResponse.json(newBadge, { status: 201 });
  }),

  /**
   * PUT /api/badges/:id
   * Updates an existing badge.
   */
  http.put('/api/badges/:id', async ({ params, request }) => {
    await delay(500);

    const { id } = params;
    const badge = allBadges.find((b) => b.id === id);

    if (!badge) {
      return HttpResponse.json(
        { message: 'Badge not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = (await request.json()) as Partial<Badge>;
    const updatedBadge: Badge = { ...badge, ...body, id: badge.id };

    // Persist the update
    const index = allBadges.findIndex((b) => b.id === id);
    allBadges[index] = updatedBadge;

    return HttpResponse.json(updatedBadge, { status: 200 });
  }),

  /**
   * DELETE /api/badges/:id
   * Deletes a badge.
   */
  http.delete('/api/badges/:id', async ({ params }) => {
    await delay(500);

    const { id } = params;
    const badgeIndex = allBadges.findIndex((b) => b.id === id);

    if (badgeIndex === -1) {
      return HttpResponse.json(
        { message: 'Badge not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Remove the badge from the array
    allBadges.splice(badgeIndex, 1);

    return HttpResponse.json(null, { status: 204 });
  }),
];
