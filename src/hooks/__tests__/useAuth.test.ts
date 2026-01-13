import { renderHook, act } from '@testing-library/react';
import { vi, Mock, MockedFunction } from 'vitest';
import { useAuth } from '../useAuth';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/stores/authStore';

// Mock modules
vi.mock('@/lib/api/auth');
vi.mock('@/stores/authStore');

// Mock Next.js router
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
}));

const mockAuthApi = authApi as { [K in keyof typeof authApi]: Mock };
const mockUseAuthStore = useAuthStore as MockedFunction<typeof useAuthStore>;

describe('useAuth Hook', () => {
  const mockUser = {
    id: '1',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    isEmailVerified: true,
  };

  const mockSetLogin = vi.fn();
  const mockSetLogout = vi.fn();
  const mockSetLoading = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseAuthStore.mockReturnValue({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      login: mockSetLogin,
      logout: mockSetLogout,
      setLoading: mockSetLoading,
    });
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      mockAuthApi.login.mockResolvedValue({
        success: true,
        data: {
          accessToken: 'test-token',
          expiresIn: 3600,
        },
      });
      mockAuthApi.getMe.mockResolvedValue({
        success: true,
        data: mockUser,
      });

      const { result } = renderHook(() => useAuth());

      let loginResult: { success: boolean; error?: string };
      await act(async () => {
        loginResult = await result.current.login({
          email: 'test@example.com',
          password: 'password123',
        });
      });

      expect(loginResult!.success).toBe(true);
      expect(mockSetLogin).toHaveBeenCalledWith(mockUser, 'test-token');
    });

    it('should return error on invalid credentials', async () => {
      mockAuthApi.login.mockResolvedValue({
        success: false,
        error: { message: '이메일 또는 비밀번호가 올바르지 않습니다.' },
      });

      const { result } = renderHook(() => useAuth());

      let loginResult: { success: boolean; error?: string };
      await act(async () => {
        loginResult = await result.current.login({
          email: 'test@example.com',
          password: 'wrongpassword',
        });
      });

      expect(loginResult!.success).toBe(false);
      expect(loginResult!.error).toBe('이메일 또는 비밀번호가 올바르지 않습니다.');
    });

    it('should handle network error', async () => {
      mockAuthApi.login.mockResolvedValue({
        success: false,
        error: null,
      });

      const { result } = renderHook(() => useAuth());

      let loginResult: { success: boolean; error?: string };
      await act(async () => {
        loginResult = await result.current.login({
          email: 'test@example.com',
          password: 'password123',
        });
      });

      expect(loginResult!.success).toBe(false);
      expect(loginResult!.error).toBe('로그인에 실패했습니다.');
    });
  });

  describe('register', () => {
    it('should register successfully', async () => {
      mockAuthApi.register.mockResolvedValue({
        success: true,
        data: mockUser,
      });

      const { result } = renderHook(() => useAuth());

      let registerResult: { success: boolean; error?: string; message?: string };
      await act(async () => {
        registerResult = await result.current.register({
          email: 'test@example.com',
          password: 'Password123!',
          firstName: 'Test',
          lastName: 'User',
        });
      });

      expect(registerResult!.success).toBe(true);
      expect(registerResult!.message).toBe('회원가입이 완료되었습니다. 이메일을 확인해주세요.');
    });

    it('should return error on duplicate email', async () => {
      mockAuthApi.register.mockResolvedValue({
        success: false,
        error: { message: '이미 사용 중인 이메일입니다.' },
      });

      const { result } = renderHook(() => useAuth());

      let registerResult: { success: boolean; error?: string; message?: string };
      await act(async () => {
        registerResult = await result.current.register({
          email: 'existing@example.com',
          password: 'Password123!',
        });
      });

      expect(registerResult!.success).toBe(false);
      expect(registerResult!.error).toBe('이미 사용 중인 이메일입니다.');
    });
  });

  describe('logout', () => {
    it('should logout and clear state', async () => {
      mockAuthApi.logout.mockResolvedValue({
        success: true,
        data: { message: '로그아웃되었습니다.' },
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.logout();
      });

      expect(mockSetLogout).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  describe('handleOAuthCallback', () => {
    it('should handle OAuth callback and fetch user info', async () => {
      mockAuthApi.getMe.mockResolvedValue({
        success: true,
        data: mockUser,
      });

      const { result } = renderHook(() => useAuth());

      let callbackResult: { success: boolean };
      await act(async () => {
        callbackResult = await result.current.handleOAuthCallback('oauth-token');
      });

      expect(callbackResult!.success).toBe(true);
      expect(mockSetLogin).toHaveBeenCalledWith(mockUser, 'oauth-token');
    });

    it('should handle failed user info fetch', async () => {
      mockAuthApi.getMe.mockResolvedValue({
        success: false,
        error: { message: '사용자 정보를 가져올 수 없습니다.' },
      });

      const { result } = renderHook(() => useAuth());

      let callbackResult: { success: boolean };
      await act(async () => {
        callbackResult = await result.current.handleOAuthCallback('invalid-token');
      });

      expect(callbackResult!.success).toBe(false);
    });
  });
});
