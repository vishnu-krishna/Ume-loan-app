import { useCallback } from 'react';
import { LoanFormData } from '../types/form.types';

interface SavedSession {
    formData: LoanFormData;
    step: number;
    timestamp: number;
}

export const useFormPersistence = () => {
    const STORAGE_KEY = 'ume_loans_session';
    const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

    const saveProgress = useCallback((formData: LoanFormData, step: number): void => {
        const session: SavedSession = {
            formData,
            step,
            timestamp: Date.now()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    }, [STORAGE_KEY]);

    const getProgress = useCallback((): SavedSession | null => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return null;

        const session: SavedSession = JSON.parse(saved);
        const age = Date.now() - session.timestamp;

        // If session is too old, clear it
        if (age > SESSION_DURATION) {
            localStorage.removeItem(STORAGE_KEY);
            return null;
        }

        return session;
    }, [STORAGE_KEY, SESSION_DURATION]);

    const clearProgress = useCallback((): void => {
        localStorage.removeItem(STORAGE_KEY);
    }, [STORAGE_KEY]);

    return { saveProgress, getProgress, clearProgress };
};