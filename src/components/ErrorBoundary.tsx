import { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardBody } from '@heroui/card';
import { Button } from '@heroui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);

        // In production, you might want to log this to an error reporting service
        if (import.meta.env.PROD) {
            // Example: Sentry.captureException(error, { contexts: { errorInfo } });
        }
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 flex items-center justify-center">
                    <Card className="max-w-md w-full shadow-xl">
                        <CardBody className="text-center p-8 space-y-6">
                            <div className="flex justify-center">
                                <AlertTriangle className="w-16 h-16 text-orange-500" />
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-xl font-semibold text-gray-800">
                                    Something went wrong
                                </h2>
                                <p className="text-gray-600">
                                    We encountered an unexpected error. Don't worry, your progress has been saved.
                                </p>
                            </div>

                            {!import.meta.env.PROD && this.state.error && (
                                <details className="text-left bg-gray-100 p-4 rounded-lg">
                                    <summary className="cursor-pointer text-sm font-medium text-gray-700">
                                        Error Details
                                    </summary>
                                    <pre className="mt-2 text-xs text-red-600 overflow-auto">
                                        {this.state.error.message}
                                        {this.state.error.stack}
                                    </pre>
                                </details>
                            )}

                            <div className="flex gap-3 justify-center">
                                <Button
                                    variant="ghost"
                                    onPress={this.handleReset}
                                    startContent={<RefreshCw className="w-4 h-4" />}
                                >
                                    Try Again
                                </Button>
                                <Button
                                    color="primary"
                                    onPress={this.handleReload}
                                >
                                    Reload Page
                                </Button>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: undefined });
    };

    private handleReload = () => {
        window.location.reload();
    };
}
