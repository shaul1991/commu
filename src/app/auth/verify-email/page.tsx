'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/atoms';
import { authApi } from '@/lib/api/auth';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setStatus('error');
        setMessage('유효하지 않은 인증 링크입니다.');
        return;
      }

      try {
        await authApi.verifyEmail(token);
        setStatus('success');
        setMessage('이메일 인증이 완료되었습니다!');
      } catch (error: any) {
        setStatus('error');
        if (error.response?.status === 400) {
          setMessage('만료되었거나 이미 사용된 인증 링크입니다.');
        } else {
          setMessage('이메일 인증에 실패했습니다. 다시 시도해주세요.');
        }
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto" />
            <p className="text-gray-600 dark:text-gray-400">이메일 인증 중...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              인증 완료!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">{message}</p>
            <Link href="/auth/login">
              <Button variant="primary" size="lg">
                로그인하기
              </Button>
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              인증 실패
            </h2>
            <p className="text-gray-600 dark:text-gray-400">{message}</p>
            <div className="space-y-3">
              <Link href="/auth/login">
                <Button variant="primary" size="lg" className="w-full">
                  로그인 페이지로
                </Button>
              </Link>
              <button
                onClick={() => router.push('/auth/resend-verification')}
                className="text-purple-600 hover:underline text-sm"
              >
                인증 메일 재발송
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
