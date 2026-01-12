'use client';

import { useState, type ReactNode } from 'react';
import { Header, Sidebar, BottomNav } from '@/components/organisms';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--bg-page)]">
      {/* Skip Link */}
      <a href="#main-content" className="skip-link">
        본문으로 건너뛰기
      </a>

      {/* Header */}
      <Header onMenuClick={() => setSidebarOpen(true)} />

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main
        id="main-content"
        tabIndex={-1}
        className={cn(
          'pt-14 md:pt-16', // Header height offset
          'pb-16 lg:pb-0', // Bottom nav offset (mobile only)
          'lg:pl-60', // Sidebar width offset (desktop)
          'min-h-screen'
        )}
      >
        <div className="max-w-4xl mx-auto p-4 md:p-6">
          {children}
        </div>
      </main>

      {/* Bottom Navigation (Mobile) */}
      <BottomNav />
    </div>
  );
}

export default MainLayout;
