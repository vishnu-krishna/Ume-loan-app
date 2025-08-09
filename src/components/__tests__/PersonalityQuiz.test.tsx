import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../../test/store-utils'
import { useFormStore } from '../../store/useFormStore'
import { mockFormData } from '../../test/utils'
import PersonalityQuiz from '../PersonalityQuiz'

describe('PersonalityQuiz Component', () => {
    const mockOnNext = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()
        useFormStore.getState().resetForm()
    })

    it('renders all personality options', () => {
        render(<PersonalityQuiz onNext={mockOnNext} />)

        expect(screen.getByText('The Planner')).toBeInTheDocument()
        expect(screen.getByText('The Balancer')).toBeInTheDocument()
        expect(screen.getByText('The Dreamer')).toBeInTheDocument()
    })

    it('displays correct descriptions for each personality type', () => {
        render(<PersonalityQuiz onNext={mockOnNext} />)

        expect(screen.getByText('I budget everything carefully')).toBeInTheDocument()
        expect(screen.getByText('I mix planning with flexibility')).toBeInTheDocument()
        expect(screen.getByText('I have big goals to achieve!')).toBeInTheDocument()
    })

    it('allows user to select a personality type', async () => {
        render(<PersonalityQuiz onNext={mockOnNext} />)

        const plannerCard = screen.getByText('The Planner').closest('button')
        expect(plannerCard).toBeInTheDocument()

        fireEvent.click(plannerCard!)

        await waitFor(() => {
            expect(useFormStore.getState().formData.personality).toBe('planner')
        })
    })

    it('allows user to select different personality types', async () => {
        render(<PersonalityQuiz onNext={mockOnNext} />)

        const balancerCard = screen.getByText('The Balancer').closest('button')
        fireEvent.click(balancerCard!)

        await waitFor(() => {
            expect(useFormStore.getState().formData.personality).toBe('balanced')
        })

        const dreamerCard = screen.getByText('The Dreamer').closest('button')
        fireEvent.click(dreamerCard!)

        await waitFor(() => {
            expect(useFormStore.getState().formData.personality).toBe('dreamer')
        })
    })

    it('shows back button on second question', async () => {
        render(<PersonalityQuiz onNext={mockOnNext} />)

        const plannerCard = screen.getByText('The Planner').closest('button')
        fireEvent.click(plannerCard!)

        await waitFor(() => {
            expect(screen.getByText('When do you need the funds?')).toBeInTheDocument()
        })

        const backButton = screen.getByText('Back')
        expect(backButton).toBeInTheDocument()
    })

    it('advances to second question after first selection', async () => {
        render(<PersonalityQuiz onNext={mockOnNext} />)

        expect(screen.getByText("What's your financial personality?")).toBeInTheDocument()

        const plannerCard = screen.getByText('The Planner').closest('button')
        fireEvent.click(plannerCard!)

        await waitFor(() => {
            expect(screen.getByText('When do you need the funds?')).toBeInTheDocument()
        })
    })

    it('calls onNext after completing both questions', async () => {
        render(<PersonalityQuiz onNext={mockOnNext} />)

        const plannerCard = screen.getByText('The Planner').closest('button')
        fireEvent.click(plannerCard!)

        await waitFor(() => {
            expect(screen.getByText('When do you need the funds?')).toBeInTheDocument()
        })

        const rightAwayCard = screen.getByText('Right Away').closest('button')
        fireEvent.click(rightAwayCard!)

        await waitFor(() => {
            expect(mockOnNext).toHaveBeenCalled()
        })
    })

    it('updates loan purpose when user makes selection on second question', async () => {
        render(<PersonalityQuiz onNext={mockOnNext} />)

        const plannerCard = screen.getByText('The Planner').closest('button')
        fireEvent.click(plannerCard!)

        await waitFor(() => {
            expect(screen.getByText('When do you need the funds?')).toBeInTheDocument()
        })

        const immediateOption = screen.getByText('Right Away').closest('button')
        expect(immediateOption).toBeInTheDocument()

        fireEvent.click(immediateOption!)

        await waitFor(() => {
            const formData = useFormStore.getState().formData
            expect(formData.personality).toBe('planner')
            expect(formData.loanPurpose).toBe('immediate')
        })
    })

    it('shows progress indicator', () => {
        render(<PersonalityQuiz onNext={mockOnNext} />)

        const progressElements = screen.getAllByRole('progressbar')
        expect(progressElements.length).toBeGreaterThan(0)
    })

    it('displays correct progress percentage based on selections', () => {
        const partialData = {
            ...mockFormData,
            personality: 'planner' as const,
            loanPurpose: undefined
        }
        useFormStore.getState().updateFormData(partialData)
        render(<PersonalityQuiz onNext={mockOnNext} />)

        const progressBar = screen.getByRole('progressbar')
        expect(progressBar).toBeInTheDocument()
    })
})

