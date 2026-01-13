'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/atoms';
import { AuthInput, SocialLoginButtons } from '@/components/molecules';
import { useAuth, useRedirectIfAuthenticated } from '@/hooks';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading: authLoading } = useAuth();
  const { isLoading: redirectLoading } = useRedirectIfAuthenticated();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLoading = authLoading || redirectLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await login({ email, password });

    if (result.success) {
      router.push('/');
    } else {
      setError(result.error || '로그인에 실패했습니다.');
    }

    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-page)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary-500)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-page)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-secondary-500)] bg-clip-text text-transparent">
            커뮤
          </h1>
          <h2 className="mt-6 text-2xl font-bold text-[var(--text-primary)]">
            로그인
          </h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            계정이 없으신가요?{' '}
            <Link href="/auth/register" className="text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)]">
              회원가입
            </Link>
          </p>
        </div>

        <form className="mt-8" onSubmit={handleSubmit}>
          {error && (
            <div className="mb-6 bg-[var(--color-error-50)] text-[var(--color-error-600)] p-4 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4 mb-6">
            <AuthInput
              label="이메일"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
              required
              autoComplete="email"
            />

            <AuthInput
              label="비밀번호"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              required
              autoComplete="current-password"
            />
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-[var(--border-default)] text-[var(--color-primary-500)] focus:ring-[var(--color-primary-500)]"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-[var(--text-secondary)]">
                로그인 상태 유지
              </label>
            </div>

            <Link
              href="/auth/forgot-password"
              className="text-sm text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)]"
            >
              비밀번호를 잊으셨나요?
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mb-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? '로그인 중...' : '로그인'}
          </Button>

          <SocialLoginButtons />
        </form>
      </div>
    </div>
  );
}
