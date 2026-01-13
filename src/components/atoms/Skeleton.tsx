'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({
  className,
  variant = 'text',
  width,
  height,
  animation = 'pulse',
}: SkeletonProps) {
  const variantStyles = {
    text: 'rounded-[var(--radius-sm)]',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-[var(--radius-md)]',
  };

  const animationStyles = {
    pulse: 'animate-pulse',
    wave: 'skeleton-wave',
    none: '',
  };

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div
      className={cn(
        'bg-[var(--bg-hover)]',
        variantStyles[variant],
        animationStyles[animation],
        variant === 'text' && !height && 'h-4',
        className
      )}
      style={style}
      aria-hidden="true"
    />
  );
}

// 아바타 스켈레톤
interface AvatarSkeletonProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

const avatarSizes = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
};

export function AvatarSkeleton({ size = 'md' }: AvatarSkeletonProps) {
  return (
    <Skeleton
      variant="circular"
      className={avatarSizes[size]}
    />
  );
}

// 텍스트 라인 스켈레톤
interface TextSkeletonProps {
  lines?: number;
  lastLineWidth?: string;
  className?: string;
}

export function TextSkeleton({
  lines = 3,
  lastLineWidth = '60%',
  className,
}: TextSkeletonProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          variant="text"
          width={index === lines - 1 ? lastLineWidth : '100%'}
          className="h-4"
        />
      ))}
    </div>
  );
}

// 카드 스켈레톤
export function CardSkeleton() {
  return (
    <div className="p-4 bg-[var(--bg-surface)] rounded-[var(--radius-lg)] border border-[var(--border-default)]">
      <div className="flex items-center gap-3 mb-4">
        <AvatarSkeleton size="sm" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="30%" className="h-4" />
          <Skeleton variant="text" width="20%" className="h-3" />
        </div>
      </div>
      <Skeleton variant="text" width="80%" className="h-5 mb-2" />
      <TextSkeleton lines={2} lastLineWidth="70%" />
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[var(--border-default)]">
        <Skeleton variant="rounded" width={60} height={24} />
        <Skeleton variant="rounded" width={60} height={24} />
        <Skeleton variant="rounded" width={60} height={24} />
      </div>
    </div>
  );
}

// 게시글 목록 스켈레톤
interface PostListSkeletonProps {
  count?: number;
}

export function PostListSkeleton({ count = 5 }: PostListSkeletonProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  );
}

// 댓글 스켈레톤
export function CommentSkeleton() {
  return (
    <div className="flex gap-3 p-3">
      <AvatarSkeleton size="sm" />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <Skeleton variant="text" width={80} className="h-4" />
          <Skeleton variant="text" width={60} className="h-3" />
        </div>
        <TextSkeleton lines={2} lastLineWidth="80%" />
      </div>
    </div>
  );
}

// 댓글 목록 스켈레톤
interface CommentListSkeletonProps {
  count?: number;
}

export function CommentListSkeleton({ count = 3 }: CommentListSkeletonProps) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, index) => (
        <CommentSkeleton key={index} />
      ))}
    </div>
  );
}

export default Skeleton;
