'use client';

import { MainLayout } from '@/components/templates';
import { Settings, Palette, Moon, Sun, Monitor, Info, ExternalLink } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

type ThemeMode = 'light' | 'dark' | 'system';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
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
          앱 환경을 설정하세요
        </p>
      </div>

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
              aria-label="라이트 모드"
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
              aria-label="다크 모드"
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
              aria-label="시스템 설정 따르기"
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

      {/* App Info Section */}
      <section>
        <h2 className="text-sm font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-3 flex items-center gap-2">
          <Info className="w-4 h-4" />
          앱 정보
        </h2>
        <div className="bg-[var(--bg-surface)] rounded-[var(--radius-lg)] border border-[var(--border-default)] overflow-hidden">
          {/* Version */}
          <div className="flex items-center justify-between p-4 border-b border-[var(--border-default)]">
            <span className="text-[var(--text-primary)]">버전</span>
            <span className="text-[var(--text-tertiary)]">v0.1.0</span>
          </div>

          {/* Terms of Service */}
          <a
            href="/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 border-b border-[var(--border-default)] hover:bg-[var(--bg-hover)] transition-colors"
          >
            <span className="text-[var(--text-primary)]">이용약관</span>
            <ExternalLink className="w-4 h-4 text-[var(--text-tertiary)]" />
          </a>

          {/* Privacy Policy */}
          <a
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 hover:bg-[var(--bg-hover)] transition-colors"
          >
            <span className="text-[var(--text-primary)]">개인정보처리방침</span>
            <ExternalLink className="w-4 h-4 text-[var(--text-tertiary)]" />
          </a>
        </div>
      </section>
    </MainLayout>
  );
}
