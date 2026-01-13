'use client';

import Link from 'next/link';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/atoms';
import { cn } from '@/lib/utils';

export default function NotFound() {
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
            'bg-[var(--color-warning-50)] rounded-full'
          )}
        >
          <FileQuestion className="w-10 h-10 text-[var(--color-warning-500)]" />
        </div>

        {/* 404 Number */}
        <p className="text-6xl font-bold text-[var(--text-tertiary)] mb-2">
          404
        </p>

        {/* Title */}
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
          페이지를 찾을 수 없습니다
        </h1>

        {/* Description */}
        <p className="text-[var(--text-secondary)] mb-8">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          <br />
          URL을 다시 확인해주세요.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/">
            <Button
              variant="primary"
              leftIcon={<Home className="w-4 h-4" />}
            >
              홈으로 이동
            </Button>
          </Link>
          <Button
            variant="secondary"
            onClick={() => window.history.back()}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            이전 페이지로
          </Button>
        </div>
      </div>
    </div>
  );
}
