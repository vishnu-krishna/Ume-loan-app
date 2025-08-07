import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Setup service worker with our handlers
export const worker = setupWorker(...handlers);

// Start the worker in development mode
export const startMockWorker = async (): Promise<void> => {
    if (import.meta.env.DEV) {
        try {
            await worker.start({
                onUnhandledRequest: 'warn',
                serviceWorker: {
                    url: '/mockServiceWorker.js'
                }
            });
            console.log('🔧 MSW Mock API started');
        } catch (error) {
            console.error('Failed to start MSW:', error);
        }
    }
};
