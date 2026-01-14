import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, MockedFunction, beforeAll } from 'vitest';
import { Header } from '../Header';
import { useAuth } from '@/hooks';
import { ThemeProvider } from '@/contexts/ThemeContext';

// Mock window.matchMedia
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

// Mock useAuth hook
vi.mock('@/hooks', () => ({
  useAuth: vi.fn(),
}));

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
}));

const mockUseAuth = useAuth as MockedFunction<typeof useAuth>;

// Helper to render with providers
const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {ui}
    </ThemeProvider>
  );
};

describe('Header Component', () => {
  const mockLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('로그인 사용자 정보 표시', () => {
    it('로그인한 사용자의 이름이 표시됨', () => {
      mockUseAuth.mockReturnValue({
        user: {
          id: '1',
          email: 'test@example.com',
          firstName: '길동',
          lastName: '홍',
          isEmailVerified: true,
        },
        isAuthenticated: true,
        isLoading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: mockLogout,
        handleOAuthCallback: vi.fn(),
      });

      renderWithProviders(<Header />);

      // 사용자 메뉴 열기 (버튼에는 사용자 이름이 표시됨)
      const userButton = screen.getByRole('button', { name: /홍길동/i });
      fireEvent.click(userButton);

      // 사용자 이름 확인 (성+이름)
      expect(screen.getByText('홍길동')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });

    it('displayName이 있으면 우선 사용', () => {
      mockUseAuth.mockReturnValue({
        user: {
          id: '1',
          email: 'test@example.com',
          displayName: '닉네임유저',
          firstName: '길동',
          lastName: '홍',
          isEmailVerified: true,
        },
        isAuthenticated: true,
        isLoading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: mockLogout,
        handleOAuthCallback: vi.fn(),
      });

      renderWithProviders(<Header />);

      const userButton = screen.getByRole('button', { name: /닉네임유저/i });
      fireEvent.click(userButton);

      expect(screen.getByText('닉네임유저')).toBeInTheDocument();
    });

    it('이름이 없으면 이메일 앞부분 표시', () => {
      mockUseAuth.mockReturnValue({
        user: {
          id: '1',
          email: 'onlyemail@example.com',
          isEmailVerified: true,
        },
        isAuthenticated: true,
        isLoading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: mockLogout,
        handleOAuthCallback: vi.fn(),
      });

      renderWithProviders(<Header />);

      const userButton = screen.getByRole('button', { name: /onlyemail/i });
      fireEvent.click(userButton);

      expect(screen.getByText('onlyemail')).toBeInTheDocument();
    });

    it('로그아웃 버튼 클릭 시 logout 함수 호출', async () => {
      mockUseAuth.mockReturnValue({
        user: {
          id: '1',
          email: 'test@example.com',
          firstName: '길동',
          lastName: '홍',
          isEmailVerified: true,
        },
        isAuthenticated: true,
        isLoading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: mockLogout,
        handleOAuthCallback: vi.fn(),
      });

      renderWithProviders(<Header />);

      // 사용자 메뉴 열기
      const userButton = screen.getByRole('button', { name: /홍길동/i });
      fireEvent.click(userButton);

      // 로그아웃 버튼 클릭
      const logoutButton = screen.getByRole('button', { name: /로그아웃/i });
      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(mockLogout).toHaveBeenCalled();
      });
    });
  });

  describe('프로필 링크', () => {
    it('프로필 메뉴 클릭 시 /profile로 이동', () => {
      mockUseAuth.mockReturnValue({
        user: {
          id: '1',
          email: 'test@example.com',
          isEmailVerified: true,
        },
        isAuthenticated: true,
        isLoading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: mockLogout,
        handleOAuthCallback: vi.fn(),
      });

      renderWithProviders(<Header />);

      // 이름이 없으면 이메일 앞부분이 표시됨
      const userButton = screen.getByRole('button', { name: /test/i });
      fireEvent.click(userButton);

      const profileLink = screen.getByRole('link', { name: /프로필/i });
      expect(profileLink).toHaveAttribute('href', '/profile');
    });

    it('설정 메뉴 클릭 시 /settings로 이동', () => {
      mockUseAuth.mockReturnValue({
        user: {
          id: '1',
          email: 'test@example.com',
          isEmailVerified: true,
        },
        isAuthenticated: true,
        isLoading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: mockLogout,
        handleOAuthCallback: vi.fn(),
      });

      renderWithProviders(<Header />);

      // 이름이 없으면 이메일 앞부분이 표시됨
      const userButton = screen.getByRole('button', { name: /test/i });
      fireEvent.click(userButton);

      const settingsLink = screen.getByRole('link', { name: /설정/i });
      expect(settingsLink).toHaveAttribute('href', '/settings');
    });
  });
});
