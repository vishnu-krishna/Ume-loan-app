import { http, HttpResponse } from 'msw';
import { ApiResponse } from '../types/form.types';

const generateId = (prefix: string): string => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `${prefix}-${timestamp}-${random.toString().padStart(4, '0')}`;
};

const delay = (ms: number = Math.random() * 1000 + 500): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

const getForcedErrorType = (email: string) => {
    if (email === 'test@error.com') return { status: 500, message: 'Forced server error for testing' };
    if (email === 'demo@500.com') return { status: 500, message: 'Internal server error. Please try again.' };
    if (email === 'user@422.com') return { status: 422, message: 'Validation failed. Please check your information.' };
    if (email === 'user@503.com') return { status: 503, message: 'Service temporarily unavailable. Please try again later.' };
    return null;
};

export const handlers = [
    http.post('/api/leads', async ({ request }) => {
        await delay();

        const body = await request.json() as any;
        const email = body.email;

        const forcedError = getForcedErrorType(email);
        if (forcedError) {
            return HttpResponse.json(
                {
                    status: 'error',
                    message: forcedError.message,
                    code: `ERR_${forcedError.status}`
                },
                { status: forcedError.status }
            );
        }

        const response: ApiResponse = {
            status: 'success',
            leadId: generateId('LEAD'),
            salesforceId: `003${Math.random().toString(36).substr(2, 15).toUpperCase()}`,
            accountId: '',
            message: 'Lead submitted successfully'
        };

        return HttpResponse.json(response);
    }),

    http.post('/api/accounts', async ({ request }) => {
        await delay();

        const body = await request.json() as any;
        const email = body.email;

        const forcedError = getForcedErrorType(email);
        if (forcedError) {
            return HttpResponse.json(
                {
                    status: 'error',
                    message: `Account creation failed: ${forcedError.message}`,
                    code: `ERR_ACCOUNT_${forcedError.status}`
                },
                { status: forcedError.status }
            );
        }

        const response: ApiResponse = {
            status: 'success',
            leadId: body.leadId,
            salesforceId: `003${Math.random().toString(36).substr(2, 15).toUpperCase()}`,
            accountId: generateId('ACC'),
            message: 'Account created successfully'
        };

        return HttpResponse.json(response);
    }),

    http.get('/api/check-email/:email', async ({ params }) => {
        await delay(200);

        const { email } = params;

        const existingEmails = [
            'john.smith@gmail.com',
            'sarah.johnson@yahoo.com',
            'mike.wilson@outlook.com'
        ];

        const exists = existingEmails.includes(email as string);

        return HttpResponse.json({ exists });
    }),

    http.get('/api/health', async () => {
        await delay(100);

        return HttpResponse.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            version: '1.0.0'
        });
    })
];
