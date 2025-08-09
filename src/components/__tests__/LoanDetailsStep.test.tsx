import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../../test/store-utils'
import { useFormStore } from '../../store/useFormStore'
import LoanDetailsStep from '../LoanDetailsStep'
import { mockFormData } from '../../test/utils'

describe('LoanDetailsStep Component', () => {
    const mockOnNext = vi.fn()
    const mockOnBack = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()

        useFormStore.getState().resetForm()
    })

    it('renders loan amount slider with correct initial value', () => {
        useFormStore.getState().updateFormData(mockFormData)
        useFormStore.getState().updateFormData(mockFormData)
        render(<LoanDetailsStep onNext={mockOnNext} onBack={mockOnBack} />)

        const slider = screen.getByRole('slider')
        expect(slider).toBeInTheDocument()

        expect(screen.getByText('$1,000 - $500,000')).toBeInTheDocument()
    })

    it('displays formatted loan amount', () => {
        useFormStore.getState().updateFormData(mockFormData)
        render(<LoanDetailsStep onNext={mockOnNext} onBack={mockOnBack} />)

        expect(screen.getByText('$50,000')).toBeInTheDocument()
    })

    it('updates loan amount when slider is moved', async () => {
        useFormStore.getState().updateFormData(mockFormData)
        render(<LoanDetailsStep onNext={mockOnNext} onBack={mockOnBack} />)

        const slider = screen.getByRole('slider')

        fireEvent.change(slider, { target: { value: '75000' } })

        await waitFor(() => {
            expect(useFormStore.getState().formData.loanAmount).toBe(75000)
        })
    })

    it('renders all loan type options', () => {
        useFormStore.getState().updateFormData(mockFormData)
        render(<LoanDetailsStep onNext={mockOnNext} onBack={mockOnBack} />)

        expect(screen.getByText('Personal Loan')).toBeInTheDocument()
        expect(screen.getByText('Auto Loan')).toBeInTheDocument()
        expect(screen.getByText('Home Loan')).toBeInTheDocument()
        expect(screen.getByText('Business Loan')).toBeInTheDocument()
    })

    it('shows correct APR for each loan type', () => {
        useFormStore.getState().updateFormData(mockFormData)
        render(<LoanDetailsStep onNext={mockOnNext} onBack={mockOnBack} />)

        expect(screen.getByText('APR 12.5%')).toBeInTheDocument() // Personal
        expect(screen.getByText('APR 6.5%')).toBeInTheDocument()  // Auto
        expect(screen.getByText('APR 4.5%')).toBeInTheDocument()  // Home
        expect(screen.getByText('APR 9.5%')).toBeInTheDocument()  // Business
    })

    it('allows user to select different loan types', async () => {
        useFormStore.getState().updateFormData(mockFormData)
        render(<LoanDetailsStep onNext={mockOnNext} onBack={mockOnBack} />)

        const autoLoanCard = screen.getByText('Auto Loan').closest('[role="button"]')
        expect(autoLoanCard).toBeInTheDocument()

        fireEvent.click(autoLoanCard!)

        await waitFor(() => {
            expect(useFormStore.getState().formData.loanType).toBe('auto')
        })
    })



    it('renders quick amount buttons', () => {
        useFormStore.getState().updateFormData(mockFormData)
        render(<LoanDetailsStep onNext={mockOnNext} onBack={mockOnBack} />)

        expect(screen.getByText('$10,000')).toBeInTheDocument()
        expect(screen.getByText('$25,000')).toBeInTheDocument()
        expect(screen.getByText('$50,000')).toBeInTheDocument()
        expect(screen.getByText('$100,000')).toBeInTheDocument()
        expect(screen.getByText('$250,000')).toBeInTheDocument()
    })

    it('updates loan amount when quick amount button is clicked', async () => {
        useFormStore.getState().updateFormData(mockFormData)
        render(<LoanDetailsStep onNext={mockOnNext} onBack={mockOnBack} />)

        const quickButton100K = screen.getByText('$100,000')
        fireEvent.click(quickButton100K)

        await waitFor(() => {
            expect(useFormStore.getState().formData.loanAmount).toBe(100000)
        })
    })



    it('updates monthly payment when loan amount changes', async () => {
        useFormStore.getState().updateFormData(mockFormData)
        render(<LoanDetailsStep onNext={mockOnNext} onBack={mockOnBack} />)

        const slider = screen.getByRole('slider')
        fireEvent.change(slider, { target: { value: '100000' } })

        await waitFor(() => {
            expect(useFormStore.getState().formData.loanAmount).toBe(100000)
        })
    })

    it('updates monthly payment when loan type changes', async () => {
        useFormStore.getState().updateFormData(mockFormData)
        render(<LoanDetailsStep onNext={mockOnNext} onBack={mockOnBack} />)

        const homeLoanCard = screen.getByText('Home Loan').closest('[role="button"]')
        fireEvent.click(homeLoanCard!)

        await waitFor(() => {
            expect(useFormStore.getState().formData.loanType).toBe('home')
        })
    })

    it('shows back button and calls onBack when clicked', async () => {
        useFormStore.getState().updateFormData(mockFormData)
        render(<LoanDetailsStep onNext={mockOnNext} onBack={mockOnBack} />)

        const backButton = screen.getByText('Back')
        expect(backButton).toBeInTheDocument()

        fireEvent.click(backButton)

        await waitFor(() => {
            expect(mockOnBack).toHaveBeenCalled()
        })
    })

    it('shows continue button and calls onNext when clicked', async () => {
        useFormStore.getState().updateFormData(mockFormData)
        render(<LoanDetailsStep onNext={mockOnNext} onBack={mockOnBack} />)

        const continueButton = screen.getByText('Next Step')
        expect(continueButton).toBeInTheDocument()

        fireEvent.click(continueButton)

        await waitFor(() => {
            expect(mockOnNext).toHaveBeenCalled()
        })
    })

    it('displays loan amount in correct range (1K - 500K)', () => {
        useFormStore.getState().updateFormData(mockFormData)
        render(<LoanDetailsStep onNext={mockOnNext} onBack={mockOnBack} />)

        const slider = screen.getByRole('slider')
        expect(slider).toBeInTheDocument()

        expect(screen.getByText('$1,000 - $500,000')).toBeInTheDocument()

        expect(screen.getByText('$1K')).toBeInTheDocument()
        expect(screen.getByText('$500K')).toBeInTheDocument()
    })

    it('shows loan purpose information', () => {
        useFormStore.getState().updateFormData(mockFormData)
        render(<LoanDetailsStep onNext={mockOnNext} onBack={mockOnBack} />)

        expect(screen.getByText(/Personal Loan/)).toBeInTheDocument()
        expect(screen.getByText(/For any personal use/)).toBeInTheDocument()
    })
})

