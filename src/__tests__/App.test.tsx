import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { HeroUIProvider } from '@heroui/system'
import { Toaster } from 'sonner'
import App from '../App'

const renderApp = () => {
    return render(
        <HeroUIProvider>
            <App />
            <Toaster />
        </HeroUIProvider>
    )
}

vi.mock('../hooks/useFormPersistence', () => ({
    useFormPersistence: () => ({
        saveProgress: vi.fn(),
        getProgress: vi.fn(() => null),
        clearProgress: vi.fn()
    })
}))

vi.mock('../mocks/browser', () => ({
    startMockWorker: vi.fn().mockResolvedValue(undefined)
}))

vi.mock('canvas-confetti', () => ({
    default: vi.fn()
}))

describe('App Component', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders the main application header', () => {
        renderApp()

        expect(screen.getByText('Ume Loans')).toBeInTheDocument()
        expect(screen.getByText('Fast, Simple, Secure Loan Applications')).toBeInTheDocument()
    })

    it('starts with PersonalityQuiz step', () => {
        renderApp()

        expect(screen.getByText("What's your financial personality?")).toBeInTheDocument()
    })

    it('can navigate to the next step', async () => {
        renderApp()

        const plannerOption = screen.getByText('The Planner')
        fireEvent.click(plannerOption)

        await waitFor(() => {
            expect(screen.getByText('When do you need the funds?')).toBeInTheDocument()
        })
    })

    it('handles form data updates through personality quiz', async () => {
        renderApp()

        const plannerOption = screen.getByText('The Planner')
        fireEvent.click(plannerOption)

        await waitFor(() => {
            expect(screen.getByText('When do you need the funds?')).toBeInTheDocument()
        })

        const immediateOption = screen.getByText('Right Away')
        fireEvent.click(immediateOption)

        await waitFor(() => {
            expect(screen.getByText('Customize Your Loan')).toBeInTheDocument()
        })
    })

    it('shows progress step indicator on later steps', async () => {
        renderApp()

        const plannerOption = screen.getByText('The Planner')
        fireEvent.click(plannerOption)

        await waitFor(() => {
            const immediateOption = screen.getByText('Right Away')
            fireEvent.click(immediateOption)
        })

        await waitFor(() => {
            expect(screen.getByText('Step 1 of 3')).toBeInTheDocument()
        })
    })

    it('shows progress bar during quiz', () => {
        renderApp()

        const progressBar = screen.getByRole('progressbar')
        expect(progressBar).toBeInTheDocument()
        expect(progressBar).toHaveAttribute('aria-label', 'Quiz progress')
    })

    it('displays question counter during quiz', () => {
        renderApp()

        expect(screen.getByText('Question 1 of 2')).toBeInTheDocument()
    })
})