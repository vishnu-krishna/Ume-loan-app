import { http, HttpResponse } from 'msw';
import { ApiResponse } from '../types/form.types';

// Helper to generate realistic IDs
const generateId = (prefix: string): string => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `${prefix}-${timestamp}-${random.toString().padStart(4, '0')}`;
};

// Helper to simulate network delay
const delay = (ms: number = Math.random() * 1000 + 500): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

// Helper to simulate occasional failures (10% failure rate)
const shouldSimulateError = (): boolean => {
    return Math.random() < 0.1; // 10% chance of error
};

// Helper to get forced error type based on email
const getForcedErrorType = (email: string) => {
    if (email === 'test@error.com') return { status: 500, message: 'Forced server error for testing' };
    if (email === 'demo@500.com') return { status: 500, message: 'Internal server error. Please try again.' };
    if (email === 'user@422.com') return { status: 422, message: 'Validation failed. Please check your information.' };
    if (email === 'user@503.com') return { status: 503, message: 'Service temporarily unavailable. Please try again later.' };
    return null;
};

export const handlers = [
    // Submit Lead to Salesforce
    http.post('/api/leads', async ({ request }) => {
        await delay(); // Realistic network delay

        const body = await request.json() as any;
        const email = body.email;

        // Check for forced error based on email
        const forcedError = getForcedErrorType(email);
        if (forcedError) {
            console.log(`🚨 Mock API: Forcing error for email ${email}:`, forcedError.message);
            return HttpResponse.json(
                {
                    status: 'error',
                    message: forcedError.message,
                    code: `ERR_${forcedError.status}`
                },
                { status: forcedError.status }
            );
        }

        // Simulate occasional random errors for demo
        if (shouldSimulateError()) {
            const errorTypes = [
                { status: 500, message: 'Internal server error. Please try again.' },
                { status: 422, message: 'Validation failed. Please check your information.' },
                { status: 503, message: 'Service temporarily unavailable. Please try again later.' }
            ];

            const error = errorTypes[Math.floor(Math.random() * errorTypes.length)];
            console.log('🚨 Mock API: Random error triggered:', error.message);

            return HttpResponse.json(
                {
                    status: 'error',
                    message: error.message,
                    code: `ERR_${error.status}`
                },
                { status: error.status }
            );
        }

        // Generate realistic Salesforce-like response
        const response: ApiResponse = {
            status: 'success',
            leadId: generateId('LEAD'),
            salesforceId: `003${Math.random().toString(36).substr(2, 15).toUpperCase()}`,
            accountId: '', // Will be set after account creation
            message: 'Lead submitted successfully'
        };

        return HttpResponse.json(response);
    }),

    // Create Account
    http.post('/api/accounts', async ({ request }) => {
        await delay(); // Realistic network delay

        const body = await request.json() as any;
        const email = body.email;

        // Check for forced error based on email
        const forcedError = getForcedErrorType(email);
        if (forcedError) {
            console.log(`🚨 Mock API: Forcing account error for email ${email}:`, forcedError.message);
            return HttpResponse.json(
                {
                    status: 'error',
                    message: `Account creation failed: ${forcedError.message}`,
                    code: `ERR_ACCOUNT_${forcedError.status}`
                },
                { status: forcedError.status }
            );
        }

        // Simulate occasional random errors
        if (shouldSimulateError()) {
            console.log('🚨 Mock API: Random account creation error triggered');
            return HttpResponse.json(
                {
                    status: 'error',
                    message: 'Failed to create account. Please contact support.',
                    code: 'ERR_ACCOUNT_CREATION'
                },
                { status: 500 }
            );
        }

        // Generate realistic account response
        const response: ApiResponse = {
            status: 'success',
            leadId: body.leadId,
            salesforceId: `003${Math.random().toString(36).substr(2, 15).toUpperCase()}`,
            accountId: generateId('ACC'),
            message: 'Account created successfully'
        };

        return HttpResponse.json(response);
    }),

    // Check Email Exists (for future use)
    http.get('/api/check-email/:email', async ({ params }) => {
        await delay(200); // Quick check

        const { email } = params;

        // Mock some existing emails for demo
        const existingEmails = [
            'test@example.com',
            'demo@test.com',
            'existing@email.com'
        ];

        const exists = existingEmails.includes(email as string);

        return HttpResponse.json({ exists });
    }),

    // Health check endpoint
    http.get('/api/health', async () => {
        await delay(100);

        return HttpResponse.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            version: '1.0.0'
        });
    })
];
