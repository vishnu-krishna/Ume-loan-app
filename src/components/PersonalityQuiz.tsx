import { useState } from 'react';
import type { JSX } from 'react';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Button } from '@heroui/button';
import { Progress } from '@heroui/progress';
import { motion } from 'framer-motion';
import { FormStepProps } from '../types/form.types';
import { Sparkles, TrendingUp, Target, Rocket, ChevronRight } from 'lucide-react';

interface QuizOption {
    value: string;
    label: string;
    icon: JSX.Element;
    description: string;
    color: 'primary' | 'secondary' | 'success';
}

const PersonalityQuiz: React.FC<FormStepProps> = ({ data, onChange, onNext }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [hoveredOption, setHoveredOption] = useState<string | null>(null);

    const questions = [
        {
            id: 'personality',
            title: "What's your financial personality?",
            subtitle: "This helps us personalize your experience",
            options: [
                {
                    value: 'planner',
                    label: 'The Planner',
                    icon: <Target className="w-8 h-8" />,
                    description: 'I budget everything carefully',
                    color: 'primary' as const
                },
                {
                    value: 'balanced',
                    label: 'The Balancer',
                    icon: <TrendingUp className="w-8 h-8" />,
                    description: 'I mix planning with flexibility',
                    color: 'secondary' as const
                },
                {
                    value: 'dreamer',
                    label: 'The Dreamer',
                    icon: <Rocket className="w-8 h-8" />,
                    description: 'I have big goals to achieve!',
                    color: 'success' as const
                }
            ]
        },
        {
            id: 'loanPurpose',
            title: "When do you need the funds?",
            subtitle: "This helps us understand your urgency",
            options: [
                {
                    value: 'immediate',
                    label: 'Right Away',
                    icon: <Sparkles className="w-8 h-8" />,
                    description: 'Within the next week',
                    color: 'primary' as const
                },
                {
                    value: 'shortTerm',
                    label: 'Soon',
                    icon: <TrendingUp className="w-8 h-8" />,
                    description: 'Within a month',
                    color: 'secondary' as const
                },
                {
                    value: 'planning',
                    label: 'Planning Ahead',
                    icon: <Target className="w-8 h-8" />,
                    description: 'Just exploring options',
                    color: 'success' as const
                }
            ]
        }
    ];

    const currentQ = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    const handleAnswer = (questionId: string, value: string) => {
        const newAnswers = { ...answers, [questionId]: value };
        setAnswers(newAnswers);

        // Update form data
        onChange(newAnswers);

        // Move to next question or complete
        if (currentQuestion < questions.length - 1) {
            setTimeout(() => {
                setCurrentQuestion(prev => prev + 1);
            }, 300);
        } else {
            setTimeout(() => {
                if (onNext) onNext();
            }, 300);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-3xl mx-auto"
        >
            <Card className="w-full">
                <CardHeader className="flex flex-col items-center justify-center pb-2">
                    <div className="mb-4">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {currentQ.title}
                        </h2>
                        <p className="text-gray-600 mt-2">{currentQ.subtitle}</p>
                    </div>
                    <Progress
                        value={progress}
                        className="h-2 w-full"
                        color="primary"
                        aria-label="Quiz progress"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                        Question {currentQuestion + 1} of {questions.length}
                    </p>
                </CardHeader>

                <CardBody className="px-8 pb-8">
                    <div className="flex flex-col gap-4 mt-4 w-full">
                        {currentQ.options.map((option) => (
                            <motion.div
                                key={option.value}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onHoverStart={() => setHoveredOption(option.value)}
                                onHoverEnd={() => setHoveredOption(null)}
                                className="w-full"
                            >
                                <Card
                                    isPressable
                                    isHoverable
                                    className={`w-full cursor-pointer transition-all ${hoveredOption === option.value ? 'border-2 border-primary' : 'border-2 border-transparent'
                                        }`}
                                    onPress={() => handleAnswer(currentQ.id, option.value)}
                                >
                                    <CardBody className="flex flex-row items-center gap-4 p-6">
                                        <div className={`p-3 rounded-xl ${option.color === 'primary' ? 'bg-blue-100' :
                                            option.color === 'secondary' ? 'bg-purple-100' :
                                                'bg-green-100'
                                            }`}>
                                            {option.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold">{option.label}</h3>
                                            <p className="text-gray-600 text-sm mt-1">{option.description}</p>
                                        </div>
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: hoveredOption === option.value ? 1 : 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <ChevronRight className="w-6 h-6 text-primary" />
                                        </motion.div>
                                    </CardBody>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {currentQuestion > 0 && (
                        <div className="mt-6 text-center">
                            <Button
                                variant="flat"
                                color="primary"
                                size="lg"
                                onPress={() => setCurrentQuestion(prev => prev - 1)}
                                startContent={<span>←</span>}
                            >
                                Back
                            </Button>
                        </div>
                    )}
                </CardBody>
            </Card>
        </motion.div>
    );
};

export default PersonalityQuiz;