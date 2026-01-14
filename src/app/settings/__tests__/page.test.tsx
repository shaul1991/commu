import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, MockedFunction } from 'vitest';
import SettingsPage from '../page';
import { useRequireAuth, useAuth } from '@/hooks';

// Mock hooks
vi.mock('@/hooks', () => ({
  useRequireAuth: vi.fn(),
  useAuth: vi.fn(),
}));

// Mock Next.js components
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock('@/components/templates', () => ({
  MainLayout: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>,
}));

vi.mock('@/components/atoms', () => ({
  Button: ({ children, onClick, ...props }: { children: React.ReactNode; onClick?: () => void }) => (
    <button onClick={onClick} {...props}>{children}</button>
  ),
  Avatar: ({ name, src }: { name: string; src?: string }) => (
    <div data-testid="avatar" data-name={name} data-src={src}>{name.charAt(0)}</div>
  ),
}));

const mockUseRequireAuth = useRequireAuth as MockedFunction<typeof useRequireAuth>;
const mockUseAuth = useAuth as MockedFunction<typeof useAuth>;

describe('Settings Page', () => {
  const mockLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: mockLogout,
      handleOAuthCallback: vi.fn(),
    });
  });

  describe('로딩 상태', () => {
    it('로딩 중일 때 로딩 스피너 표시', () => {
      mockUseRequireAuth.mockReturnValue({
        user: null,
        isLoading: true,
        isAuthenticated: false,
      });

      render(<SettingsPage />);

      expect(screen.getByTestId('main-layout')).toBeInTheDocument();
    });
  });

  describe('로그인 사용자 정보 표시', () => {
    it('성+이름 조합으로 displayName 표시', () => {
      mockUseRequireAuth.mockReturnValue({
        user: {
          id: '1',
          email: 'test@example.com',
          firstName: '길동',
          lastName: '홍',
          isEmailVerified: true,
        },
        isLoading: false,
        isAuthenticated: true,
      });

      render(<SettingsPage />);

      // 이름 표시 확인
      expect(screen.getByText('홍길동')).toBeInTheDocument();
      // @username 표시 확인
      expect(screen.getByText('@test')).toBeInTheDocument();
    });

    it('displayName이 있으면 우선 사용', () => {
      mockUseRequireAuth.mockReturnValue({
        user: {
          id: '1',
          email: 'test@example.com',
          displayName: '닉네임유저',
          firstName: '길동',
          lastName: '홍',
          isEmailVerified: true,
        },
        isLoading: false,
        isAuthenticated: true,
      });

      render(<SettingsPage />);

      expect(screen.getByText('닉네임유저')).toBeInTheDocument();
    });

    it('이름이 없으면 이메일 앞부분 사용', () => {
      mockUseRequireAuth.mockReturnValue({
        user: {
          id: '1',
          email: 'onlyemail@example.com',
          isEmailVerified: true,
        },
        isLoading: false,
        isAuthenticated: true,
      });

      render(<SettingsPage />);

      expect(screen.getByText('onlyemail')).toBeInTheDocument();
      expect(screen.getByText('@onlyemail')).toBeInTheDocument();
    });

    it('Avatar에 사용자 이름과 이미지가 전달됨', () => {
      mockUseRequireAuth.mockReturnValue({
        user: {
          id: '1',
          email: 'test@example.com',
          firstName: '길동',
          lastName: '홍',
          profileImage: 'https://example.com/avatar.jpg',
          isEmailVerified: true,
        },
        isLoading: false,
        isAuthenticated: true,
      });

      render(<SettingsPage />);

      const avatar = screen.getByTestId('avatar');
      expect(avatar).toHaveAttribute('data-name', '홍길동');
      expect(avatar).toHaveAttribute('data-src', 'https://example.com/avatar.jpg');
    });
  });

  describe('설정 메뉴 링크', () => {
    beforeEach(() => {
      mockUseRequireAuth.mockReturnValue({
        user: {
          id: '1',
          email: 'test@example.com',
          isEmailVerified: true,
        },
        isLoading: false,
        isAuthenticated: true,
      });
    });

    it('프로필 설정 링크', () => {
      render(<SettingsPage />);

      const profileLink = screen.getByRole('link', { name: /프로필 설정/i });
      expect(profileLink).toHaveAttribute('href', '/settings/profile');
    });

    it('알림 설정 링크', () => {
      render(<SettingsPage />);

      const notificationLink = screen.getByRole('link', { name: /알림 설정/i });
      expect(notificationLink).toHaveAttribute('href', '/settings/notifications');
    });

    it('개인정보 및 보안 링크', () => {
      render(<SettingsPage />);

      const securityLink = screen.getByRole('link', { name: /개인정보 및 보안/i });
      expect(securityLink).toHaveAttribute('href', '/settings/security');
    });
  });

  describe('로그아웃', () => {
    it('로그아웃 버튼 클릭 시 logout 함수 호출', async () => {
      mockUseRequireAuth.mockReturnValue({
        user: {
          id: '1',
          email: 'test@example.com',
          isEmailVerified: true,
        },
        isLoading: false,
        isAuthenticated: true,
      });

      render(<SettingsPage />);

      // 로그아웃 버튼 클릭
      const logoutButton = screen.getByRole('button', { name: /로그아웃/i });
      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(mockLogout).toHaveBeenCalled();
      });
    });
  });
});
