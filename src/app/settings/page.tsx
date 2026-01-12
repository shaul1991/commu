'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/templates';
import { Button, Avatar } from '@/components/atoms';
import { Settings, User, Bell, Shield, Palette, LogOut, ChevronRight, Moon, Sun, Monitor } from 'lucide-react';
import Link from 'next/link';

type ThemeMode = 'light' | 'dark' | 'system';

interface SettingItem {
  icon: typeof User;
  label: string;
  description: string;
  href: string;
}

const settingsMenu: SettingItem[] = [
  {
    icon: User,
    label: '프로필 설정',
    description: '이름, 소개, 프로필 사진 변경',
    href: '/settings/profile',
  },
  {
    icon: Bell,
    label: '알림 설정',
    description: '알림 수신 방법 및 유형 관리',
    href: '/settings/notifications',
  },
  {
    icon: Shield,
    label: '개인정보 및 보안',
    description: '비밀번호 변경, 2단계 인증',
    href: '/settings/security',
  },
];

export default function SettingsPage() {
  const [theme, setTheme] = useState<ThemeMode>('system');

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    // In real implementation, this would update the theme
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (newTheme === 'light') {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <MainLayout>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Settings className="w-6 h-6 text-[var(--color-primary-500)]" />
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">설정</h1>
        </div>
        <p className="mt-1 text-[var(--text-secondary)]">
          계정 및 앱 설정을 관리하세요
        </p>
      </div>

      {/* Account Section */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-3">
          계정
        </h2>
        <div className="bg-[var(--bg-surface)] rounded-[var(--radius-lg)] border border-[var(--border-default)] overflow-hidden">
          {/* Current User */}
          <div className="p-4 border-b border-[var(--border-default)]">
            <div className="flex items-center gap-4">
              <Avatar name="홍길동" size="lg" />
              <div className="flex-1">
                <p className="font-medium text-[var(--text-primary)]">홍길동</p>
                <p className="text-sm text-[var(--text-tertiary)]">@honggildong</p>
              </div>
              <Link href="/settings/profile">
                <Button variant="secondary" size="sm">편집</Button>
              </Link>
            </div>
          </div>

          {/* Settings Menu */}
          {settingsMenu.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 p-4 hover:bg-[var(--bg-hover)] transition-colors ${
                  index < settingsMenu.length - 1 ? 'border-b border-[var(--border-default)]' : ''
                }`}
              >
                <div className="p-2 bg-[var(--bg-muted)] rounded-[var(--radius-md)]">
                  <Icon className="w-5 h-5 text-[var(--text-secondary)]" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-[var(--text-primary)]">{item.label}</p>
                  <p className="text-sm text-[var(--text-tertiary)]">{item.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-[var(--text-tertiary)]" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* Appearance Section */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-3 flex items-center gap-2">
          <Palette className="w-4 h-4" />
          테마
        </h2>
        <div className="bg-[var(--bg-surface)] rounded-[var(--radius-lg)] border border-[var(--border-default)] p-4">
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            앱의 외관을 설정합니다. 시스템 설정에 따라 자동으로 변경되도록 할 수도 있습니다.
          </p>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handleThemeChange('light')}
              className={`p-4 rounded-[var(--radius-md)] border-2 transition-colors flex flex-col items-center gap-2 ${
                theme === 'light'
                  ? 'border-[var(--color-primary-500)] bg-[var(--color-primary-50)]'
                  : 'border-[var(--border-default)] hover:border-[var(--border-strong)]'
              }`}
            >
              <Sun className="w-6 h-6" />
              <span className="text-sm font-medium">라이트</span>
            </button>
            <button
              onClick={() => handleThemeChange('dark')}
              className={`p-4 rounded-[var(--radius-md)] border-2 transition-colors flex flex-col items-center gap-2 ${
                theme === 'dark'
                  ? 'border-[var(--color-primary-500)] bg-[var(--color-primary-50)]'
                  : 'border-[var(--border-default)] hover:border-[var(--border-strong)]'
              }`}
            >
              <Moon className="w-6 h-6" />
              <span className="text-sm font-medium">다크</span>
            </button>
            <button
              onClick={() => handleThemeChange('system')}
              className={`p-4 rounded-[var(--radius-md)] border-2 transition-colors flex flex-col items-center gap-2 ${
                theme === 'system'
                  ? 'border-[var(--color-primary-500)] bg-[var(--color-primary-50)]'
                  : 'border-[var(--border-default)] hover:border-[var(--border-strong)]'
              }`}
            >
              <Monitor className="w-6 h-6" />
              <span className="text-sm font-medium">시스템</span>
            </button>
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section>
        <h2 className="text-sm font-semibold text-[var(--color-error-500)] uppercase tracking-wider mb-3">
          위험 구역
        </h2>
        <div className="bg-[var(--bg-surface)] rounded-[var(--radius-lg)] border border-[var(--color-error-200)] p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-[var(--text-primary)]">로그아웃</p>
              <p className="text-sm text-[var(--text-tertiary)]">
                현재 기기에서 로그아웃합니다
              </p>
            </div>
            <Button variant="secondary" size="sm" className="text-[var(--color-error-500)] hover:bg-[var(--color-error-50)]">
              <LogOut className="w-4 h-4 mr-1" />
              로그아웃
            </Button>
          </div>
        </div>
      </section>

      {/* App Info */}
      <div className="mt-8 text-center text-sm text-[var(--text-tertiary)]">
        <p>커뮤 v0.1.0</p>
        <p className="mt-1">
          <a href="/terms" className="hover:underline">이용약관</a>
          {' · '}
          <a href="/privacy" className="hover:underline">개인정보처리방침</a>
        </p>
      </div>
    </MainLayout>
  );
}
