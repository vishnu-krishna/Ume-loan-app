import { toast } from 'sonner';

export const useToast = () => {
    const showSuccess = (message: string) => {
        toast.success(message, {
            duration: 4000,
            position: 'top-right',
        });
    };

    const showError = (message: string) => {
        toast.error(message, {
            duration: 6000,
            position: 'top-right',
        });
    };

    const showLoading = (message: string) => {
        return toast.loading(message, {
            position: 'top-right',
        });
    };

    const showInfo = (message: string) => {
        toast.info(message, {
            duration: 4000,
            position: 'top-right',
        });
    };

    const dismiss = (toastId: string | number) => {
        toast.dismiss(toastId);
    };

    return {
        showSuccess,
        showError,
        showLoading,
        showInfo,
        dismiss
    };
};
