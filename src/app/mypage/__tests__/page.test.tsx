/**
 * MyPage 페이지 TDD 테스트
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, MockedFunction } from 'vitest';
import MyPage from '../page';
import { useRequireAuth, useAuth } from '@/hooks';

// Mock hooks
vi.mock('@/hooks', () => ({
  useRequireAuth: vi.fn(),
  useAuth: vi.fn(),
}));

// Mock Next.js
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
  usePathname: () => '/mypage',
}));

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock('@/components/templates', () => ({
  MainLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="main-layout">{children}</div>
  ),
}));

vi.mock('@/components/atoms', () => ({
  Button: ({ children, onClick, ...props }: { children: React.ReactNode; onClick?: () => void }) => (
    <button onClick={onClick} {...props}>{children}</button>
  ),
  Avatar: ({ name, src, size }: { name: string; src?: string; size?: string }) => (
    <div data-testid="avatar" data-name={name} data-src={src} data-size={size}>
      {name.charAt(0)}
    </div>
  ),
}));

const mockUseRequireAuth = useRequireAuth as MockedFunction<typeof useRequireAuth>;
const mockUseAuth = useAuth as MockedFunction<typeof useAuth>;

describe('MyPage 페이지', () => {
  const mockLogout = vi.fn();
  const mockUser = {
    id: 'test-user-id',
    email: 'test@example.com',
    displayName: '테스트 사용자',
    firstName: '길동',
    lastName: '홍',
    profileImage: 'https://example.com/avatar.jpg',
    isEmailVerified: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: mockLogout,
      handleOAuthCallback: vi.fn(),
    });
    mockUseRequireAuth.mockReturnValue({
      user: mockUser,
      isLoading: false,
      isAuthenticated: true,
    });
  });

  describe('로딩 상태', () => {
    it('로딩 중일 때 로딩 스피너 표시', () => {
      mockUseRequireAuth.mockReturnValue({
        user: null,
        isLoading: true,
        isAuthenticated: false,
      });

      render(<MyPage />);
      expect(screen.getByTestId('main-layout')).toBeInTheDocument();
    });
  });

  describe('페이지 헤더', () => {
    it('마이페이지 제목이 표시되어야 함', () => {
      render(<MyPage />);
      expect(screen.getByText('마이페이지')).toBeInTheDocument();
    });
  });

  describe('프로필 표시', () => {
    it('사용자 닉네임이 표시되어야 함', () => {
      render(<MyPage />);
      expect(screen.getByText('테스트 사용자')).toBeInTheDocument();
    });

    it('사용자 이메일이 표시되어야 함', () => {
      render(<MyPage />);
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });

    it('이메일 인증 상태가 표시되어야 함 (인증됨)', () => {
      render(<MyPage />);
      expect(screen.getByText('이메일 인증됨')).toBeInTheDocument();
    });

    it('이메일 미인증 상태 표시', () => {
      mockUseRequireAuth.mockReturnValue({
        user: { ...mockUser, isEmailVerified: false },
        isLoading: false,
        isAuthenticated: true,
      });

      render(<MyPage />);
      expect(screen.getByText('이메일 미인증')).toBeInTheDocument();
    });

    it('displayName이 없으면 성+이름 조합 표시', () => {
      mockUseRequireAuth.mockReturnValue({
        user: { ...mockUser, displayName: undefined },
        isLoading: false,
        isAuthenticated: true,
      });

      render(<MyPage />);
      expect(screen.getByText('홍길동')).toBeInTheDocument();
    });
  });

  describe('프로필 관리 메뉴', () => {
    it('프로필 수정 링크가 있어야 함', () => {
      render(<MyPage />);
      const link = screen.getByText('프로필 수정').closest('a');
      expect(link).toHaveAttribute('href', '/mypage/edit');
    });

    it('비밀번호 변경 링크가 있어야 함', () => {
      render(<MyPage />);
      const link = screen.getByText('비밀번호 변경').closest('a');
      expect(link).toHaveAttribute('href', '/mypage/password');
    });

    it('알림 설정 링크가 있어야 함', () => {
      render(<MyPage />);
      const link = screen.getByText('알림 설정').closest('a');
      expect(link).toHaveAttribute('href', '/mypage/notifications');
    });
  });

  describe('내 활동 메뉴', () => {
    it('내 게시글 링크가 있어야 함', () => {
      render(<MyPage />);
      const link = screen.getByText('내 게시글').closest('a');
      expect(link).toHaveAttribute('href', '/mypage/posts');
    });

    it('내 댓글 링크가 있어야 함', () => {
      render(<MyPage />);
      const link = screen.getByText('내 댓글').closest('a');
      expect(link).toHaveAttribute('href', '/mypage/comments');
    });

    it('좋아요한 글 링크가 있어야 함', () => {
      render(<MyPage />);
      const link = screen.getByText('좋아요한 글').closest('a');
      expect(link).toHaveAttribute('href', '/mypage/likes');
    });

    it('북마크 링크가 있어야 함', () => {
      render(<MyPage />);
      const link = screen.getByText('북마크').closest('a');
      expect(link).toHaveAttribute('href', '/mypage/bookmarks');
    });
  });

  describe('로그아웃', () => {
    it('로그아웃 버튼이 있어야 함', () => {
      render(<MyPage />);
      expect(screen.getByRole('button', { name: /로그아웃/i })).toBeInTheDocument();
    });

    it('로그아웃 버튼 클릭 시 확인 다이얼로그가 표시되어야 함', async () => {
      render(<MyPage />);
      const logoutButton = screen.getByRole('button', { name: /로그아웃/i });
      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(screen.getByText('로그아웃 하시겠습니까?')).toBeInTheDocument();
      });
    });

    it('확인 다이얼로그에서 취소 클릭 시 다이얼로그가 닫혀야 함', async () => {
      render(<MyPage />);
      const logoutButton = screen.getByRole('button', { name: /로그아웃/i });
      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(screen.getByText('로그아웃 하시겠습니까?')).toBeInTheDocument();
      });

      const cancelButton = screen.getByRole('button', { name: '취소' });
      fireEvent.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryByText('로그아웃 하시겠습니까?')).not.toBeInTheDocument();
      });
    });
  });
});
