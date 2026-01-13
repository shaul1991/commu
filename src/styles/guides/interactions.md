# 좋아요/북마크 아이콘 및 인터랙션 스타일 가이드

## 개요

좋아요(Like)와 북마크(Bookmark)는 사용자가 콘텐츠에 대한 감정과 저장 의사를 표현하는 핵심 인터랙션입니다. 명확한 피드백과 시각적 상태 변화로 사용자 경험을 향상시킵니다.

## 아이콘 선택

### 좋아요 아이콘

| 상태 | 아이콘 | 설명 |
|------|--------|------|
| 비활성 | `Heart` (outline) | 빈 하트 |
| 활성 | `HeartFilled` (solid) | 채워진 하트 |

대안 아이콘:
- `ThumbsUp` / `ThumbsUpFilled`: 엄지 척
- `Star` / `StarFilled`: 별

### 북마크 아이콘

| 상태 | 아이콘 | 설명 |
|------|--------|------|
| 비활성 | `Bookmark` (outline) | 빈 북마크 |
| 활성 | `BookmarkFilled` (solid) | 채워진 북마크 |

## 좋아요 버튼 (LikeButton)

### 기본 구조

```tsx
<button
  onClick={handleLike}
  className={cn(
    "flex items-center gap-1.5 px-3 py-1.5 rounded-full",
    "transition-all duration-normal",
    isLiked ? "text-error-500 bg-error-50" : "text-gray-500 hover:bg-gray-100"
  )}
  aria-label={isLiked ? "좋아요 취소" : "좋아요"}
  aria-pressed={isLiked}
>
  {isLiked ? <HeartFilled /> : <Heart />}
  <span>{likeCount}</span>
</button>
```

### 상태별 스타일

#### 비활성 상태 (Not Liked)

