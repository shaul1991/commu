import { renderHook, waitFor } from '@testing-library/react';
import { vi, MockedFunction } from 'vitest';
import { useRequireAuth, useRedirectIfAuthenticated } from '../useRequireAuth';
import { useAuth } from '../useAuth';

// Mock useAuth hook
vi.mock('../useAuth');

// Mock Next.js router
const mockReplace = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: mockReplace,
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
}));

const mockUseAuth = useAuth as MockedFunction<typeof useAuth>;

describe('useRequireAuth Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('비로그인 상태', () => {
    it('로딩 중일 때는 리다이렉트하지 않음', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: true,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        handleOAuthCallback: vi.fn(),
      });

      renderHook(() => useRequireAuth());

      expect(mockReplace).not.toHaveBeenCalled();
    });

    it('로딩 완료 후 비로그인 시 로그인 페이지로 리다이렉트', async () => {
      mockUseAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        handleOAuthCallback: vi.fn(),
      });

      renderHook(() => useRequireAuth());

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith('/auth/login');
      });
    });

    it('커스텀 리다이렉트 경로 지원', async () => {
      mockUseAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        handleOAuthCallback: vi.fn(),
      });

      renderHook(() => useRequireAuth('/custom-login'));

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith('/custom-login');
      });
    });
  });

  describe('로그인 상태', () => {
    it('로그인 상태에서는 리다이렉트하지 않음', () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        isEmailVerified: true,
      };

      mockUseAuth.mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        handleOAuthCallback: vi.fn(),
      });

      const { result } = renderHook(() => useRequireAuth());

      expect(mockReplace).not.toHaveBeenCalled();
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockUser);
    });
  });
});

describe('useRedirectIfAuthenticated Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('비로그인 상태', () => {
    it('비로그인 시 리다이렉트하지 않음', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        handleOAuthCallback: vi.fn(),
      });

      const { result } = renderHook(() => useRedirectIfAuthenticated());

      expect(mockReplace).not.toHaveBeenCalled();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('로그인 상태', () => {
    it('로딩 중일 때는 리다이렉트하지 않음', () => {
      mockUseAuth.mockReturnValue({
        user: { id: '1', email: 'test@example.com' },
        isAuthenticated: true,
        isLoading: true,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        handleOAuthCallback: vi.fn(),
      });

      renderHook(() => useRedirectIfAuthenticated());

      expect(mockReplace).not.toHaveBeenCalled();
    });

    it('로그인 상태에서 홈으로 리다이렉트', async () => {
      mockUseAuth.mockReturnValue({
        user: { id: '1', email: 'test@example.com' },
        isAuthenticated: true,
        isLoading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        handleOAuthCallback: vi.fn(),
      });

      renderHook(() => useRedirectIfAuthenticated());

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith('/');
      });
    });

    it('커스텀 리다이렉트 경로 지원', async () => {
      mockUseAuth.mockReturnValue({
        user: { id: '1', email: 'test@example.com' },
        isAuthenticated: true,
        isLoading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        handleOAuthCallback: vi.fn(),
      });

      renderHook(() => useRedirectIfAuthenticated('/dashboard'));

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith('/dashboard');
      });
    });
  });
});
