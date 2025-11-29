import { authHandlers } from './auth';
import { badgeHandlers } from './badges';

/**
 * All MSW request handlers.
 * Add new handler arrays here as you create more mock endpoints.
 */
export const handlers = [...authHandlers, ...badgeHandlers];
