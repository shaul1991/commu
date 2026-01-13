'use client';

import { useState, InputHTMLAttributes, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/atoms';

interface AuthInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: string;
  error?: string;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, error, type, className, ...rest }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';

    return (
      <div className="flex flex-col gap-1">
        <label className="block text-sm font-medium text-[var(--text-primary)]">
          {label}
        </label>
        <div className="relative">
          <Input
            ref={ref}
            type={isPassword && showPassword ? 'text' : type}
            className={`w-full ${error ? 'border-[var(--color-error-500)]' : ''} ${className || ''}`}
            {...rest}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
        {error && <p className="text-sm text-[var(--color-error-500)]">{error}</p>}
      </div>
    );
  }
);

AuthInput.displayName = 'AuthInput';
