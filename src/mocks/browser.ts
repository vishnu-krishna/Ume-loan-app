import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Setup service worker with our handlers
export const worker = setupWorker(...handlers);

// Start the worker in development mode or when DEMO mode is enabled
export const startMockWorker = async (): Promise<void> => {
    // Enable MSW in development OR when VITE_DEMO_MODE is true (for interview demos)
    const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';
    const shouldStartMSW = import.meta.env.DEV || isDemoMode;

    if (shouldStartMSW) {
        try {
            await worker.start({
                onUnhandledRequest: 'bypass',
                serviceWorker: {
                    url: '/mockServiceWorker.js'
                }
            });

            if (import.meta.env.DEV) {
                console.log('🔧 MSW Mock API started (development)');
            } else if (isDemoMode) {
                console.log('🎭 MSW Mock API started (DEMO MODE for interviews)');
            }
        } catch (error) {
            console.error('Failed to start MSW:', error);
        }
    } else {
        console.log('🚀 Production mode - MSW disabled');
    }
};
