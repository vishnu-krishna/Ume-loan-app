import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

export const startMockWorker = async (): Promise<void> => {
    if (import.meta.env.DEV || import.meta.env.PROD) {
        try {
            await worker.start({
                onUnhandledRequest: 'bypass',
                serviceWorker: {
                    url: '/mockServiceWorker.js'
                }
            });
        } catch (error) {
            // no-op
        }
    }
};
