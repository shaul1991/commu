'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './useAuth';

/**
 * 인증이 필요한 페이지에서 사용하는 훅
 * 비로그인 상태면 로그인 페이지로 리다이렉트
 */
export function useRequireAuth(redirectTo = '/auth/login') {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  return { user, isLoading, isAuthenticated };
}

/**
 * 비로그인 사용자만 접근 가능한 페이지에서 사용하는 훅
 * 로그인 상태면 홈으로 리다이렉트
 */
export function useRedirectIfAuthenticated(redirectTo = '/') {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  return { isLoading, isAuthenticated };
}
