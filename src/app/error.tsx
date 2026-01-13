'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/atoms';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // 에러 로깅 서비스에 에러 전송
    console.error('Application error:', error);
  }, [error]);

  return (
    <div
      className={cn(
        'min-h-screen flex flex-col items-center justify-center',
        'bg-[var(--bg-page)] px-4'
      )}
    >
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div
          className={cn(
            'w-20 h-20 mx-auto mb-6',
            'flex items-center justify-center',
            'bg-[var(--color-error-50)] rounded-full'
          )}
        >
          <AlertTriangle className="w-10 h-10 text-[var(--color-error-500)]" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
          문제가 발생했습니다
        </h1>

        {/* Description */}
        <p className="text-[var(--text-secondary)] mb-6">
          페이지를 불러오는 중 오류가 발생했습니다.
          <br />
          잠시 후 다시 시도해주세요.
        </p>

        {/* Error Details (Development only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6 p-4 bg-[var(--bg-surface)] rounded-[var(--radius-lg)] text-left">
            <p className="text-xs font-mono text-[var(--color-error-500)] break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="mt-2 text-xs text-[var(--text-tertiary)]">
                Digest: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="primary"
            onClick={reset}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            다시 시도
          </Button>
          <Link href="/">
            <Button
              variant="secondary"
              leftIcon={<Home className="w-4 h-4" />}
            >
              홈으로 이동
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
