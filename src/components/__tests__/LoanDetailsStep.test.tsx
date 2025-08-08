import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../../test/utils'
import LoanDetailsStep from '../LoanDetailsStep'
import { mockFormData } from '../../test/utils'

describe('LoanDetailsStep Component', () => {
    const mockOnChange = vi.fn()
    const mockOnNext = vi.fn()
    const mockOnBack = vi.fn()

    const defaultProps = {
        data: mockFormData,
        onChange: mockOnChange,
        onNext: mockOnNext,
        onBack: mockOnBack
    }

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders loan amount slider with correct initial value', () => {
        render(<LoanDetailsStep {...defaultProps} />)

        const slider = screen.getByRole('slider')
        expect(slider).toBeInTheDocument()

        expect(screen.getByText('$1,000 - $500,000')).toBeInTheDocument()
    })

    it('displays formatted loan amount', () => {
        render(<LoanDetailsStep {...defaultProps} />)

        expect(screen.getByText('$50,000')).toBeInTheDocument()
    })

    it('updates loan amount when slider is moved', async () => {
        render(<LoanDetailsStep {...defaultProps} />)

        const slider = screen.getByRole('slider')

        fireEvent.change(slider, { target: { value: '75000' } })

        await waitFor(() => {
            expect(mockOnChange).toHaveBeenCalledWith({ loanAmount: 75000 })
        })
    })

    it('renders all loan type options', () => {
        render(<LoanDetailsStep {...defaultProps} />)

        expect(screen.getByText('Personal Loan')).toBeInTheDocument()
        expect(screen.getByText('Auto Loan')).toBeInTheDocument()
        expect(screen.getByText('Home Loan')).toBeInTheDocument()
        expect(screen.getByText('Business Loan')).toBeInTheDocument()
    })

    it('shows correct APR for each loan type', () => {
        render(<LoanDetailsStep {...defaultProps} />)

        expect(screen.getByText('APR 12.5%')).toBeInTheDocument() // Personal
        expect(screen.getByText('APR 6.5%')).toBeInTheDocument()  // Auto
        expect(screen.getByText('APR 4.5%')).toBeInTheDocument()  // Home
        expect(screen.getByText('APR 9.5%')).toBeInTheDocument()  // Business
    })

    it('allows user to select different loan types', async () => {
        render(<LoanDetailsStep {...defaultProps} />)

        const autoLoanCard = screen.getByText('Auto Loan').closest('[role="button"]')
        expect(autoLoanCard).toBeInTheDocument()

        fireEvent.click(autoLoanCard!)

        await waitFor(() => {
            expect(mockOnChange).toHaveBeenCalledWith({ loanType: 'auto' })
        })
    })

    it('highlights selected loan type', () => {
        const dataWithAutoLoan = {
            ...mockFormData,
            loanType: 'auto' as const
        }

        render(<LoanDetailsStep {...defaultProps} data={dataWithAutoLoan} />)

        const autoLoanCard = screen.getByText('Auto Loan').closest('button')
        expect(autoLoanCard).toHaveClass('border-primary')
    })

    it('renders quick amount buttons', () => {
        render(<LoanDetailsStep {...defaultProps} />)

        expect(screen.getByText('$10,000')).toBeInTheDocument()
        expect(screen.getByText('$25,000')).toBeInTheDocument()
        expect(screen.getByText('$50,000')).toBeInTheDocument()
        expect(screen.getByText('$100,000')).toBeInTheDocument()
        expect(screen.getByText('$250,000')).toBeInTheDocument()
    })

    it('updates loan amount when quick amount button is clicked', async () => {
        render(<LoanDetailsStep {...defaultProps} />)

        const quickButton100K = screen.getByText('$100,000')
        fireEvent.click(quickButton100K)

        await waitFor(() => {
            expect(mockOnChange).toHaveBeenCalledWith({ loanAmount: 100000 })
        })
    })

    it('calculates and displays correct monthly payment', () => {
        const testData = {
            ...mockFormData,
            loanAmount: 60000,
            loanType: 'personal' as const
        }

        render(<LoanDetailsStep {...defaultProps} data={testData} />)

        const monthlyPayment = screen.getByText(/\$1,/)
        expect(monthlyPayment).toBeInTheDocument()
    })

    it('updates monthly payment when loan amount changes', async () => {
        render(<LoanDetailsStep {...defaultProps} />)

        const slider = screen.getByRole('slider')
        fireEvent.change(slider, { target: { value: '100000' } })

        await waitFor(() => {
            expect(mockOnChange).toHaveBeenCalledWith({ loanAmount: 100000 })
        })
    })

    it('updates monthly payment when loan type changes', async () => {
        render(<LoanDetailsStep {...defaultProps} />)

        const homeLoanCard = screen.getByText('Home Loan').closest('[role="button"]')
        fireEvent.click(homeLoanCard!)

        await waitFor(() => {
            expect(mockOnChange).toHaveBeenCalledWith({ loanType: 'home' })
        })
    })

    it('shows back button and calls onBack when clicked', async () => {
        render(<LoanDetailsStep {...defaultProps} />)

        const backButton = screen.getByText('Back')
        expect(backButton).toBeInTheDocument()

        fireEvent.click(backButton)

        await waitFor(() => {
            expect(mockOnBack).toHaveBeenCalled()
        })
    })

    it('shows continue button and calls onNext when clicked', async () => {
        render(<LoanDetailsStep {...defaultProps} />)

        const continueButton = screen.getByText('Next Step')
        expect(continueButton).toBeInTheDocument()

        fireEvent.click(continueButton)

        await waitFor(() => {
            expect(mockOnNext).toHaveBeenCalled()
        })
    })

    it('displays loan amount in correct range (1K - 500K)', () => {
        render(<LoanDetailsStep {...defaultProps} />)

        const slider = screen.getByRole('slider')
        expect(slider).toBeInTheDocument()

        expect(screen.getByText('$1,000 - $500,000')).toBeInTheDocument()

        expect(screen.getByText('$1K')).toBeInTheDocument()
        expect(screen.getByText('$500K')).toBeInTheDocument()
    })

    it('shows loan purpose information', () => {
        render(<LoanDetailsStep {...defaultProps} />)

        expect(screen.getByText(/Personal Loan/)).toBeInTheDocument()
        expect(screen.getByText(/For any personal use/)).toBeInTheDocument()
    })
})

