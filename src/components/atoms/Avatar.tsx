'use client';

import { useState, type ImgHTMLAttributes } from 'react';
import { cn, getInitials } from '@/lib/utils';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'size' | 'src'> {
  size?: AvatarSize;
  name?: string;
  src?: string | null;
}

const sizeStyles: Record<AvatarSize, string> = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
};

export function Avatar({
  size = 'md',
  name = '',
  src,
  alt,
  className,
  ...props
}: AvatarProps) {
  const [hasError, setHasError] = useState(false);
  const initials = getInitials(name);
  const showFallback = !src || hasError;

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center',
        'rounded-full overflow-hidden',
        'bg-[var(--color-primary-100)]',
        'text-[var(--color-primary-600)]',
        'font-medium select-none',
        sizeStyles[size],
        className
      )}
    >
      {showFallback ? (
        <span aria-label={name || 'User avatar'}>{initials || '?'}</span>
      ) : (
        <img
          src={src}
          alt={alt || name || 'User avatar'}
          className="w-full h-full object-cover"
          onError={() => setHasError(true)}
          {...props}
        />
      )}
    </div>
  );
}

export default Avatar;
