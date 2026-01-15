/**
 * Settings 페이지 TDD 테스트
 * 변경: 비로그인 사용자도 접근 가능하도록 수정됨
 * 변경: 테마 선택 UI 숨김 처리 (다크모드 복구 시 테스트 활성화)
 */

import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import SettingsPage from '../page';

// Mock Next.js components
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

describe('Settings Page (비로그인 접근 가능)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('접근 제어', () => {
    it('인증 없이 페이지가 렌더링되어야 함', () => {
      render(<SettingsPage />);
      expect(screen.getByText('설정')).toBeInTheDocument();
    });
  });

  // 테마 설정 테스트 - 다크모드 UI 복구 시 활성화
  // describe('테마 설정', () => {
  //   it('테마 섹션이 표시되어야 함', () => {
  //     render(<SettingsPage />);
  //     expect(screen.getByText('테마')).toBeInTheDocument();
  //   });
  //   ... (테마 관련 테스트들)
  // });

  describe('앱 정보', () => {
    it('앱 버전이 표시되어야 함', () => {
      render(<SettingsPage />);
      expect(screen.getByText('v0.1.0')).toBeInTheDocument();
    });

    it('이용약관 링크가 있어야 함', () => {
      render(<SettingsPage />);
      const link = screen.getByText('이용약관').closest('a');
      expect(link).toHaveAttribute('href', '/terms');
    });

    it('개인정보처리방침 링크가 있어야 함', () => {
      render(<SettingsPage />);
      const link = screen.getByText('개인정보처리방침').closest('a');
      expect(link).toHaveAttribute('href', '/privacy');
    });
  });

  describe('계정 관련 기능이 없어야 함', () => {
    it('로그아웃 버튼이 없어야 함', () => {
      render(<SettingsPage />);
      expect(screen.queryByText('로그아웃')).not.toBeInTheDocument();
    });

    it('프로필 설정 링크가 없어야 함', () => {
      render(<SettingsPage />);
      expect(screen.queryByText('프로필 설정')).not.toBeInTheDocument();
    });

    it('계정 섹션이 없어야 함', () => {
      render(<SettingsPage />);
      expect(screen.queryByText('계정')).not.toBeInTheDocument();
    });
  });
});
