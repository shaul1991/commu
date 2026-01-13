'use client';

import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { authApi, LoginRequest, RegisterRequest } from '@/lib/api/auth';

export function useAuth() {
  const router = useRouter();
  const {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    login: setLogin,
    logout: setLogout,
    setLoading,
  } = useAuthStore();

  // 초기 인증 상태 확인
  useEffect(() => {
    const checkAuth = async () => {
      if (accessToken && !user) {
        const response = await authApi.getMe();
        if (response.success && response.data) {
          setLogin(response.data, accessToken);
        } else {
          setLogout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [accessToken, user, setLogin, setLogout, setLoading]);

  const login = useCallback(
    async (data: LoginRequest) => {
      const response = await authApi.login(data);

      if (response.success && response.data) {
        // 로그인 성공 후 새로 받은 토큰으로 사용자 정보 조회
        const meResponse = await authApi.getMe(response.data.accessToken);
        if (meResponse.success && meResponse.data) {
          setLogin(meResponse.data, response.data.accessToken);
          return { success: true };
        }
      }

      return {
        success: false,
        error: response.error?.message || '로그인에 실패했습니다.',
      };
    },
    [setLogin]
  );

  const register = useCallback(async (data: RegisterRequest) => {
    const response = await authApi.register(data);

    if (response.success) {
      return { success: true, message: '회원가입이 완료되었습니다. 이메일을 확인해주세요.' };
    }

    return {
      success: false,
      error: response.error?.message || '회원가입에 실패했습니다.',
    };
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setLogout();
    router.push('/');
  }, [setLogout, router]);

  const handleOAuthCallback = useCallback(
    async (accessToken: string) => {
      // OAuth 콜백으로 받은 토큰으로 사용자 정보 조회
      const meResponse = await authApi.getMe(accessToken);
      if (meResponse.success && meResponse.data) {
        setLogin(meResponse.data, accessToken);
        return { success: true };
      }
      return { success: false };
    },
    [setLogin]
  );

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    handleOAuthCallback,
  };
}
