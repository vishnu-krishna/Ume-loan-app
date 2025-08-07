import { Input } from '@heroui/input';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Button } from '@heroui/button';
import { Checkbox } from '@heroui/checkbox';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormStepProps } from '../types/form.types';
import { User, Mail, Phone, Shield, CheckCircle } from 'lucide-react';
import { useState } from 'react';

const contactSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits (numbers only)')
});

type ContactFormData = z.infer<typeof contactSchema>;

const ContactInfoStep: React.FC<FormStepProps> = ({ data, onChange, onBack, onNext }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const { control, handleSubmit, formState: { errors, isValid }, watch } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
        mode: 'onChange',
        defaultValues: {
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || ''
        }
    });

    const watchedFields = watch();
    const isFormComplete = watchedFields.name && watchedFields.email && watchedFields.phone;

    const formatPhone = (value: string) => {
        const numbers = value.replace(/\D/g, '');
        if (numbers.length <= 3) return numbers;
        if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
        return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
    };

    const onSubmit = async (formData: ContactFormData) => {
        if (!agreedToTerms) {
            alert('Please agree to the terms and conditions');
            return;
        }

        setIsSubmitting(true);
        onChange(formData);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        setIsSubmitting(false);
        if (onNext) onNext();
    };

    const getFieldIcon = (fieldName: string) => {
        const hasValue = watchedFields[fieldName as keyof ContactFormData];
        const hasError = errors[fieldName as keyof ContactFormData];

        if (hasError) return null;
        if (hasValue && !hasError) {
            return <CheckCircle className="w-5 h-5 text-success" />;
        }
        return null;
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl mx-auto"
        >
            <Card shadow="lg" radius="lg" className="w-full">
                <CardHeader className="flex flex-col items-center justify-center pb-4">
                    <div className="mb-4">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4"
                        >
                            <Shield className="w-8 h-8 text-white" />
                        </motion.div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center">
                            Almost There! ✨
                        </h2>
                        <p className="text-gray-600 mt-2 text-center">
                            We just need a few details to complete your application
                        </p>
                    </div>
                </CardHeader>

                <CardBody className="px-8 pb-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Name Input */}
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    label="Full Name"
                                    placeholder="John Doe"
                                    variant="bordered"
                                    size="lg"
                                    radius="lg"
                                    startContent={<User className="w-5 h-5 text-gray-400" />}
                                    endContent={getFieldIcon('name')}
                                    isInvalid={!!errors.name}
                                    errorMessage={errors.name?.message}
                                    classNames={{
                                        input: "text-base",
                                        label: "text-sm"
                                    }}
                                />
                            )}
                        />

                        {/* Email Input */}
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    type="email"
                                    label="Email Address"
                                    placeholder="john@example.com"
                                    variant="bordered"
                                    size="lg"
                                    radius="lg"
                                    startContent={<Mail className="w-5 h-5 text-gray-400" />}
                                    endContent={getFieldIcon('email')}
                                    isInvalid={!!errors.email}
                                    errorMessage={errors.email?.message}
                                    classNames={{
                                        input: "text-base",
                                        label: "text-sm"
                                    }}
                                />
                            )}
                        />

                        {/* Phone Input */}
                        <Controller
                            name="phone"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    label="Phone Number"
                                    placeholder="(555) 123-4567"
                                    variant="bordered"
                                    size="lg"
                                    radius="lg"
                                    startContent={<Phone className="w-5 h-5 text-gray-400" />}
                                    endContent={getFieldIcon('phone')}
                                    value={formatPhone(field.value)}
                                    onChange={(e) => {
                                        const numbersOnly = e.target.value.replace(/\D/g, '');
                                        if (numbersOnly.length <= 10) {
                                            field.onChange(numbersOnly);
                                        }
                                    }}
                                    isInvalid={!!errors.phone}
                                    errorMessage={errors.phone?.message}
                                    classNames={{
                                        input: "text-base",
                                        label: "text-sm"
                                    }}
                                />
                            )}
                        />

                        {/* Terms and Conditions */}
                        <Card shadow="sm" className="bg-gray-50">
                            <CardBody className="p-4">
                                <Checkbox
                                    isSelected={agreedToTerms}
                                    onValueChange={setAgreedToTerms}
                                    size="md"
                                    radius="md"
                                    color="primary"
                                >
                                    <span className="text-sm">
                                        I agree to the{' '}
                                        <a href="#" className="text-primary underline">Terms and Conditions</a>
                                        {' '}and{' '}
                                        <a href="#" className="text-primary underline">Privacy Policy</a>
                                    </span>
                                </Checkbox>
                            </CardBody>
                        </Card>

                        {/* Security Badge */}
                        <Card shadow="sm" className="bg-blue-50 border-1 border-blue-200">
                            <CardBody className="flex flex-row items-center gap-3 p-4">
                                <Shield className="w-5 h-5 text-blue-600" />
                                <div className="text-sm">
                                    <p className="font-medium text-gray-800">Your information is secure</p>
                                    <p className="text-gray-600">We use bank-level encryption to protect your data</p>
                                </div>
                            </CardBody>
                        </Card>

                        {/* Form Progress Indicator */}
                        {isFormComplete && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 text-success text-sm"
                            >
                                <CheckCircle className="w-4 h-4" />
                                <span>All fields completed!</span>
                            </motion.div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between pt-4">
                            <Button
                                variant="flat"
                                color="primary"
                                size="lg"
                                radius="lg"
                                onPress={onBack}
                                isDisabled={isSubmitting}
                                startContent={<span>←</span>}
                            >
                                Back
                            </Button>
                            <Button
                                color="primary"
                                size="lg"
                                radius="lg"
                                type="submit"
                                isLoading={isSubmitting}
                                isDisabled={!isValid || !agreedToTerms}
                                endContent={!isSubmitting && <span>→</span>}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Application'}
                            </Button>
                        </div>
                    </form>
                </CardBody>
            </Card>
        </motion.div>
    );
};

export default ContactInfoStep;