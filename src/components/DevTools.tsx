import { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Button } from '@heroui/button';
import { Tabs, Tab } from '@heroui/tabs';
import { Chip } from '@heroui/chip';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, Code, Info, Database } from 'lucide-react';
import type { LoanFormData } from '../types/form.types';

interface DevToolsProps {
    formData: LoanFormData;
    currentStep: number;
    onClearData?: () => void;
}

const DevTools: React.FC<DevToolsProps> = ({
    formData,
    currentStep,
    onClearData
}) => {
    const [isOpen, setIsOpen] = useState(false);

    // Only show in development
    if (import.meta.env.PROD) return null;

    // Keyboard shortcut: Ctrl+Shift+D
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, []);

    // Calculate form completion percentage
    const getCompletionPercentage = () => {
        const fields = [
            formData.personality,
            formData.loanPurpose,
            formData.loanAmount > 0,
            formData.loanType,
            formData.name,
            formData.email,
            formData.phone
        ];
        const completed = fields.filter(Boolean).length;
        return Math.round((completed / fields.length) * 100);
    };

    // Get localStorage usage
    const getStorageInfo = () => {
        const saved = localStorage.getItem('loanFormData');
        const size = saved ? new Blob([saved]).size : 0;
        return {
            hasData: !!saved,
            size: `${(size / 1024).toFixed(2)} KB`,
            lastSaved: saved ? new Date(JSON.parse(saved).timestamp).toLocaleTimeString() : 'Never'
        };
    };

    const storageInfo = getStorageInfo();

    return (
        <>
            {/* Floating Toggle Button */}
            <Button
                isIconOnly
                color="primary"
                variant="shadow"
                className="fixed top-4 right-4 z-50 shadow-lg"
                onPress={() => setIsOpen(!isOpen)}
                aria-label="Toggle Developer Tools"
            >
                <Settings className="w-5 h-5" />
            </Button>

            {/* Developer Tools Panel */} 
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ x: 400, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 400, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-96 z-40 shadow-2xl"
                    >
                        <Card className="h-full rounded-none border-l-2 border-primary">
                            <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-primary-50 to-secondary-50 pb-3">
                                <div className="flex items-center gap-2">
                                    <Code className="w-5 h-5 text-primary" />
                                    <h3 className="text-lg font-semibold">Dev Tools</h3>
                                </div>
                                <Button
                                    isIconOnly
                                    variant="light"
                                    size="sm"
                                    onPress={() => setIsOpen(false)}
                                    aria-label="Close Dev Tools"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </CardHeader>

                            <CardBody className="p-0">
                                <Tabs
                                    aria-label="Developer Tools Tabs"
                                    className="h-full"
                                    classNames={{
                                        tabList: "w-full relative rounded-none bg-default-100",
                                        cursor: "bg-primary",
                                        tab: "max-w-fit px-4 h-12",
                                        tabContent: "group-data-[selected=true]:text-primary-foreground"
                                    }}
                                >
                                    {/* Form State Tab */}
                                    <Tab
                                        key="state"
                                        title={
                                            <div className="flex items-center gap-2">
                                                <Database className="w-4 h-4" />
                                                <span>State</span>
                                            </div>
                                        }
                                    >
                                        <div className="p-4 space-y-4 h-full overflow-y-auto">
                                            <div className="space-y-2">
                                                <h4 className="font-semibold text-sm text-gray-700">Form Data</h4>
                                                <div className="bg-gray-50 rounded-lg p-3">
                                                    <pre className="text-xs text-gray-800 whitespace-pre-wrap overflow-auto max-h-64">
                                                        {JSON.stringify(formData, null, 2)}
                                                    </pre>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <h4 className="font-semibold text-sm text-gray-700">Quick Actions</h4>
                                                <div className="flex flex-col gap-2">
                                                    {onClearData && (
                                                        <Button
                                                            size="sm"
                                                            color="danger"
                                                            variant="flat"
                                                            onPress={onClearData}
                                                        >
                                                            Clear Form Data
                                                        </Button>
                                                    )}
                                                    <Button
                                                        size="sm"
                                                        color="primary"
                                                        variant="flat"
                                                        onPress={() => {
                                                            navigator.clipboard.writeText(JSON.stringify(formData, null, 2));
                                                        }}
                                                    >
                                                        Copy to Clipboard
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </Tab>

                                    {/* App Info Tab */}
                                    <Tab
                                        key="info"
                                        title={
                                            <div className="flex items-center gap-2">
                                                <Info className="w-4 h-4" />
                                                <span>Info</span>
                                            </div>
                                        }
                                    >
                                        <div className="p-4 space-y-4">
                                            <div className="space-y-3">
                                                <h4 className="font-semibold text-sm text-gray-700">Application State</h4>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between">
                                                        <span className="text-sm text-gray-600">Current Step:</span>
                                                        <Chip size="sm" color="primary">{currentStep + 1} of 4</Chip>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-sm text-gray-600">Completion:</span>
                                                        <Chip size="sm" color="success">{getCompletionPercentage()}%</Chip>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-sm text-gray-600">Environment:</span>
                                                        <Chip size="sm" color="warning">
                                                            {import.meta.env.DEV ? 'Development' : 'Production'}
                                                        </Chip>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <h4 className="font-semibold text-sm text-gray-700">Storage Info</h4>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between">
                                                        <span className="text-sm text-gray-600">Has Saved Data:</span>
                                                        <Chip size="sm" color={storageInfo.hasData ? "success" : "default"}>
                                                            {storageInfo.hasData ? "Yes" : "No"}
                                                        </Chip>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-sm text-gray-600">Data Size:</span>
                                                        <Chip size="sm" variant="flat">{storageInfo.size}</Chip>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-sm text-gray-600">Last Saved:</span>
                                                        <Chip size="sm" variant="flat">{storageInfo.lastSaved}</Chip>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <h4 className="font-semibold text-sm text-gray-700">Keyboard Shortcuts</h4>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Toggle Dev Tools:</span>
                                                        <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                                                            Ctrl+Shift+D
                                                        </code>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Copy State:</span>
                                                        <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                                                            Use Button
                                                        </code>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Tab>
                                </Tabs>
                            </CardBody>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default DevTools;
