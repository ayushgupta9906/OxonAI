import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, Loader2 } from 'lucide-react';

interface Toast {
    id: number;
    type: 'success' | 'error' | 'info' | 'loading';
    message: string;
    duration?: number;
}

interface NotificationCenterProps {
    toasts: Toast[];
    onDismiss: (id: number) => void;
}

export function NotificationCenter({ toasts, onDismiss }: NotificationCenterProps) {
    return (
        <div className="fixed bottom-16 right-4 z-50 flex flex-col gap-2 w-80">
            {toasts.map(toast => (
                <ToastItem key={toast.id} toast={toast} onDismiss={() => onDismiss(toast.id)} />
            ))}
        </div>
    );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
    useEffect(() => {
        if (toast.duration && toast.type !== 'loading') {
            const timer = setTimeout(onDismiss, toast.duration);
            return () => clearTimeout(timer);
        }
    }, [toast, onDismiss]);

    const getIcon = () => {
        switch (toast.type) {
            case 'success': return <CheckCircle size={18} className="text-green-400" />;
            case 'error': return <AlertCircle size={18} className="text-red-400" />;
            case 'info': return <Info size={18} className="text-blue-400" />;
            case 'loading': return <Loader2 size={18} className="text-purple-400 animate-spin" />;
        }
    };

    const getBg = () => {
        switch (toast.type) {
            case 'success': return 'border-green-500/30 bg-green-500/10';
            case 'error': return 'border-red-500/30 bg-red-500/10';
            case 'info': return 'border-blue-500/30 bg-blue-500/10';
            case 'loading': return 'border-purple-500/30 bg-purple-500/10';
        }
    };

    return (
        <div className={`flex items-start gap-3 p-4 rounded-xl border ${getBg()} backdrop-blur-lg shadow-xl animate-slide-up`}>
            {getIcon()}
            <p className="flex-1 text-sm text-white">{toast.message}</p>
            {toast.type !== 'loading' && (
                <button onClick={onDismiss} className="text-[#71717a] hover:text-white transition-colors">
                    <X size={14} />
                </button>
            )}
        </div>
    );
}

// Hook for using notifications
export function useNotifications() {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = (type: Toast['type'], message: string, duration = 5000) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, type, message, duration }]);
        return id;
    };

    const removeToast = (id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    const success = (message: string) => addToast('success', message);
    const error = (message: string) => addToast('error', message);
    const info = (message: string) => addToast('info', message);
    const loading = (message: string) => addToast('loading', message, 0);

    return { toasts, addToast, removeToast, success, error, info, loading };
}
