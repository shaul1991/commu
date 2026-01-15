'use client';

import { useMemo } from 'react';
import { Link2, Check, AlertCircle } from 'lucide-react';

interface ReferenceUrlInputProps {
  value: string;
  onChange: (url: string) => void;
  error?: string;
}

// URL 유효성 검사 정규식
const URL_PATTERN = /^https?:\/\/.+/i;

function validateUrl(url: string): { isValid: boolean; message?: string } {
  if (!url) {
    return { isValid: true }; // 빈 값은 유효 (선택 사항)
  }

  if (!URL_PATTERN.test(url)) {
    return { isValid: false, message: '올바른 URL 형식이 아닙니다. (http:// 또는 https://로 시작해야 합니다)' };
  }

  return { isValid: true, message: '유효한 URL입니다' };
}

export default function ReferenceUrlInput({
  value,
  onChange,
  error: externalError,
}: ReferenceUrlInputProps) {
  const validation = useMemo(() => validateUrl(value), [value]);
  const showSuccess = validation.isValid && value.length > 0;
  const showError = !validation.isValid || !!externalError;
  const errorMessage = externalError || validation.message;

  return (
    <div>
      <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
        <Link2 className="w-4 h-4 inline mr-1" />
        참고 링크 <span className="text-[var(--text-tertiary)]">(선택사항)</span>
      </label>
      <div className="relative">
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://"
          className={`w-full px-4 py-2 bg-[var(--bg-surface)] border rounded-[var(--radius-md)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 transition-colors ${
            showError
              ? 'border-[var(--color-error-500)] focus:ring-[var(--color-error-500)]'
              : showSuccess
              ? 'border-[var(--color-success-500)] focus:ring-[var(--color-success-500)]'
              : 'border-[var(--border-default)] focus:ring-[var(--color-primary-500)]'
          }`}
        />
        {showSuccess && (
          <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-success-500)]" />
        )}
        {showError && (
          <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-error-500)]" />
        )}
      </div>
      {showSuccess && (
        <p className="mt-1 text-xs text-[var(--color-success-500)] flex items-center gap-1">
          <Check className="w-3 h-3" />
          유효한 URL입니다
        </p>
      )}
      {showError && errorMessage && (
        <p className="mt-1 text-xs text-[var(--color-error-500)] flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {errorMessage}
        </p>
      )}
    </div>
  );
}
