'use client';

import { useState } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useToast, type Toast as ToastType, type ToastType as ToastVariant } from '@/stores/uiStore';
import { cn } from '@/lib/utils';

const icons: Record<ToastVariant, React.ReactNode> = {
  success: <CheckCircle className="w-5 h-5" />,
  error: <AlertCircle className="w-5 h-5" />,
  warning: <AlertTriangle className="w-5 h-5" />,
  info: <Info className="w-5 h-5" />,
};

const styles: Record<ToastVariant, string> = {
  success: `
    bg-[var(--color-success-50)]
    border-[var(--color-success-500)]
    text-[var(--color-success-700)]
  `,
  error: `
    bg-[var(--color-error-50)]
    border-[var(--color-error-500)]
    text-[var(--color-error-700)]
  `,
  warning: `
    bg-[var(--color-warning-50)]
    border-[var(--color-warning-500)]
    text-[var(--color-warning-700)]
  `,
  info: `
    bg-[var(--color-info-50)]
    border-[var(--color-info-500)]
    text-[var(--color-info-700)]
  `,
};

interface ToastItemProps {
  toast: ToastType;
  onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const [isExiting, setIsExiting] = useState(false);

  const handleRemove = () => {
    setIsExiting(true);
    setTimeout(() => onRemove(toast.id), 200);
  };

  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-3 p-4',
        'border-l-4 rounded-[var(--radius-md)]',
        'shadow-[var(--shadow-md)]',
        'min-w-[300px] max-w-md',
        styles[toast.type],
        isExiting ? 'animate-fade-out' : 'animate-slide-in-up'
      )}
    >
      <span className="shrink-0">{icons[toast.type]}</span>
      <div className="flex-1 min-w-0">
        {toast.title && (
          <h4 className="font-semibold mb-1">{toast.title}</h4>
        )}
        <p className="text-sm">{toast.message}</p>
      </div>
      <button
        onClick={handleRemove}
        className={cn(
          'shrink-0 p-1',
          'rounded-[var(--radius-sm)]',
          'hover:bg-black/10',
          'transition-colors duration-[var(--duration-fast)]'
        )}
        aria-label="닫기"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const { toasts, remove } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      className={cn(
        'fixed top-4 right-4 z-[var(--z-toast)]',
        'flex flex-col gap-2',
        // 모바일에서는 전체 너비
        'left-4 sm:left-auto'
      )}
      aria-live="polite"
      aria-label="알림"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={remove} />
      ))}
    </div>
  );
}

export default ToastContainer;
