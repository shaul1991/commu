'use client';

import { WifiOff, RefreshCw } from 'lucide-react';

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--bg-page)]">
      <div className="text-center max-w-md">
        {/* 아이콘 */}
        <div className="w-20 h-20 mx-auto mb-6 bg-[var(--bg-surface-secondary)] rounded-full flex items-center justify-center">
          <WifiOff className="w-10 h-10 text-[var(--text-tertiary)]" />
        </div>

        {/* 제목 */}
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
          오프라인 상태입니다
        </h1>

        {/* 설명 */}
        <p className="text-[var(--text-secondary)] mb-8">
          인터넷 연결을 확인한 후 다시 시도해 주세요.
          <br />
          연결이 복구되면 자동으로 새로고침됩니다.
        </p>

        {/* 새로고침 버튼 */}
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-primary-500)] text-white rounded-[var(--radius-lg)] hover:bg-[var(--color-primary-600)] transition-colors touch-target"
        >
          <RefreshCw className="w-5 h-5" />
          <span className="font-medium">다시 시도</span>
        </button>

        {/* 도움말 */}
        <div className="mt-8 p-4 bg-[var(--bg-surface-secondary)] rounded-[var(--radius-lg)]">
          <p className="text-sm text-[var(--text-tertiary)]">
            Wi-Fi 또는 모바일 데이터 연결을 확인해 주세요.
            <br />
            비행기 모드가 켜져 있다면 끄고 다시 시도해 주세요.
          </p>
        </div>
      </div>
    </div>
  );
}
