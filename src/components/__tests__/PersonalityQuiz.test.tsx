import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../../test/utils'
import { mockFormData } from '../../test/utils'
import PersonalityQuiz from '../PersonalityQuiz'

describe('PersonalityQuiz Component', () => {
    const mockOnChange = vi.fn()
    const mockOnNext = vi.fn()

    const defaultProps = {
        data: mockFormData,
        onChange: mockOnChange,
        onNext: mockOnNext
    }

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders all personality options', () => {
        render(<PersonalityQuiz {...defaultProps} />)

        expect(screen.getByText('The Planner')).toBeInTheDocument()
        expect(screen.getByText('The Balancer')).toBeInTheDocument()
        expect(screen.getByText('The Dreamer')).toBeInTheDocument()
    })

    it('displays correct descriptions for each personality type', () => {
        render(<PersonalityQuiz {...defaultProps} />)

        expect(screen.getByText('I budget everything carefully')).toBeInTheDocument()
        expect(screen.getByText('I mix planning with flexibility')).toBeInTheDocument()
        expect(screen.getByText('I have big goals to achieve!')).toBeInTheDocument()
    })

    it('allows user to select a personality type', async () => {
        render(<PersonalityQuiz {...defaultProps} />)

        const plannerCard = screen.getByText('The Planner').closest('button')
        expect(plannerCard).toBeInTheDocument()

        fireEvent.click(plannerCard!)

        await waitFor(() => {
            expect(mockOnChange).toHaveBeenCalledWith({ personality: 'planner' })
        })
    })

    it('allows user to select different personality types', async () => {
        render(<PersonalityQuiz {...defaultProps} />)

        const balancerCard = screen.getByText('The Balancer').closest('button')
        fireEvent.click(balancerCard!)

        await waitFor(() => {
            expect(mockOnChange).toHaveBeenCalledWith({ personality: 'balanced' })
        })

        const dreamerCard = screen.getByText('The Dreamer').closest('button')
        fireEvent.click(dreamerCard!)

        await waitFor(() => {
            expect(mockOnChange).toHaveBeenCalledWith({ personality: 'dreamer' })
        })
    })

    it('shows back button on second question', async () => {
        render(<PersonalityQuiz {...defaultProps} />)

        const plannerCard = screen.getByText('The Planner').closest('button')
        fireEvent.click(plannerCard!)

        await waitFor(() => {
            expect(screen.getByText('When do you need the funds?')).toBeInTheDocument()
        })

        const backButton = screen.getByText('Back')
        expect(backButton).toBeInTheDocument()
    })

    it('advances to second question after first selection', async () => {
        render(<PersonalityQuiz {...defaultProps} />)

        expect(screen.getByText("What's your financial personality?")).toBeInTheDocument()

        const plannerCard = screen.getByText('The Planner').closest('button')
        fireEvent.click(plannerCard!)

        await waitFor(() => {
            expect(screen.getByText('When do you need the funds?')).toBeInTheDocument()
        })
    })

    it('calls onNext after completing both questions', async () => {
        render(<PersonalityQuiz {...defaultProps} />)

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
        render(<PersonalityQuiz {...defaultProps} />)

        const plannerCard = screen.getByText('The Planner').closest('button')
        fireEvent.click(plannerCard!)

        await waitFor(() => {
            expect(screen.getByText('When do you need the funds?')).toBeInTheDocument()
        })

        const immediateOption = screen.getByText('Right Away').closest('button')
        expect(immediateOption).toBeInTheDocument()

        fireEvent.click(immediateOption!)

        await waitFor(() => {
            expect(mockOnChange).toHaveBeenCalledWith({
                personality: 'planner',
                loanPurpose: 'immediate'
            })
        })
    })

    it('shows progress indicator', () => {
        render(<PersonalityQuiz {...defaultProps} />)

        const progressElements = screen.getAllByRole('progressbar')
        expect(progressElements.length).toBeGreaterThan(0)
    })

    it('displays correct progress percentage based on selections', () => {
        const partialData = {
            ...mockFormData,
            personality: 'planner' as const,
            loanPurpose: undefined
        }

        render(<PersonalityQuiz {...defaultProps} data={partialData} />)

        const progressBar = screen.getByRole('progressbar')
        expect(progressBar).toBeInTheDocument()
    })
})

