import { render, RenderOptions } from '@testing-library/react'
import { HeroUIProvider } from '@heroui/system'
import { ReactElement } from 'react'

const customRender = (
    ui: ReactElement,
    options?: Omit<RenderOptions, 'wrapper'>
) => {
    const Wrapper = ({ children }: { children: React.ReactNode }) => {
        return (
            <HeroUIProvider>
                {children}
            </HeroUIProvider>
        )
    }

    return render(ui, { wrapper: Wrapper, ...options })
}

export const mockFormData = {
    personality: 'planner' as const,
    loanPurpose: 'immediate' as const,
    loanAmount: 50000,
    loanType: 'personal' as const,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '0412345678'
}

export const mockApiResponses = {
    success: {
        leadId: 'LEAD-123',
        salesforceId: 'SF-456',
        accountId: 'ACC-789',
        status: 'success' as const,
        message: 'Success'
    },
    error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid email format',
        details: { field: 'email' }
    }
}

export * from '@testing-library/react'
export { customRender as render }

