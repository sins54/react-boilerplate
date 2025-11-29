import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

/**
 * MSW Service Worker instance for browser mocking.
 * This worker intercepts HTTP requests and returns mock responses.
 */
export const worker = setupWorker(...handlers);
