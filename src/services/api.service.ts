import axios, { AxiosError } from 'axios';
import { LoanFormData, ApiResponse, ApiError } from '../types/form.types';

export class ApiService {
    private baseURL = '/api';

    /**
     * Submit lead to mock Salesforce CRM
     */
    async submitLead(data: LoanFormData): Promise<ApiResponse> {
        try {
            const payload = {
                // Map form data to Salesforce-like structure
                firstName: data.name.split(' ')[0] || '',
                lastName: data.name.split(' ').slice(1).join(' ') || data.name,
                email: data.email,
                phone: data.phone,
                loanAmount: data.loanAmount,
                loanType: data.loanType,
                personality: data.personality,
                loanPurpose: data.loanPurpose,
                source: 'Web Form',
                status: 'New',
                createdDate: new Date().toISOString()
            };

            const response = await axios.post<ApiResponse>(`${this.baseURL}/leads`, payload, {
                timeout: 10000,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError<ApiError>;
                throw new Error(
                    axiosError.response?.data?.message ||
                    axiosError.message ||
                    'Failed to submit lead'
                );
            }
            throw new Error('An unexpected error occurred');
        }
    }

    /**
     * Create user account after successful lead submission
     */
    async createAccount(leadId: string, formData: LoanFormData): Promise<ApiResponse> {
        try {
            const payload = {
                leadId,
                email: formData.email,
                name: formData.name,
                phone: formData.phone,
                accountType: 'Individual',
                status: 'Active',
                createdDate: new Date().toISOString()
            };

            const response = await axios.post<ApiResponse>(`${this.baseURL}/accounts`, payload, {
                timeout: 10000,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError<ApiError>;
                throw new Error(
                    axiosError.response?.data?.message ||
                    axiosError.message ||
                    'Failed to create account'
                );
            }
            throw new Error('An unexpected error occurred');
        }
    }

    /**
     * Check if email already exists (for future use)
     */
    async checkEmailExists(email: string): Promise<boolean> {
        try {
            const response = await axios.get<{ exists: boolean }>(
                `${this.baseURL}/check-email/${encodeURIComponent(email)}`,
                { timeout: 5000 }
            );
            return response.data.exists;
        } catch (error) {
            // If check fails, assume email doesn't exist to avoid blocking user
            console.warn('Email check failed:', error);
            return false;
        }
    }
}

// Export singleton instance
export const apiService = new ApiService();
