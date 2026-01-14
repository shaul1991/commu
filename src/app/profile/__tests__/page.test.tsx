import { render, screen } from '@testing-library/react';
import { vi, MockedFunction } from 'vitest';
import ProfilePage from '../page';
import { useRequireAuth } from '@/hooks';

// Mock hooks
vi.mock('@/hooks', () => ({
  useRequireAuth: vi.fn(),
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
  Button: ({ children, ...props }: { children: React.ReactNode }) => <button {...props}>{children}</button>,
  Badge: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
  Avatar: ({ name, src }: { name: string; src?: string }) => <div data-testid="avatar" data-name={name} data-src={src}>{name.charAt(0)}</div>,
}));

const mockUseRequireAuth = useRequireAuth as MockedFunction<typeof useRequireAuth>;

describe('Profile Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('로딩 상태', () => {
    it('로딩 중일 때 로딩 스피너 표시', () => {
      mockUseRequireAuth.mockReturnValue({
        user: null,
        isLoading: true,
        isAuthenticated: false,
      });

      render(<ProfilePage />);

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

      render(<ProfilePage />);

      // 이름 표시 확인
      expect(screen.getByText('홍길동')).toBeInTheDocument();
      // @username 표시 확인
      expect(screen.getByText('@test')).toBeInTheDocument();
      // 이메일 표시 확인
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
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

      render(<ProfilePage />);

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

      render(<ProfilePage />);

      expect(screen.getByText('onlyemail')).toBeInTheDocument();
      expect(screen.getByText('@onlyemail')).toBeInTheDocument();
    });

    it('이메일 인증됨 표시', () => {
      mockUseRequireAuth.mockReturnValue({
        user: {
          id: '1',
          email: 'verified@example.com',
          isEmailVerified: true,
        },
        isLoading: false,
        isAuthenticated: true,
      });

      render(<ProfilePage />);

      expect(screen.getByText('이메일 인증됨')).toBeInTheDocument();
    });

    it('이메일 미인증 시 인증됨 표시 없음', () => {
      mockUseRequireAuth.mockReturnValue({
        user: {
          id: '1',
          email: 'unverified@example.com',
          isEmailVerified: false,
        },
        isLoading: false,
        isAuthenticated: true,
      });

      render(<ProfilePage />);

      expect(screen.queryByText('이메일 인증됨')).not.toBeInTheDocument();
    });

    it('프로필 수정 버튼이 /settings/profile로 링크됨', () => {
      mockUseRequireAuth.mockReturnValue({
        user: {
          id: '1',
          email: 'test@example.com',
          isEmailVerified: true,
        },
        isLoading: false,
        isAuthenticated: true,
      });

      render(<ProfilePage />);

      const editLink = screen.getByRole('link', { name: /프로필 수정/i });
      expect(editLink).toHaveAttribute('href', '/settings/profile');
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

      render(<ProfilePage />);

      const avatar = screen.getByTestId('avatar');
      expect(avatar).toHaveAttribute('data-name', '홍길동');
      expect(avatar).toHaveAttribute('data-src', 'https://example.com/avatar.jpg');
    });
  });
});
