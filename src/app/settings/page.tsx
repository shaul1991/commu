'use client';

import { MainLayout } from '@/components/templates';
import { Settings, Info, ExternalLink } from 'lucide-react';

export default function SettingsPage() {
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

      {/* 테마 섹션 - 다크모드 복구 시 활성화
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-3 flex items-center gap-2">
          <Palette className="w-4 h-4" />
          테마
        </h2>
        ...
      </section>
      */}

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
