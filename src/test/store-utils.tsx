import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { HeroUIProvider } from '@heroui/system'
import { useFormStore } from '../store/useFormStore'
import { LoanFormData } from '../types/form.types'

export const resetStoreState = () => {
    useFormStore.getState().resetForm()
}

export const setupStoreState = (formData?: Partial<LoanFormData>, step?: number) => {
    const store = useFormStore.getState()
    if (formData) store.updateFormData(formData)
    if (step !== undefined) store.setStep(step)
}
const customRender = (
    ui: ReactElement,
    options?: Omit<RenderOptions, 'wrapper'> & {
        initialStoreState?: {
            formData?: Partial<LoanFormData>
            step?: number
        }
    }
) => {
    const { initialStoreState, ...renderOptions } = options || {}

    resetStoreState()
    if (initialStoreState) {
        setupStoreState(initialStoreState.formData, initialStoreState.step)
    }

    const Wrapper = ({ children }: { children: React.ReactNode }) => {
        return (
            <HeroUIProvider>
                {children}
            </HeroUIProvider>
        )
    }

    return render(ui, { wrapper: Wrapper, ...renderOptions })
}

export * from '@testing-library/react'
export { customRender as render }
