import { renderHook, act, waitFor } from '@testing-library/react';
import { useAuth } from '../useAuth';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/stores/authStore';

// Mock modules
jest.mock('@/lib/api/auth');
jest.mock('@/stores/authStore');

const mockAuthApi = authApi as jest.Mocked<typeof authApi>;
const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;

describe('useAuth Hook', () => {
  const mockUser = {
    id: '1',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    isEmailVerified: true,
  };

  const mockSetUser = jest.fn();
  const mockSetAccessToken = jest.fn();
  const mockLogout = jest.fn();
  const mockSetLoading = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseAuthStore.mockReturnValue({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      setUser: mockSetUser,
      setAccessToken: mockSetAccessToken,
      logout: mockLogout,
      setLoading: mockSetLoading,
    });
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      mockAuthApi.login.mockResolvedValue({
        data: {
          accessToken: 'test-token',
          expiresIn: 3600,
          user: mockUser,
        },
        error: null,
      });

      const { result } = renderHook(() => useAuth());

      let loginResult: any;
      await act(async () => {
        loginResult = await result.current.login({
          email: 'test@example.com',
          password: 'password123',
        });
      });

      expect(loginResult.success).toBe(true);
      expect(mockSetAccessToken).toHaveBeenCalledWith('test-token');
      expect(mockSetUser).toHaveBeenCalledWith(mockUser);
    });

    it('should return error on invalid credentials', async () => {
      mockAuthApi.login.mockResolvedValue({
        data: null,
        error: '이메일 또는 비밀번호가 올바르지 않습니다.',
      });

      const { result } = renderHook(() => useAuth());

      let loginResult: any;
      await act(async () => {
        loginResult = await result.current.login({
          email: 'test@example.com',
          password: 'wrongpassword',
        });
      });

      expect(loginResult.success).toBe(false);
      expect(loginResult.error).toBe('이메일 또는 비밀번호가 올바르지 않습니다.');
    });

    it('should handle network error', async () => {
      mockAuthApi.login.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useAuth());

      let loginResult: any;
      await act(async () => {
        loginResult = await result.current.login({
          email: 'test@example.com',
          password: 'password123',
        });
      });

      expect(loginResult.success).toBe(false);
      expect(loginResult.error).toBe('로그인에 실패했습니다.');
    });
  });

  describe('register', () => {
    it('should register successfully', async () => {
      mockAuthApi.register.mockResolvedValue({
        data: mockUser,
        error: null,
      });

      const { result } = renderHook(() => useAuth());

      let registerResult: any;
      await act(async () => {
        registerResult = await result.current.register({
          email: 'test@example.com',
          password: 'Password123!',
          firstName: 'Test',
          lastName: 'User',
        });
      });

      expect(registerResult.success).toBe(true);
    });

    it('should return error on duplicate email', async () => {
      mockAuthApi.register.mockResolvedValue({
        data: null,
        error: '이미 사용 중인 이메일입니다.',
      });

      const { result } = renderHook(() => useAuth());

      let registerResult: any;
      await act(async () => {
        registerResult = await result.current.register({
          email: 'existing@example.com',
          password: 'Password123!',
        });
      });

      expect(registerResult.success).toBe(false);
      expect(registerResult.error).toBe('이미 사용 중인 이메일입니다.');
    });
  });

  describe('logout', () => {
    it('should logout and clear state', async () => {
      mockAuthApi.logout.mockResolvedValue({
        data: { message: '로그아웃되었습니다.' },
        error: null,
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.logout();
      });

      expect(mockLogout).toHaveBeenCalled();
    });
  });

  describe('handleOAuthCallback', () => {
    it('should handle OAuth callback and fetch user info', async () => {
      mockAuthApi.getMe.mockResolvedValue({
        data: mockUser,
        error: null,
      });

      const { result } = renderHook(() => useAuth());

      let callbackResult: any;
      await act(async () => {
        callbackResult = await result.current.handleOAuthCallback('oauth-token');
      });

      expect(callbackResult.success).toBe(true);
      expect(mockSetAccessToken).toHaveBeenCalledWith('oauth-token');
      expect(mockSetUser).toHaveBeenCalledWith(mockUser);
    });

    it('should handle failed user info fetch', async () => {
      mockAuthApi.getMe.mockResolvedValue({
        data: null,
        error: '사용자 정보를 가져올 수 없습니다.',
      });

      const { result } = renderHook(() => useAuth());

      let callbackResult: any;
      await act(async () => {
        callbackResult = await result.current.handleOAuthCallback('invalid-token');
      });

      expect(callbackResult.success).toBe(false);
    });
  });
});
