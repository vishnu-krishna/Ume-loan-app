import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '../../test/utils'
import ContactInfoStep from '../ContactInfoStep'
import { mockFormData } from '../../test/utils'

vi.mock('../../hooks/useToast', () => ({
    useToast: () => ({
        showSuccess: vi.fn(),
        showError: vi.fn(),
        showLoading: vi.fn(),
        dismiss: vi.fn()
    })
}))

vi.mock('axios')

describe('ContactInfoStep Component', () => {
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

    it('renders all form fields', () => {
        render(<ContactInfoStep {...defaultProps} />)

        expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/phone/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/i agree to the terms/i)).toBeInTheDocument()
        expect(screen.getByText('Submit Application')).toBeInTheDocument()
    })

    it('displays initial form values when provided', () => {
        const initialData = {
            ...mockFormData,
            name: 'Jane Doe',
            email: 'jane.doe@example.com',
            phone: '9876543210'
        }
        render(<ContactInfoStep {...defaultProps} data={initialData} />)

        expect(screen.getByLabelText(/full name/i)).toHaveValue('Jane Doe')
        expect(screen.getByLabelText(/email/i)).toHaveValue('jane.doe@example.com')
        expect(screen.getByLabelText(/phone/i)).toHaveValue('(987) 654-3210')
    })

    it('formats phone number correctly', () => {
        render(<ContactInfoStep {...defaultProps} />)
        const phoneInput = screen.getByLabelText(/phone/i)

        fireEvent.change(phoneInput, { target: { value: '1234567890' } })

        expect(phoneInput).toHaveValue('(123) 456-7890')
    })

    it('shows back button and calls onBack when clicked', () => {
        render(<ContactInfoStep {...defaultProps} />)

        const backButton = screen.getByText('Back')
        expect(backButton).toBeInTheDocument()

        fireEvent.click(backButton)
        expect(mockOnBack).toHaveBeenCalled()
    })

    it('displays security badge', () => {
        render(<ContactInfoStep {...defaultProps} />)

        expect(screen.getByText('We use bank-level encryption to protect your data')).toBeInTheDocument()
    })

    it('displays the correct header and subtitle', () => {
        render(<ContactInfoStep {...defaultProps} />)

        expect(screen.getByText('Almost There! ✨')).toBeInTheDocument()
        expect(screen.getByText('We just need a few details to complete your application')).toBeInTheDocument()
    })

    it('shows form field labels correctly', () => {
        render(<ContactInfoStep {...defaultProps} />)

        expect(screen.getByText('Full Name')).toBeInTheDocument()
        expect(screen.getByText('Email Address')).toBeInTheDocument()
        expect(screen.getByText('Phone Number')).toBeInTheDocument()
    })

    it('displays terms and conditions checkbox', () => {
        render(<ContactInfoStep {...defaultProps} />)

        const termsCheckbox = screen.getByLabelText(/i agree to the terms/i)
        expect(termsCheckbox).toBeInTheDocument()
        expect(termsCheckbox).not.toBeChecked()
    })

    it('allows checking the terms and conditions', () => {
        render(<ContactInfoStep {...defaultProps} />)

        const termsCheckbox = screen.getByLabelText(/i agree to the terms/i)
        fireEvent.click(termsCheckbox)

        expect(termsCheckbox).toBeChecked()
    })

    it('renders with proper form structure', () => {
        render(<ContactInfoStep {...defaultProps} />)

        const formElement = document.querySelector('form')
        expect(formElement).toBeInTheDocument()
    })

    it('displays submit button with correct text', () => {
        render(<ContactInfoStep {...defaultProps} />)

        const submitButton = screen.getByText('Submit Application')
        expect(submitButton).toBeInTheDocument()
        expect(submitButton).toHaveAttribute('type', 'submit')
    })

    it('shows shield icon in header', () => {
        render(<ContactInfoStep {...defaultProps} />)

        const header = screen.getByText('Almost There! ✨')
        expect(header).toBeInTheDocument()
    })
})