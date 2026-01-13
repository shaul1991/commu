'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

const footerLinks = {
  service: [
    { label: '서비스 소개', href: '/about' },
    { label: '이용약관', href: '/terms' },
    { label: '개인정보처리방침', href: '/privacy' },
    { label: '고객센터', href: '/support' },
  ],
  community: [
    { label: '공지사항', href: '/notice' },
    { label: '자주 묻는 질문', href: '/faq' },
    { label: '문의하기', href: '/contact' },
  ],
  social: [
    { label: 'GitHub', href: 'https://github.com', external: true },
    { label: 'Twitter', href: 'https://twitter.com', external: true },
    { label: 'Discord', href: 'https://discord.com', external: true },
  ],
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={cn(
        'bg-[var(--bg-surface)]',
        'border-t border-[var(--border-default)]',
        'mt-auto'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[var(--color-primary-500)] rounded-[var(--radius-md)] flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-bold text-[var(--text-primary)]">
                커뮤
              </span>
            </Link>
            <p className="text-sm text-[var(--text-secondary)] max-w-xs">
              개발자들을 위한 커뮤니티 플랫폼. 지식을 나누고 함께 성장하세요.
            </p>
          </div>

          {/* Service Links */}
          <div>
            <h3 className="font-semibold text-[var(--text-primary)] mb-3">
              서비스
            </h3>
            <ul className="space-y-2">
              {footerLinks.service.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      'text-sm text-[var(--text-secondary)]',
                      'hover:text-[var(--text-primary)]',
                      'transition-colors duration-[var(--duration-fast)]'
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community Links */}
          <div>
            <h3 className="font-semibold text-[var(--text-primary)] mb-3">
              커뮤니티
            </h3>
            <ul className="space-y-2">
              {footerLinks.community.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      'text-sm text-[var(--text-secondary)]',
                      'hover:text-[var(--text-primary)]',
                      'transition-colors duration-[var(--duration-fast)]'
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="font-semibold text-[var(--text-primary)] mb-3">
              소셜
            </h3>
            <ul className="space-y-2">
              {footerLinks.social.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'text-sm text-[var(--text-secondary)]',
                      'hover:text-[var(--text-primary)]',
                      'transition-colors duration-[var(--duration-fast)]'
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div
          className={cn(
            'pt-8',
            'border-t border-[var(--border-default)]',
            'flex flex-col md:flex-row items-center justify-between gap-4'
          )}
        >
          <p className="text-sm text-[var(--text-tertiary)]">
            &copy; {currentYear} 커뮤. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/terms"
              className="text-sm text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
            >
              이용약관
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
            >
              개인정보처리방침
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
