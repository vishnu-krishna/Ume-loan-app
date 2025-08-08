export interface LoanFormData {
    personality?: 'planner' | 'balanced' | 'dreamer';
    loanPurpose?: 'immediate' | 'shortTerm' | 'planning';

    loanAmount: number;
    loanType: 'personal' | 'auto' | 'home' | 'business';

    name: string;
    email: string;
    phone: string;

    leadId?: string;
    accountId?: string;
    salesforceId?: string;
}

export interface FormStepProps {
    data: LoanFormData;
    onChange: (data: Partial<LoanFormData>) => void;
    onNext?: () => void;
    onBack?: () => void;
}

export interface ApiResponse {
    leadId: string;
    salesforceId: string;
    accountId: string;
    status: 'success' | 'error';
    message?: string;
}

export interface ApiError {
    code: string;
    message: string;
    details?: Record<string, any>;
}

export interface SubmissionState {
    isSubmitting: boolean;
    isSuccess: boolean;
    error: string | null;
    leadResponse: ApiResponse | null;
    accountResponse: ApiResponse | null;
}