import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal';
import { Button } from '@heroui/button';
import { Card, CardBody } from '@heroui/card';
import { Chip } from '@heroui/chip';
import { LoanFormData } from './types/form.types';
import PersonalityQuiz from './components/PersonalityQuiz';
import LoanDetailsStep from './components/LoanDetailsStep';
import ContactInfoStep from './components/ContactInfoStep';
import SuccessScreen from './components/SuccessScreen';
import { useFormPersistence } from './hooks/useFormPersistence';
import { RefreshCw, Save } from 'lucide-react';

function App() {
    const [step, setStep] = useState<number>(0);
    const [isCompleted, setIsCompleted] = useState(false);
    const [showWelcomeBack, setShowWelcomeBack] = useState(false);
    const [savedSession, setSavedSession] = useState<any>(null);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    const [formData, setFormData] = useState<LoanFormData>({
        loanAmount: 50000,
        loanType: 'personal',
        name: '',
        email: '',
        phone: ''
    });

    const { saveProgress, getProgress, clearProgress } = useFormPersistence();

    // Check for saved session on mount
    useEffect(() => {
        const saved = getProgress();
        if (saved && saved.step > 0) {
            setSavedSession(saved);
            setShowWelcomeBack(true);
        }
    }, []);

    // Auto-save progress
    useEffect(() => {
        if (step > 0 && !isCompleted) {
            saveProgress(formData, step);
            setLastSaved(new Date());
        }
    }, [formData, step]);

    const updateFormData = (data: Partial<LoanFormData>) => {
        setFormData(prev => ({ ...prev, ...data }));
    };

    const handleNext = () => {
        if (step < 3) {
            setStep(prev => prev + 1);
        } else {
            setIsCompleted(true);
            clearProgress(); // Clear saved session after completion
        }
    };

    const handleBack = () => {
        if (step > 0) {
            setStep(prev => prev - 1);
        }
    };

    const handleRestoreSession = () => {
        if (savedSession) {
            setFormData(savedSession.formData);
            setStep(savedSession.step);
            setShowWelcomeBack(false);
        }
    };

    const handleStartFresh = () => {
        clearProgress();
        setShowWelcomeBack(false);
        setSavedSession(null);
    };

    const handleRestart = () => {
        setStep(0);
        setIsCompleted(false);
        setFormData({
            loanAmount: 50000,
            loanType: 'personal',
            name: '',
            email: '',
            phone: ''
        });
        clearProgress();
    };



    const renderStep = () => {
        switch (step) {
            case 0:
                return (
                    <PersonalityQuiz
                        data={formData}
                        onChange={updateFormData}
                        onNext={handleNext}
                    />
                );
            case 1:
                return (
                    <LoanDetailsStep
                        data={formData}
                        onChange={updateFormData}
                        onNext={handleNext}
                        onBack={handleBack}
                    />
                );
            case 2:
                return (
                    <ContactInfoStep
                        data={formData}
                        onChange={updateFormData}
                        onNext={handleNext}
                        onBack={handleBack}
                    />
                );
            case 3:
                return (
                    <SuccessScreen
                        formData={formData}
                        onContinue={handleRestart}
                    />
                );
            default:
                return null;
        }
    };

    // Main app
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 sm:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-6"
                >
                    <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Ume Loans
                    </h1>
                    <p className="text-gray-600">Fast, Simple, Secure Loan Applications</p>
                </motion.div>

                {/* Progress Indicator */}
                {!isCompleted && step > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mb-6"
                    >
                        <div className="max-w-3xl mx-auto">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-600">Step {step} of 3</span>
                                {lastSaved && (
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Save className="w-4 h-4" />
                                        <span>Auto-saved</span>
                                    </div>
                                )}
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <motion.div
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(step / 3) * 100}%` }}
                                    transition={{ duration: 0.3 }}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Main Content */}
                <AnimatePresence mode="wait">
                    {renderStep()}
                </AnimatePresence>

                {/* Welcome Back Modal */}
                <Modal
                    isOpen={showWelcomeBack}
                    onClose={handleStartFresh}
                    size="md"
                >
                    <ModalContent>
                        <ModalHeader className="flex flex-col gap-1">
                            <h3 className="text-xl font-semibold">Welcome Back! 👋</h3>
                        </ModalHeader>
                        <ModalBody>
                            <p className="text-gray-600">
                                We found a saved application from your previous visit.
                            </p>
                            <Card className="bg-gray-50 mt-4">
                                <CardBody className="p-4 space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Progress:</span>
                                        <Chip size="sm" color="primary" variant="flat">
                                            Step {savedSession?.step} of 3
                                        </Chip>
                                    </div>
                                    {savedSession?.formData.name && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Name:</span>
                                            <span className="text-sm font-medium">{savedSession.formData.name}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Loan Amount:</span>
                                        <span className="text-sm font-medium">
                                            ${savedSession?.formData.loanAmount.toLocaleString()}
                                        </span>
                                    </div>
                                </CardBody>
                            </Card>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                variant="bordered"
                                color="primary"
                                size="lg"
                                onPress={handleStartFresh}
                            >
                                Start Fresh
                            </Button>
                            <Button
                                color="primary"
                                size="lg"
                                onPress={handleRestoreSession}
                                startContent={<RefreshCw className="w-4 h-4" />}
                            >
                                Continue Application
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </div>
        </div>
    );
}

export default App;