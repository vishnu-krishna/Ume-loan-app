import { Card, CardBody, CardHeader } from '@heroui/card';
import { Button } from '@heroui/button';
import { Chip } from '@heroui/chip';
import { Slider } from '@heroui/slider';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { LoanFormData } from '../types/form.types';
import { useFormData, useUpdateFormData } from '../store/selectors';
import { DollarSign, Calculator, Info } from 'lucide-react';

const LOAN_TYPES = [
    { value: 'personal', label: 'Personal Loan', apr: 12.5, icon: '💰', description: 'For any personal use' },
    { value: 'auto', label: 'Auto Loan', apr: 6.5, icon: '🚗', description: 'Finance your vehicle' },
    { value: 'home', label: 'Home Loan', apr: 4.5, icon: '🏠', description: 'For home improvements' },
    { value: 'business', label: 'Business Loan', apr: 9.5, icon: '💼', description: 'Grow your business' }
];

interface LoanDetailsStepProps {
    onNext?: () => void;
    onBack?: () => void;
}

const LoanDetailsStep: React.FC<LoanDetailsStepProps> = ({ onNext, onBack }) => {
    const data = useFormData();
    const updateFormData = useUpdateFormData();
    const selectedLoanType = LOAN_TYPES.find(t => t.value === data.loanType);
    const monthlyPayment = calculateMonthlyPayment(
        data.loanAmount,
        selectedLoanType?.apr || 12.5,
        36
    );

    function calculateMonthlyPayment(amount: number, apr: number, months: number): number {
        const monthlyRate = apr / 100 / 12;
        const payment = (amount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
            (Math.pow(1 + monthlyRate, months) - 1);
        return Math.round(payment);
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-3xl mx-auto"
        >
            <Card className="w-full">
                <CardHeader className="flex flex-col items-center justify-center pb-4">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Customize Your Loan
                    </h2>
                    <p className="text-gray-600 mt-2">Adjust the details to fit your needs</p>
                </CardHeader>

                <CardBody className="px-8 pb-8 space-y-8">
                    <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
                        <CardBody className="text-center p-6">
                            <p className="text-sm text-gray-600 mb-2">Loan Amount</p>
                            <div className="text-5xl font-bold text-gray-800 mb-2">
                                $<CountUp
                                    end={data.loanAmount}
                                    duration={0.5}
                                    separator=","
                                    preserveValue
                                />
                            </div>
                            <div className="flex justify-center gap-4 mt-4">
                                <Chip color="primary" variant="flat">
                                    Est. Monthly: {formatCurrency(monthlyPayment)}
                                </Chip>
                                <Chip color="secondary" variant="flat">
                                    APR: {selectedLoanType?.apr}%
                                </Chip>
                            </div>
                        </CardBody>
                    </Card>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-medium">Adjust Amount</label>
                            <span className="text-sm text-gray-500">$1,000 - $500,000</span>
                        </div>
                        <Slider
                            step={1000}
                            minValue={1000}
                            maxValue={500000}
                            value={data.loanAmount}
                            onChange={(value) => updateFormData({ loanAmount: value as number })}
                            className="max-w-full"
                            color="primary"
                            size="lg"
                            startContent={<DollarSign className="w-5 h-5 text-gray-400" />}
                            endContent={<Calculator className="w-5 h-5 text-gray-400" />}
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>$1K</span>
                            <span>$100K</span>
                            <span>$250K</span>
                            <span>$500K</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-sm font-medium">Loan Type</label>
                        <div className="grid grid-cols-2 gap-4">
                            {LOAN_TYPES.map((type) => (
                                <motion.div
                                    key={type.value}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full h-full"
                                >
                                    <Card
                                        isPressable
                                        isHoverable
                                        className={`w-full h-full cursor-pointer ${data.loanType === type.value
                                            ? 'bg-primary/5 border-2 border-primary'
                                            : 'border-2 border-transparent'
                                            }`}
                                        onPress={() => updateFormData({ loanType: type.value as LoanFormData['loanType'] })}
                                    >
                                        <CardBody className="p-4">
                                            <div className="flex items-start gap-3">
                                                <span className="text-2xl">{type.icon}</span>
                                                <div className="flex-1">
                                                    <h4 className="font-semibold">{type.label}</h4>
                                                    <p className="text-xs text-gray-600 mt-1">{type.description}</p>
                                                    <Chip
                                                        size="sm"
                                                        color={data.loanType === type.value ? "primary" : "default"}
                                                        variant="flat"
                                                        className="mt-2"
                                                    >
                                                        APR {type.apr}%
                                                    </Chip>
                                                </div>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Quick Select</label>
                        <div className="flex gap-2 flex-wrap">
                            {[10000, 25000, 50000, 100000, 250000].map((amount) => (
                                <Button
                                    key={amount}
                                    size="md"
                                    variant={data.loanAmount === amount ? "solid" : "flat"}
                                    color={data.loanAmount === amount ? "primary" : "default"}
                                    onPress={() => updateFormData({ loanAmount: amount })}
                                >
                                    {formatCurrency(amount)}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <Card className="bg-blue-50">
                        <CardBody className="flex flex-row gap-3 p-4">
                            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-gray-700">
                                <p className="font-medium mb-1">Quick Tip</p>
                                <p>The monthly payment shown is an estimate based on a 36-month term.
                                    Your actual rate and terms will be determined after approval.</p>
                            </div>
                        </CardBody>
                    </Card>

                    <div className="flex justify-between pt-4">
                        <Button
                            variant="flat"
                            color="primary"
                            size="lg"
                            onPress={onBack}
                            startContent={<span>←</span>}
                        >
                            Back
                        </Button>
                        <Button
                            color="primary"
                            size="lg"
                            onPress={onNext}
                            endContent={<span>→</span>}
                        >
                            Next Step
                        </Button>
                    </div>
                </CardBody>
            </Card>
        </motion.div>
    );
};

export default LoanDetailsStep;