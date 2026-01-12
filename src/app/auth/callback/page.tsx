'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { handleOAuthCallback } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processCallback = async () => {
      const accessToken = searchParams.get('accessToken');
      const errorParam = searchParams.get('error');
      const isNewUser = searchParams.get('isNewUser') === 'true';

      if (errorParam) {
        setError('소셜 로그인에 실패했습니다.');
        return;
      }

      if (!accessToken) {
        setError('인증 정보가 없습니다.');
        return;
      }

      const result = await handleOAuthCallback(accessToken);

      if (result.success) {
        if (isNewUser) {
          router.push('/settings/profile?welcome=true');
        } else {
          router.push('/');
        }
      } else {
        setError('로그인 처리에 실패했습니다.');
      }
    };

    processCallback();
  }, [searchParams, handleOAuthCallback, router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            로그인 실패
          </h2>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
          <button
            onClick={() => router.push('/auth/login')}
            className="text-purple-600 hover:underline"
          >
            다시 시도하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto" />
        <p className="text-gray-600 dark:text-gray-400">로그인 처리 중...</p>
      </div>
    </div>
  );
}
