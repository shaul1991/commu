'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/atoms';
import { AuthInput } from '@/components/molecules';
import { authApi } from '@/lib/api/auth';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('이메일을 입력해주세요.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('올바른 이메일 형식이 아닙니다.');
      return;
    }

    setIsSubmitting(true);

    try {
      await authApi.forgotPassword(email);
      setIsSuccess(true);
    } catch (error: any) {
      // 보안상 이메일 존재 여부를 노출하지 않음
      setIsSuccess(true);
    }

    setIsSubmitting(false);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            이메일을 확인해주세요
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            입력하신 이메일 주소로 비밀번호 재설정 링크를 발송했습니다.
            <br />
            이메일이 도착하지 않으면 스팸 폴더를 확인해주세요.
          </p>
          <Link href="/auth/login">
            <Button variant="outline" size="lg">
              로그인 페이지로
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            커뮤
          </h1>
          <h2 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
            비밀번호 찾기
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            가입할 때 사용한 이메일 주소를 입력하세요.
            <br />
            비밀번호 재설정 링크를 보내드립니다.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <AuthInput
            label="이메일"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일을 입력하세요"
            required
            autoComplete="email"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? '전송 중...' : '재설정 링크 받기'}
          </Button>

          <div className="text-center">
            <Link
              href="/auth/login"
              className="text-sm text-purple-600 hover:text-purple-500"
            >
              로그인으로 돌아가기
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
