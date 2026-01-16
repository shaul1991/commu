'use client';

import { MainLayout } from '@/components/templates';
import { Button, Avatar } from '@/components/atoms';
import {
  User,
  Edit3,
  Lock,
  Bell,
  FileText,
  MessageSquare,
  Heart,
  Bookmark,
  LogOut,
  ChevronRight,
  Loader2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRequireAuth, useAuth } from '@/hooks';
import { useState } from 'react';
import { SessionManager } from '@/components/molecules';

interface MenuItem {
  icon: typeof User;
  label: string;
  description?: string;
  href: string;
}

const profileMenu: MenuItem[] = [
  {
    icon: Edit3,
    label: '프로필 수정',
    description: '이름, 소개, 프로필 사진 변경',
    href: '/mypage/edit',
  },
  {
    icon: Lock,
    label: '비밀번호 변경',
    description: '계정 비밀번호 변경',
    href: '/mypage/password',
  },
  {
    icon: Bell,
    label: '알림 설정',
    description: '알림 수신 방법 및 유형 관리',
    href: '/mypage/notifications',
  },
];

const activityMenu: MenuItem[] = [
  {
    icon: FileText,
    label: '내 게시글',
    href: '/mypage/posts',
  },
  {
    icon: MessageSquare,
    label: '내 댓글',
    href: '/mypage/comments',
  },
  {
    icon: Heart,
    label: '좋아요한 글',
    href: '/mypage/likes',
  },
  {
    icon: Bookmark,
    label: '북마크',
    href: '/mypage/bookmarks',
  },
];

export default function MyPage() {
  const router = useRouter();
  const { user, isLoading } = useRequireAuth();
  const { logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // 사용자 표시 정보 계산
  const displayName =
    user?.displayName ||
    (user?.firstName && user?.lastName
      ? `${user.lastName}${user.firstName}`
      : null) ||
    user?.email?.split('@')[0] ||
    '사용자';

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push('/');
    } finally {
      setIsLoggingOut(false);
      setShowLogoutConfirm(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary-500)]" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <User className="w-6 h-6 text-[var(--color-primary-500)]" />
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            마이페이지
          </h1>
        </div>
        <p className="mt-1 text-[var(--text-secondary)]">
          내 계정과 활동을 관리하세요
        </p>
      </div>

      {/* Profile Header */}
      <section className="mb-8">
        <div className="bg-[var(--bg-surface)] rounded-[var(--radius-lg)] border border-[var(--border-default)] p-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar
                name={displayName}
                src={user?.profileImage}
                size="xl"
              />
              <Link
                href="/mypage/edit"
                className="absolute bottom-0 right-0 p-1.5 bg-[var(--color-primary-500)] rounded-full text-white hover:bg-[var(--color-primary-600)] transition-colors"
                aria-label="프로필 이미지 편집"
              >
                <Edit3 className="w-3 h-3" />
              </Link>
            </div>
            <div className="flex-1">
              <p className="text-lg font-semibold text-[var(--text-primary)]">
                {displayName}
              </p>
              <p className="text-sm text-[var(--text-tertiary)]">
                {user?.email}
              </p>
              <div className="mt-2 flex items-center gap-1">
                {user?.isEmailVerified ? (
                  <span className="inline-flex items-center gap-1 text-xs text-[var(--color-success-600)] bg-[var(--color-success-50)] px-2 py-0.5 rounded-full">
                    <CheckCircle className="w-3 h-3" />
                    이메일 인증됨
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs text-[var(--color-warning-600)] bg-[var(--color-warning-50)] px-2 py-0.5 rounded-full">
                    <AlertCircle className="w-3 h-3" />
                    이메일 미인증
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Management Section */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-3">
          프로필 관리
        </h2>
        <div className="bg-[var(--bg-surface)] rounded-[var(--radius-lg)] border border-[var(--border-default)] overflow-hidden">
          {profileMenu.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 p-4 hover:bg-[var(--bg-hover)] transition-colors ${
                  index < profileMenu.length - 1
                    ? 'border-b border-[var(--border-default)]'
                    : ''
                }`}
              >
                <div className="p-2 bg-[var(--bg-muted)] rounded-[var(--radius-md)]">
                  <Icon className="w-5 h-5 text-[var(--text-secondary)]" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-[var(--text-primary)]">
                    {item.label}
                  </p>
                  {item.description && (
                    <p className="text-sm text-[var(--text-tertiary)]">
                      {item.description}
                    </p>
                  )}
                </div>
                <ChevronRight className="w-5 h-5 text-[var(--text-tertiary)]" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* Activity Section */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-3">
          내 활동
        </h2>
        <div className="bg-[var(--bg-surface)] rounded-[var(--radius-lg)] border border-[var(--border-default)] overflow-hidden">
          {activityMenu.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 p-4 hover:bg-[var(--bg-hover)] transition-colors ${
                  index < activityMenu.length - 1
                    ? 'border-b border-[var(--border-default)]'
                    : ''
                }`}
              >
                <div className="p-2 bg-[var(--bg-muted)] rounded-[var(--radius-md)]">
                  <Icon className="w-5 h-5 text-[var(--text-secondary)]" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-[var(--text-primary)]">
                    {item.label}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-[var(--text-tertiary)]" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* Connected Devices Section */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-3">
          보안
        </h2>
        <SessionManager />
      </section>

      {/* Account Section */}
      <section>
        <h2 className="text-sm font-semibold text-[var(--color-error-500)] uppercase tracking-wider mb-3">
          계정
        </h2>
        <div className="bg-[var(--bg-surface)] rounded-[var(--radius-lg)] border border-[var(--color-error-200)] p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-[var(--text-primary)]">로그아웃</p>
              <p className="text-sm text-[var(--text-tertiary)]">
                현재 기기에서 로그아웃합니다
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowLogoutConfirm(true)}
              className="text-[var(--color-error-500)] hover:bg-[var(--color-error-50)]"
            >
              <LogOut className="w-4 h-4 mr-1" />
              로그아웃
            </Button>
          </div>
        </div>
      </section>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[var(--bg-surface)] rounded-[var(--radius-lg)] p-6 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
              로그아웃 하시겠습니까?
            </h3>
            <p className="text-sm text-[var(--text-secondary)] mb-6">
              로그아웃하면 다시 로그인해야 합니다.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowLogoutConfirm(false)}
                disabled={isLoggingOut}
              >
                취소
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    로그아웃 중...
                  </>
                ) : (
                  '로그아웃'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
