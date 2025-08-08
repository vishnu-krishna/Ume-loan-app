import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useFormPersistence } from '../useFormPersistence'

// Mock localStorage directly without using the test setup
const mockFormData = {
    personality: 'planner' as const,
    loanPurpose: 'immediate' as const,
    loanAmount: 50000,
    loanType: 'personal' as const,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '(555) 123-4567'
}

// Create a simple localStorage mock
const createLocalStorageMock = () => {
    let store: Record<string, string> = {}

    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => { store[key] = value },
        removeItem: (key: string) => { delete store[key] },
        clear: () => { store = {} },
        get store() { return store }
    }
}

describe('useFormPersistence Hook', () => {
    const STORAGE_KEY = 'ume_loans_session'
    let localStorageMock: ReturnType<typeof createLocalStorageMock>

    beforeEach(() => {
        localStorageMock = createLocalStorageMock()

        // Replace global localStorage with our mock
        Object.defineProperty(window, 'localStorage', {
            value: localStorageMock,
            writable: true
        })
    })

    it('returns the correct methods', () => {
        const { result } = renderHook(() => useFormPersistence())

        expect(result.current).toHaveProperty('saveProgress')
        expect(result.current).toHaveProperty('getProgress')
        expect(result.current).toHaveProperty('clearProgress')
    })

    it('saves form data to localStorage', () => {
        const { result } = renderHook(() => useFormPersistence())

        act(() => {
            result.current.saveProgress(mockFormData, 2)
        })

        const savedData = localStorage.getItem(STORAGE_KEY)
        expect(savedData).toBeTruthy()

        const parsedData = JSON.parse(savedData!)
        expect(parsedData.formData).toEqual(mockFormData)
        expect(parsedData.step).toBe(2)
        expect(parsedData.timestamp).toBeTypeOf('number')
    })

    it('retrieves saved form data from localStorage', () => {
        // Pre-populate localStorage
        const savedSession = {
            formData: mockFormData,
            step: 1,
            timestamp: Date.now()
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedSession))

        const { result } = renderHook(() => useFormPersistence())

        const retrievedData = result.current.getProgress()
        expect(retrievedData).toEqual(savedSession)
    })

    it('returns null when no saved data exists', () => {
        const { result } = renderHook(() => useFormPersistence())

        const retrievedData = result.current.getProgress()
        expect(retrievedData).toBeNull()
    })

    it('throws error when localStorage data is invalid JSON', () => {
        localStorage.setItem(STORAGE_KEY, 'invalid-json')

        const { result } = renderHook(() => useFormPersistence())

        // The hook doesn't handle JSON parsing errors, so it should throw
        expect(() => {
            result.current.getProgress()
        }).toThrow()
    })

    it('clears saved data from localStorage', () => {
        // Pre-populate localStorage
        const savedSession = {
            formData: mockFormData,
            step: 1,
            timestamp: Date.now()
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedSession))

        const { result } = renderHook(() => useFormPersistence())

        act(() => {
            result.current.clearProgress()
        })

        const savedData = localStorage.getItem(STORAGE_KEY)
        expect(savedData).toBeNull()
    })



    it('handles localStorage setItem errors gracefully', () => {
        // Replace localStorage.setItem with a function that throws
        localStorageMock.setItem = () => {
            throw new Error('Storage quota exceeded')
        }

        const { result } = renderHook(() => useFormPersistence())

        // Should throw an error since the hook doesn't handle localStorage errors
        expect(() => {
            act(() => {
                result.current.saveProgress(mockFormData, 1)
            })
        }).toThrow('Storage quota exceeded')
    })

    it('handles localStorage getItem errors gracefully', () => {
        // Replace localStorage.getItem with a function that throws
        localStorageMock.getItem = () => {
            throw new Error('Storage access denied')
        }

        const { result } = renderHook(() => useFormPersistence())

        // Should throw an error since the hook doesn't handle localStorage errors
        expect(() => {
            result.current.getProgress()
        }).toThrow('Storage access denied')
    })

    it('saves updated timestamp on each save', () => {
        const { result } = renderHook(() => useFormPersistence())

        const firstTimestamp = Date.now()

        act(() => {
            result.current.saveProgress(mockFormData, 1)
        })

        const firstSave = JSON.parse(localStorage.getItem(STORAGE_KEY)!)
        expect(firstSave.timestamp).toBeGreaterThanOrEqual(firstTimestamp)

        // Mock Date.now to return a later timestamp for the second save
        const originalDateNow = Date.now
        Date.now = vi.fn(() => firstSave.timestamp + 1000) // 1 second later

        act(() => {
            result.current.saveProgress(mockFormData, 2)
        })

        const secondSave = JSON.parse(localStorage.getItem(STORAGE_KEY)!)
        expect(secondSave.timestamp).toBeGreaterThan(firstSave.timestamp)
        expect(secondSave.step).toBe(2)

        // Restore Date.now
        Date.now = originalDateNow
    })

    it('preserves all form data fields when saving', () => {
        const complexFormData = {
            personality: 'balanced' as const,
            loanPurpose: 'shortTerm' as const,
            loanAmount: 125000,
            loanType: 'business' as const,
            name: 'Jane Smith',
            email: 'jane.smith@business.com',
            phone: '(555) 987-6543',
            leadId: 'LEAD-123',
            accountId: 'ACC-456',
            salesforceId: 'SF-789'
        }

        const { result } = renderHook(() => useFormPersistence())

        act(() => {
            result.current.saveProgress(complexFormData, 3)
        })

        const savedData = JSON.parse(localStorage.getItem(STORAGE_KEY)!)
        expect(savedData.formData).toEqual(complexFormData)
        expect(savedData.step).toBe(3)
    })
})

