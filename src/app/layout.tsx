import type { Metadata, Viewport } from 'next';
import { ThemeProvider } from '@/contexts/ThemeContext';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: '커뮤 - Commu',
    template: '%s | 커뮤',
  },
  description: '모던하고 클린한, MZ세대를 위한 신세대 커뮤니티',
  keywords: ['커뮤니티', '소셜', 'MZ', '커뮤'],
  authors: [{ name: 'Commu Team' }],
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: '커뮤',
    title: '커뮤 - Commu',
    description: '모던하고 클린한, MZ세대를 위한 신세대 커뮤니티',
  },
  twitter: {
    card: 'summary_large_image',
    title: '커뮤 - Commu',
    description: '모던하고 클린한, MZ세대를 위한 신세대 커뮤니티',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#111827' },
  ],
};

// Theme initialization script to prevent FOUC
const themeScript = `
  (function() {
    const theme = localStorage.getItem('commu-theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (theme === 'dark' || (theme === 'system' && systemDark) || (!theme && systemDark)) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
