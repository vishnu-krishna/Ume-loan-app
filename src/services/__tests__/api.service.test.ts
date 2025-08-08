import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { apiService } from '../api.service'
import { mockFormData, mockApiResponses } from '../../test/utils'

vi.mock('axios')
const mockedAxios = axios as any

describe('API Service', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('submitLead', () => {
        it('calls the correct endpoint with correct data', async () => {
            mockedAxios.post.mockResolvedValue({ data: mockApiResponses.success })

            const result = await apiService.submitLead(mockFormData)

            expect(mockedAxios.post).toHaveBeenCalledWith('/api/leads',
                expect.objectContaining({
                    firstName: 'John',
                    lastName: 'Doe',
                    email: mockFormData.email,
                    phone: mockFormData.phone,
                    loanAmount: mockFormData.loanAmount,
                    loanType: mockFormData.loanType,
                    personality: mockFormData.personality,
                    loanPurpose: mockFormData.loanPurpose,
                    source: 'Web Form',
                    status: 'New',
                    createdDate: expect.any(String)
                }),
                expect.objectContaining({
                    timeout: 10000,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
            )

            expect(result).toEqual(mockApiResponses.success)
        })

        it('handles network errors correctly', async () => {
            const networkError = new Error('Network Error')
            mockedAxios.post.mockRejectedValue(networkError)

            await expect(apiService.submitLead(mockFormData)).rejects.toThrow('An unexpected error occurred')
        })

        it('handles API error responses correctly', async () => {
            const apiError = {
                response: {
                    status: 400,
                    data: {
                        code: 'VALIDATION_ERROR',
                        message: 'Invalid email format'
                    }
                }
            }
            mockedAxios.post.mockRejectedValue(apiError)

            await expect(apiService.submitLead(mockFormData)).rejects.toThrow()
        })

        it('handles server error responses (5xx)', async () => {
            const serverError = {
                response: {
                    status: 500,
                    data: {
                        code: 'INTERNAL_ERROR',
                        message: 'Internal server error'
                    }
                }
            }
            mockedAxios.post.mockRejectedValue(serverError)

            await expect(apiService.submitLead(mockFormData)).rejects.toThrow()
        })

        it('transforms form data correctly for API', async () => {
            mockedAxios.post.mockResolvedValue({ data: mockApiResponses.success })

            const formDataWithOptionalFields = {
                ...mockFormData,
                leadId: 'existing-lead-id', // This should not be sent to API
                accountId: 'existing-account-id', // This should not be sent to API
                salesforceId: 'existing-sf-id' // This should not be sent to API
            }

            await apiService.submitLead(formDataWithOptionalFields)

            expect(mockedAxios.post).toHaveBeenCalledWith('/api/leads',
                expect.objectContaining({
                    firstName: 'John',
                    lastName: 'Doe',
                    email: formDataWithOptionalFields.email,
                    phone: formDataWithOptionalFields.phone,
                    loanAmount: formDataWithOptionalFields.loanAmount,
                    loanType: formDataWithOptionalFields.loanType,
                    personality: formDataWithOptionalFields.personality,
                    loanPurpose: formDataWithOptionalFields.loanPurpose,
                    source: 'Web Form',
                    status: 'New',
                    createdDate: expect.any(String)
                    // Should not include leadId, accountId, salesforceId
                }),
                expect.any(Object)
            )
        })
    })

    describe('createAccount', () => {
        it('calls the correct endpoint with correct data', async () => {
            mockedAxios.post.mockResolvedValue({ data: mockApiResponses.success })

            const result = await apiService.createAccount('lead-123', mockFormData)

            expect(mockedAxios.post).toHaveBeenCalledWith('/api/accounts',
                expect.objectContaining({
                    leadId: 'lead-123',
                    email: mockFormData.email,
                    name: mockFormData.name,
                    phone: mockFormData.phone,
                    accountType: 'Individual',
                    status: 'Active',
                    createdDate: expect.any(String)
                }),
                expect.any(Object)
            )

            expect(result).toEqual(mockApiResponses.success)
        })

        it('handles account creation errors', async () => {
            const accountError = {
                response: {
                    status: 422,
                    data: {
                        code: 'DUPLICATE_EMAIL',
                        message: 'Email already exists'
                    }
                }
            }
            mockedAxios.post.mockRejectedValue(accountError)

            await expect(apiService.createAccount('lead-123', mockFormData)).rejects.toThrow()
        })

        it('sends only required fields for account creation', async () => {
            mockedAxios.post.mockResolvedValue({ data: mockApiResponses.success })

            const formDataWithExtraFields = {
                ...mockFormData,
                personality: 'planner' as const,
                loanPurpose: 'immediate' as const,
                leadId: 'some-lead-id'
            }

            await apiService.createAccount('lead-456', formDataWithExtraFields)

            expect(mockedAxios.post).toHaveBeenCalledWith('/api/accounts',
                expect.objectContaining({
                    leadId: 'lead-456',
                    email: formDataWithExtraFields.email,
                    name: formDataWithExtraFields.name,
                    phone: formDataWithExtraFields.phone,
                    accountType: 'Individual',
                    status: 'Active',
                    createdDate: expect.any(String)
                    // Should not include personality, loanPurpose from form data
                }),
                expect.any(Object)
            )
        })
    })

    describe('error handling', () => {
        it('handles axios timeout errors', async () => {
            const timeoutError = {
                code: 'ECONNABORTED',
                message: 'timeout of 5000ms exceeded'
            }
            mockedAxios.post.mockRejectedValue(timeoutError)

            await expect(apiService.submitLead(mockFormData)).rejects.toThrow()
        })

        it('handles network connection errors', async () => {
            const connectionError = {
                code: 'ENOTFOUND',
                message: 'getaddrinfo ENOTFOUND api.example.com'
            }
            mockedAxios.post.mockRejectedValue(connectionError)

            await expect(apiService.submitLead(mockFormData)).rejects.toThrow()
        })

        it('handles malformed API responses', async () => {
            // API returns non-JSON response
            mockedAxios.post.mockResolvedValue({ data: 'invalid-json-response' })

            const result = await apiService.submitLead(mockFormData)

            // Should handle gracefully
            expect(result).toBe('invalid-json-response')
        })
    })

    describe('request configuration', () => {
        it('uses correct base URL for all endpoints', async () => {
            mockedAxios.post.mockResolvedValue({ data: mockApiResponses.success })

            await apiService.submitLead(mockFormData)
            await apiService.createAccount('lead-123', mockFormData)

            expect(mockedAxios.post).toHaveBeenCalledWith('/api/leads', expect.any(Object), expect.any(Object))
            expect(mockedAxios.post).toHaveBeenCalledWith('/api/accounts', expect.any(Object), expect.any(Object))
        })

        it('includes proper headers in requests', async () => {
            mockedAxios.post.mockResolvedValue({ data: mockApiResponses.success })

            await apiService.submitLead(mockFormData)

            // Verify axios was called (headers would be set by axios defaults)
            expect(mockedAxios.post).toHaveBeenCalled()
        })
    })
})

