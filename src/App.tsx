import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal';
import { Button } from '@heroui/button';
import { Card, CardBody } from '@heroui/card';
import { Chip } from '@heroui/chip';
import PersonalityQuiz from './components/PersonalityQuiz';
import LoanDetailsStep from './components/LoanDetailsStep';
import ContactInfoStep from './components/ContactInfoStep';
import SuccessScreen from './components/SuccessScreen';
import DevTools from './components/DevTools';
import { useFormData, useCurrentStep, useIsCompleted, useShowWelcomeBack, useLastSaved, useNextStep, usePreviousStep, useCompleteForm, useSetShowWelcomeBack, useClearAllData } from './store/selectors';
import { RefreshCw, Save } from 'lucide-react';

function App() {
    const formData = useFormData();
    const currentStep = useCurrentStep();
    const isCompleted = useIsCompleted();
    const showWelcomeBack = useShowWelcomeBack();
    const lastSaved = useLastSaved();
    const nextStep = useNextStep();
    const previousStep = usePreviousStep();
    const completeForm = useCompleteForm();
    const setShowWelcomeBack = useSetShowWelcomeBack();
    const clearAllData = useClearAllData();
    useEffect(() => {
        try {
            const savedData = localStorage.getItem('ume-loans-storage');
            if (savedData) {
                try {
                    const parsed = JSON.parse(savedData);
                    if (parsed.state && parsed.state.currentStep > 0) {
                        setShowWelcomeBack(true);
                    }
                } catch (parseError) {
                    console.warn('Failed to parse saved session:', parseError);
                    localStorage.removeItem('ume-loans-storage');
                }
            }
        } catch (storageError) {
            console.warn('localStorage is not available:', storageError);
        }
    }, [setShowWelcomeBack]);

    const handleNext = () => {
        if (currentStep < 3) {
            nextStep();
        } else {
            completeForm();
        }
    };

    const handleBack = () => {
        previousStep();
    };

    const handleRestoreSession = () => {
        setShowWelcomeBack(false);
    };

    const handleStartFresh = () => {
        clearAllData();
        setShowWelcomeBack(false);
    };

    const handleRestart = () => {
        clearAllData();
    };



    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return <PersonalityQuiz onNext={handleNext} />;
            case 1:
                return <LoanDetailsStep onNext={handleNext} onBack={handleBack} />;
            case 2:
                return <ContactInfoStep onNext={handleNext} onBack={handleBack} />;
            case 3:
                return <SuccessScreen onContinue={handleRestart} />;
            default:
                return null;
        }
    };

    const handleClearData = () => {
        clearAllData();
    };



    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 sm:p-8">
            <div className="max-w-6xl mx-auto">
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

                {!isCompleted && currentStep > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mb-6"
                    >
                        <div className="max-w-3xl mx-auto">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-600">Step {currentStep} of 3</span>
                                {lastSaved && (
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Save className="w-4 h-4" />
                                        <span>Saved</span>
                                    </div>
                                )}
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <motion.div
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(currentStep / 3) * 100}%` }}
                                    transition={{ duration: 0.3 }}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}

                <AnimatePresence mode="wait">
                    {renderStep()}
                </AnimatePresence>

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
                                            Step {currentStep} of 3
                                        </Chip>
                                    </div>
                                    {formData.name && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Name:</span>
                                            <span className="text-sm font-medium">{formData.name}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Loan Amount:</span>
                                        <span className="text-sm font-medium">
                                            ${formData.loanAmount.toLocaleString()}
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

                <DevTools onClearData={handleClearData} />
            </div>
        </div>
    );
}

export default App;