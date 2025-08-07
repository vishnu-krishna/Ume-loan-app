import { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Button } from '@heroui/button';
import { Chip } from '@heroui/chip';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import CountUp from 'react-countup';
import { CheckCircle, Download, ArrowRight, Mail, Phone, Calendar } from 'lucide-react';
import { LoanFormData } from '../types/form.types';

interface SuccessScreenProps {
    formData: LoanFormData;
    onContinue?: () => void;
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({ formData, onContinue }) => {
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        // Trigger multiple confetti bursts
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min: number, max: number) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);

            // Confetti from left
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            });

            // Confetti from right
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            });
        }, 250);

        // Show details after animation
        setTimeout(() => setShowDetails(true), 1500);

        return () => clearInterval(interval);
    }, []);

    const mockApiResponse = {
        leadId: `UME-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        salesforceId: `SF-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        accountId: `ACC-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        approvalAmount: formData.loanAmount,
        estimatedTime: '24-48 hours',
        nextSteps: [
            'Our team will review your application',
            'You\'ll receive an email with next steps',
            'Complete verification if required',
            'Receive funds upon approval'
        ]
    };

    const getLoanTypeLabel = () => {
        const types = {
            personal: 'Personal Loan',
            auto: 'Auto Loan',
            home: 'Home Loan',
            business: 'Business Loan'
        };
        return types[formData.loanType];
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-3xl mx-auto"
        >
            <Card shadow="lg" radius="lg" className="w-full overflow-visible">
                <CardHeader className="flex flex-col items-center justify-center pb-2">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                            type: "spring",
                            stiffness: 200,
                            delay: 0.2
                        }}
                        className="w-24 h-24 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                    >
                        <CheckCircle className="w-12 h-12 text-white" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-center"
                    >
                        <h1 className="text-4xl font-bold mb-2">
                            Congratulations, {formData.name}! 🎉
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Your loan application has been submitted successfully!
                        </p>
                    </motion.div>
                </CardHeader>

                <CardBody className="px-8 pb-8 space-y-6">
                    {/* Loan Amount Display */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <Card shadow="sm" className="bg-gradient-to-r from-blue-50 to-purple-50">
                            <CardBody className="text-center p-6">
                                <p className="text-sm text-gray-600 mb-2">Requested Amount</p>
                                <div className="text-5xl font-bold text-gray-800">
                                    $<CountUp
                                        end={formData.loanAmount}
                                        duration={2}
                                        separator=","
                                        delay={0.5}
                                    />
                                </div>
                                <Chip color="success" variant="flat" radius="md" className="mt-3">
                                    {getLoanTypeLabel()}
                                </Chip>
                            </CardBody>
                        </Card>
                    </motion.div>

                    {/* Application Details */}
                    {showDetails && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                        >
                            {/* Reference Numbers */}
                            <Card shadow="sm" className="bg-gray-50">
                                <CardBody className="p-4 space-y-3">
                                    <h3 className="font-semibold text-gray-800 mb-3">Reference Numbers</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Application ID:</span>
                                            <Chip size="sm" variant="flat" radius="md">{mockApiResponse.leadId}</Chip>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Salesforce ID:</span>
                                            <Chip size="sm" variant="flat" color="primary" radius="md">{mockApiResponse.salesforceId}</Chip>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Account ID:</span>
                                            <Chip size="sm" variant="flat" color="secondary" radius="md">{mockApiResponse.accountId}</Chip>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>

                            {/* Timeline */}
                            <Card shadow="sm" className="bg-blue-50">
                                <CardBody className="p-4">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Calendar className="w-5 h-5 text-blue-600" />
                                        <h3 className="font-semibold text-gray-800">What's Next?</h3>
                                    </div>
                                    <div className="space-y-2">
                                        {mockApiResponse.nextSteps.map((step, index) => (
                                            <div key={index} className="flex items-start gap-2">
                                                <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                                                    {index + 1}
                                                </div>
                                                <p className="text-sm text-gray-700">{step}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-blue-200">
                                        <p className="text-sm text-gray-700">
                                            <strong>Estimated Processing Time:</strong> {mockApiResponse.estimatedTime}
                                        </p>
                                    </div>
                                </CardBody>
                            </Card>

                            {/* Contact Info Summary */}
                            <Card shadow="sm">
                                <CardBody className="p-4 space-y-2">
                                    <h3 className="font-semibold text-gray-800 mb-2">We'll Contact You At:</h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Mail className="w-4 h-4" />
                                        <span>{formData.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Phone className="w-4 h-4" />
                                        <span>{formData.phone}</span>
                                    </div>
                                </CardBody>
                            </Card>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                <Button
                                    color="primary"
                                    size="lg"
                                    radius="lg"
                                    className="flex-1"
                                    endContent={<ArrowRight className="w-5 h-5" />}
                                    onPress={onContinue}
                                >
                                    Continue to Dashboard
                                </Button>
                                <Button
                                    variant="bordered"
                                    color="primary"
                                    size="lg"
                                    radius="lg"
                                    className="flex-1"
                                    startContent={<Download className="w-5 h-5" />}
                                >
                                    Download Application
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </CardBody>
            </Card>
        </motion.div>
    );
};

export default SuccessScreen;