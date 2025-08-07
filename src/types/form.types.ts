// Form Data Types
export interface LoanFormData {
    // Personality Quiz
    personality?: 'planner' | 'balanced' | 'dreamer';
    loanPurpose?: 'immediate' | 'shortTerm' | 'planning';

    // Loan Details
    loanAmount: number;
    loanType: 'personal' | 'auto' | 'home' | 'business';

    // Contact Info
    name: string;
    email: string;
    phone: string;
}

// Component Props Types
export interface FormStepProps {
    data: LoanFormData;
    onChange: (data: Partial<LoanFormData>) => void;
    onNext?: () => void;
    onBack?: () => void;
}

// API Response Types
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