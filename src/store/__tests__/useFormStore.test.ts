import { describe, it, expect, beforeEach } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useFormStore } from '../useFormStore'
import { LoanFormData } from '@/types/form.types.ts';

describe('useFormStore', () => {
    beforeEach(() => {
        act(() => {
            useFormStore.getState().resetForm()
        })
    })

    describe('form data management', () => {
        it('updates form data correctly', () => {
            const { result } = renderHook(() => useFormStore())

            act(() => {
                result.current.updateFormData({ name: 'John Doe' })
            })

            expect(result.current.formData.name).toBe('John Doe')
            expect(result.current.lastSaved).toBeInstanceOf(Date)
        })

        it('resets form to initial state', () => {
            const { result } = renderHook(() => useFormStore())

            act(() => {
                result.current.updateFormData({ name: 'John Doe', loanAmount: 100000 })
                result.current.setStep(2)
                result.current.resetForm()
            })

            expect(result.current.formData.name).toBe('')
            expect(result.current.formData.loanAmount).toBe(50000)
            expect(result.current.currentStep).toBe(0)
            expect(result.current.isCompleted).toBe(false)
        })
    })

    describe('navigation', () => {
        it('navigates steps correctly', () => {
            const { result } = renderHook(() => useFormStore())

            act(() => {
                result.current.nextStep()
            })
            expect(result.current.currentStep).toBe(1)

            act(() => {
                result.current.nextStep()
            })
            expect(result.current.currentStep).toBe(2)

            act(() => {
                result.current.previousStep()
            })
            expect(result.current.currentStep).toBe(1)
        })

        it('does not go below step 0', () => {
            const { result } = renderHook(() => useFormStore())

            act(() => {
                result.current.previousStep()
            })

            expect(result.current.currentStep).toBe(0)
        })

        it('does not go above step 3', () => {
            const { result } = renderHook(() => useFormStore())

            act(() => {
                result.current.setStep(3)
                result.current.nextStep()
            })

            expect(result.current.currentStep).toBe(3)
        })

        it('sets step directly', () => {
            const { result } = renderHook(() => useFormStore())

            act(() => {
                result.current.setStep(2)
            })

            expect(result.current.currentStep).toBe(2)
        })
    })

    describe('form completion', () => {
        it('handles form completion', () => {
            const { result } = renderHook(() => useFormStore())

            act(() => {
                result.current.completeForm()
            })

            expect(result.current.isCompleted).toBe(true)
        })
    })

    describe('UI state', () => {
        it('manages welcome back state', () => {
            const { result } = renderHook(() => useFormStore())

            act(() => {
                result.current.setShowWelcomeBack(true)
            })

            expect(result.current.showWelcomeBack).toBe(true)

            act(() => {
                result.current.setShowWelcomeBack(false)
            })

            expect(result.current.showWelcomeBack).toBe(false)
        })

        it('manages agreed to terms state', () => {
            const { result } = renderHook(() => useFormStore())

            act(() => {
                result.current.setAgreedToTerms(true)
            })

            expect(result.current.agreedToTerms).toBe(true)
        })
    })

    describe('API state', () => {
        it('manages submission state', () => {
            const { result } = renderHook(() => useFormStore())

            act(() => {
                result.current.setSubmission({
                    isSubmitting: true,
                    error: 'Test error'
                })
            })

            expect(result.current.submission.isSubmitting).toBe(true)
            expect(result.current.submission.error).toBe('Test error')
        })

        it('resets submission state', () => {
            const { result } = renderHook(() => useFormStore())

            act(() => {
                result.current.setSubmission({
                    isSubmitting: true,
                    isSuccess: true,
                    error: 'Test error'
                })
                result.current.resetSubmission()
            })

            expect(result.current.submission.isSubmitting).toBe(false)
            expect(result.current.submission.isSuccess).toBe(false)
            expect(result.current.submission.error).toBe(null)
        })
    })

    describe('utility actions', () => {
        it('clears all data', () => {
            const { result } = renderHook(() => useFormStore())

            act(() => {
                result.current.updateFormData({ name: 'John Doe' })
                result.current.setStep(2)
                result.current.setAgreedToTerms(true)
                result.current.clearAllData()
            })

            expect(result.current.formData.name).toBe('')
            expect(result.current.currentStep).toBe(0)
            expect(result.current.agreedToTerms).toBe(false)
        })

        it('restores session', () => {
            const { result } = renderHook(() => useFormStore())
            const testFormData: Partial<LoanFormData> = {
                name: 'Jane Doe',
                email: 'jane@example.com',
                loanAmount: 75000,
                loanType: 'auto' as const,
                phone: '0412345678'
            }

            act(() => {
                result.current.restoreSession(testFormData, 2)
            })

            expect(result.current.formData.name).toBe('Jane Doe')
            expect(result.current.formData.email).toBe('jane@example.com')
            expect(result.current.currentStep).toBe(2)
            expect(result.current.showWelcomeBack).toBe(false)
            expect(result.current.lastSaved).toBeInstanceOf(Date)
        })
    })
})
