import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { LoanFormData, SubmissionState } from '../types/form.types'

interface FormStore {
    formData: LoanFormData
    currentStep: number
    isCompleted: boolean
    showWelcomeBack: boolean
    lastSaved: Date | null
    agreedToTerms: boolean
    submission: SubmissionState

    updateFormData: (data: Partial<LoanFormData>) => void
    resetForm: () => void
    setStep: (step: number) => void
    nextStep: () => void
    previousStep: () => void
    completeForm: () => void
    setShowWelcomeBack: (show: boolean) => void
    setLastSaved: (date: Date | null) => void
    setAgreedToTerms: (agreed: boolean) => void
    setSubmission: (state: Partial<SubmissionState>) => void
    resetSubmission: () => void
    clearAllData: () => void
    restoreSession: (formData: Partial<LoanFormData>, step: number) => void
}

const initialFormData: LoanFormData = {
    loanAmount: 50000,
    loanType: 'personal',
    name: '',
    email: '',
    phone: ''
}

const initialSubmission: SubmissionState = {
    isSubmitting: false,
    isSuccess: false,
    error: null,
    leadResponse: null,
    accountResponse: null
}

export const useFormStore = create<FormStore>()(
    devtools(
        persist(
            (set, get) => ({
                formData: initialFormData,
                currentStep: 0,
                isCompleted: false,
                showWelcomeBack: false,
                lastSaved: null,
                agreedToTerms: false,
                submission: initialSubmission,
                updateFormData: (data) =>
                    set(
                        (state) => ({
                            formData: { ...state.formData, ...data },
                            lastSaved: new Date()
                        }),
                        false,
                        'updateFormData'
                    ),

                resetForm: () =>
                    set(
                        {
                            formData: initialFormData,
                            currentStep: 0,
                            isCompleted: false,
                            agreedToTerms: false,
                            submission: initialSubmission,
                            lastSaved: null
                        },
                        false,
                        'resetForm'
                    ),

                setStep: (step) => set({ currentStep: step }, false, 'setStep'),

                nextStep: () =>
                    set(
                        (state) => ({
                            currentStep: state.currentStep < 3 ? state.currentStep + 1 : state.currentStep
                        }),
                        false,
                        'nextStep'
                    ),

                previousStep: () =>
                    set(
                        (state) => ({
                            currentStep: state.currentStep > 0 ? state.currentStep - 1 : state.currentStep
                        }),
                        false,
                        'previousStep'
                    ),

                completeForm: () =>
                    set(
                        { isCompleted: true },
                        false,
                        'completeForm'
                    ),

                setShowWelcomeBack: (show) => set({ showWelcomeBack: show }, false, 'setShowWelcomeBack'),
                setLastSaved: (date) => set({ lastSaved: date }, false, 'setLastSaved'),
                setAgreedToTerms: (agreed) => set({ agreedToTerms: agreed }, false, 'setAgreedToTerms'),

                setSubmission: (submissionUpdate) =>
                    set(
                        (state) => ({
                            submission: { ...state.submission, ...submissionUpdate }
                        }),
                        false,
                        'setSubmission'
                    ),

                resetSubmission: () =>
                    set({ submission: initialSubmission }, false, 'resetSubmission'),

                clearAllData: () => {
                    const { resetForm } = get()
                    resetForm()
                },

                restoreSession: (formData, step) =>
                    set(
                        (state) => ({
                            formData: { ...state.formData, ...formData },
                            currentStep: step,
                            showWelcomeBack: false,
                            lastSaved: new Date()
                        }),
                        false,
                        'restoreSession'
                    )
            }),
            {
                name: 'ume-loans-storage',
                partialize: (state) => ({
                    formData: state.formData,
                    currentStep: state.currentStep,
                    lastSaved: state.lastSaved,
                }),
                onRehydrateStorage: () => (_, error) => {
                    if (error) {
                        console.warn('Failed to rehydrate store:', error);
                        return {
                            formData: initialFormData,
                            currentStep: 0,
                            isCompleted: false,
                            showWelcomeBack: false,
                            lastSaved: null,
                            agreedToTerms: false,
                            submission: initialSubmission
                        };
                    }
                }
            }
        ),
        {
            name: 'ume-loans-store'
        }
    )
)
