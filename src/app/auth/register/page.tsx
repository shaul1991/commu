'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/atoms';
import { AuthInput, SocialLoginButtons } from '@/components/molecules';
import { useAuth } from '@/hooks/useAuth';

export default function RegisterPage() {
  useRouter();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    firstName: '',
    lastName: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 8자 이상이어야 합니다.';
    } else if (!/(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password)) {
      newErrors.password = '비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.';
    }

    if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const result = await register({
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
    });

    if (result.success) {
      setSuccess(true);
    } else {
      setErrors({ form: result.error || '회원가입에 실패했습니다.' });
    }

    setIsSubmitting(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            회원가입 완료!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            입력하신 이메일로 인증 메일을 발송했습니다.<br />
            이메일을 확인하여 인증을 완료해주세요.
          </p>
          <Link href="/auth/login">
            <Button variant="primary" size="lg">
              로그인하기
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
            회원가입
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            이미 계정이 있으신가요?{' '}
            <Link href="/auth/login" className="text-purple-600 hover:text-purple-500">
              로그인
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {errors.form && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm">
              {errors.form}
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <AuthInput
                label="성"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="홍"
              />
              <AuthInput
                label="이름"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="길동"
              />
            </div>

            <AuthInput
              label="이메일"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="이메일을 입력하세요"
              error={errors.email}
              required
            />

            <AuthInput
              label="비밀번호"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="8자 이상, 영문+숫자+특수문자"
              error={errors.password}
              required
            />

            <AuthInput
              label="비밀번호 확인"
              type="password"
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleChange}
              placeholder="비밀번호를 다시 입력하세요"
              error={errors.passwordConfirm}
              required
            />
          </div>

          <div className="flex items-start">
            <input
              id="agree-terms"
              name="agree-terms"
              type="checkbox"
              required
              className="h-4 w-4 mt-0.5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              <Link href="/terms" className="text-purple-600 hover:underline">이용약관</Link> 및{' '}
              <Link href="/privacy" className="text-purple-600 hover:underline">개인정보처리방침</Link>에 동의합니다.
            </label>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? '가입 중...' : '회원가입'}
          </Button>

          <SocialLoginButtons />
        </form>
      </div>
    </div>
  );
}