| 속성 | 라이트 모드 | 다크 모드 |
|------|------------|----------|
| 아이콘 색상 | `gray-500` (#6B7280) | `gray-400` (#9CA3AF) |
| 텍스트 색상 | `gray-500` | `gray-400` |
| 배경색 | `transparent` | `transparent` |
| 호버 배경 | `gray-100` (#F3F4F6) | `gray-800` (#1F2937) |

**Tailwind 클래스:**
```css
text-gray-500 dark:text-gray-400
hover:bg-gray-100 dark:hover:bg-gray-800
```

#### 활성 상태 (Liked)

| 속성 | 라이트 모드 | 다크 모드 |
|------|------------|----------|
| 아이콘 색상 | `error-500` (#EF4444) | `error-400` (#F87171) |
| 텍스트 색상 | `error-500` | `error-400` |
| 배경색 | `error-50` (#FEF2F2) | `error-900/20` |
| 호버 배경 | `error-100` (#FEE2E2) | `error-900/30` |

**Tailwind 클래스:**
```css
text-error-500 dark:text-error-400
bg-error-50 dark:bg-error-900/20
hover:bg-error-100 dark:hover:bg-error-900/30
```

### 버튼 크기

| 크기 | 아이콘 크기 | 폰트 크기 | 패딩 |
|------|------------|----------|------|
| `sm` | 16px | 12px | 6px 10px |
| `md` | 20px | 14px | 8px 12px |
| `lg` | 24px | 16px | 10px 16px |

**Tailwind 클래스:**
```css
/* Small */
p-1.5 text-xs [&_svg]:w-4 [&_svg]:h-4

/* Medium (기본) */
px-3 py-1.5 text-sm [&_svg]:w-5 [&_svg]:h-5

/* Large */
px-4 py-2 text-base [&_svg]:w-6 [&_svg]:h-6
```

## 북마크 버튼 (BookmarkButton)

### 기본 구조

```tsx
<button
  onClick={handleBookmark}
  className={cn(
    "p-2 rounded-lg transition-all duration-normal",
    isBookmarked
      ? "text-primary-500 bg-primary-50"
      : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
  )}
  aria-label={isBookmarked ? "북마크 해제" : "북마크"}
  aria-pressed={isBookmarked}
>
  {isBookmarked ? <BookmarkFilled /> : <Bookmark />}
</button>
```

### 상태별 스타일

#### 비활성 상태 (Not Bookmarked)

| 속성 | 라이트 모드 | 다크 모드 |
|------|------------|----------|
| 아이콘 색상 | `gray-400` (#9CA3AF) | `gray-500` (#6B7280) |
| 배경색 | `transparent` | `transparent` |
| 호버 아이콘 | `gray-600` (#4B5563) | `gray-300` (#D1D5DB) |
| 호버 배경 | `gray-100` (#F3F4F6) | `gray-800` (#1F2937) |

**Tailwind 클래스:**
```css
text-gray-400 dark:text-gray-500
hover:text-gray-600 dark:hover:text-gray-300
hover:bg-gray-100 dark:hover:bg-gray-800
```

#### 활성 상태 (Bookmarked)

| 속성 | 라이트 모드 | 다크 모드 |
|------|------------|----------|
| 아이콘 색상 | `primary-500` (#3B82F6) | `primary-400` (#60A5FA) |
| 배경색 | `primary-50` (#EFF6FF) | `primary-900/20` |
| 호버 배경 | `primary-100` (#DBEAFE) | `primary-900/30` |

**Tailwind 클래스:**
```css
text-primary-500 dark:text-primary-400
bg-primary-50 dark:bg-primary-900/20
hover:bg-primary-100 dark:hover:bg-primary-900/30
```

## 클릭 애니메이션

### 스케일 효과

클릭 시 아이콘이 살짝 커졌다가 원래 크기로 돌아오는 효과:

```css
/* CSS */
.like-button:active {
  transform: scale(0.9);
}

/* 또는 Tailwind */
active:scale-90 transition-transform duration-fast
```

### 하트 터짐 효과 (Pop Effect)

좋아요 활성화 시 하트가 터지는 듯한 효과:

```tsx
<motion.button
  whileTap={{ scale: 0.9 }}
  onClick={handleLike}
>
  <motion.div
    initial={false}
    animate={isLiked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
    transition={{ duration: 0.3 }}
  >
    <HeartIcon />
  </motion.div>
</motion.button>
```

**Framer Motion 예시:**
```tsx
const likeVariants = {
  initial: { scale: 1 },
  liked: {
    scale: [1, 1.2, 0.9, 1.1, 1],
    transition: { duration: 0.4 }
  }
};

<motion.div
  variants={likeVariants}
  initial="initial"
  animate={isLiked ? "liked" : "initial"}
>
  <HeartIcon />
</motion.div>
```

### 파티클 효과 (선택)

좋아요 시 작은 하트들이 퍼지는 효과:

```tsx
// 간단한 CSS 파티클
@keyframes particle {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(var(--x), var(--y)) scale(0);
    opacity: 0;
  }
}

.particle {
  animation: particle 0.6s ease-out forwards;
}
```

## 아이콘 전용 버튼

좋아요/북마크 수 없이 아이콘만 표시하는 경우:

```tsx
<button
  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
  aria-label="좋아요"
>
  <Heart className="w-5 h-5 text-gray-500" />
</button>
```

| 속성 | 값 |
|------|-----|
| 버튼 크기 | 36px x 36px |
| 아이콘 크기 | 20px |
| 테두리 반경 | 50% (원형) |

**Tailwind 클래스:**
```css
p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800
transition-colors duration-fast
```

## 인라인 액션 (게시글 카드 내)

게시글 카드 하단에 표시되는 인라인 액션:

```tsx
<div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
  {/* 통계 */}
  <div className="flex items-center gap-4 text-sm text-gray-500">
    <span className="flex items-center gap-1">
      <Heart className="w-4 h-4" />
      <span>{likeCount}</span>
    </span>
    <span className="flex items-center gap-1">
      <MessageCircle className="w-4 h-4" />
      <span>{commentCount}</span>
    </span>
  </div>

  {/* 액션 버튼 */}
  <div className="flex items-center gap-1">
    <LikeButton isLiked={isLiked} onClick={handleLike} size="sm" />
    <BookmarkButton isBookmarked={isBookmarked} onClick={handleBookmark} size="sm" />
  </div>
</div>
```

## 더블 탭 좋아요

모바일에서 이미지나 카드를 더블 탭하여 좋아요:

```tsx
const handleDoubleTap = useDoubleTap(() => {
  if (!isLiked) {
    setIsLiked(true);
    setShowHeartAnimation(true);
    setTimeout(() => setShowHeartAnimation(false), 1000);
  }
});

<div {...handleDoubleTap} className="relative">
  <PostContent />
  {showHeartAnimation && (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 1.5, opacity: 0 }}
      className="absolute inset-0 flex items-center justify-center"
    >
      <HeartFilled className="w-24 h-24 text-error-500 drop-shadow-lg" />
    </motion.div>
  )}
</div>
```

## 로딩 상태

API 호출 중 로딩 상태 표시:

```tsx
<button disabled={isLoading}>
  {isLoading ? (
    <Spinner className="w-5 h-5 animate-spin" />
  ) : isLiked ? (
    <HeartFilled />
  ) : (
    <Heart />
  )}
</button>
```

## Optimistic Update

빠른 피드백을 위한 낙관적 업데이트:

```tsx
const handleLike = async () => {
  // 즉시 UI 업데이트
  setIsLiked(!isLiked);
  setLikeCount(prev => isLiked ? prev - 1 : prev + 1);

  try {
    await api.toggleLike(postId);
  } catch (error) {
    // 실패 시 롤백
    setIsLiked(isLiked);
    setLikeCount(prev => isLiked ? prev + 1 : prev - 1);
    toast.error('좋아요 처리에 실패했습니다.');
  }
};
```

## 접근성 (Accessibility)

### ARIA 속성

```tsx
<button
  role="button"
  aria-label={isLiked ? "좋아요 취소" : "좋아요"}
  aria-pressed={isLiked}
  aria-describedby="like-count"
>
  <HeartIcon aria-hidden="true" />
  <span id="like-count">{likeCount}</span>
</button>
```

### 키보드 접근

- Enter/Space: 좋아요/북마크 토글
- Tab: 다음 버튼으로 이동

### 상태 변경 알림

```tsx
// 스크린 리더에 상태 변경 알림
<div role="status" aria-live="polite" className="sr-only">
  {isLiked ? "좋아요를 눌렀습니다" : "좋아요를 취소했습니다"}
</div>
```

## 사용 예시

```tsx
// 좋아요 버튼 컴포넌트
interface LikeButtonProps {
  isLiked: boolean;
  likeCount: number;
  onLike: () => void;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}

export function LikeButton({
  isLiked,
  likeCount,
  onLike,
  size = 'md',
  showCount = true
}: LikeButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onLike}
      className={cn(
        "flex items-center gap-1.5 rounded-full transition-colors",
        sizeStyles[size],
        isLiked
          ? "text-error-500 bg-error-50 hover:bg-error-100 dark:bg-error-900/20 dark:hover:bg-error-900/30"
          : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
      )}
      aria-label={isLiked ? "좋아요 취소" : "좋아요"}
      aria-pressed={isLiked}
    >
      <motion.div
        animate={isLiked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {isLiked ? (
          <HeartFilled className="w-5 h-5" />
        ) : (
          <Heart className="w-5 h-5" />
        )}
      </motion.div>
      {showCount && <span>{likeCount}</span>}
    </motion.button>
  );
}

// 북마크 버튼 컴포넌트
interface BookmarkButtonProps {
  isBookmarked: boolean;
  onBookmark: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export function BookmarkButton({
  isBookmarked,
  onBookmark,
  size = 'md'
}: BookmarkButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onBookmark}
      className={cn(
        "rounded-lg transition-colors",
        sizeStyles[size],
        isBookmarked
          ? "text-primary-500 bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/20 dark:hover:bg-primary-900/30"
          : "text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-500 dark:hover:text-gray-300 dark:hover:bg-gray-800"
      )}
      aria-label={isBookmarked ? "북마크 해제" : "북마크"}
      aria-pressed={isBookmarked}
    >
      {isBookmarked ? (
        <BookmarkFilled className="w-5 h-5" />
      ) : (
        <Bookmark className="w-5 h-5" />
      )}
    </motion.button>
  );
}
```

## 컴포넌트 구현 참조

- 좋아요 버튼: `src/components/atoms/LikeButton/LikeButton.tsx`
- 북마크 버튼: `src/components/atoms/BookmarkButton/BookmarkButton.tsx`
- 인터랙션 훅: `src/hooks/useLike.ts`, `src/hooks/useBookmark.ts`
