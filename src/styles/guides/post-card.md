# 게시글 카드 (Post Card) 스타일 가이드

## 개요

게시글 카드는 커뮤니티의 핵심 UI 요소로, 게시글 목록에서 각 게시글의 정보를 표시합니다. 제목, 내용 미리보기, 작성자 정보, 상호작용 메트릭을 포함합니다.

## 기본 구조

```tsx
<PostCard>
  <PostCardHeader>
    <Avatar src={author.avatar} alt={author.name} />
    <PostCardMeta>
      <AuthorName>{author.name}</AuthorName>
      <PostTime>{formatRelativeTime(createdAt)}</PostTime>
    </PostCardMeta>
    <PostCardMenu />
  </PostCardHeader>

  <PostCardContent>
    <PostCardTitle>{title}</PostCardTitle>
    <PostCardExcerpt>{excerpt}</PostCardExcerpt>
    <PostCardThumbnail src={thumbnail} /> {/* 선택 */}
  </PostCardContent>

  <PostCardFooter>
    <PostCardStats>
      <LikeCount />
      <CommentCount />
      <ViewCount />
    </PostCardStats>
    <PostCardActions>
      <LikeButton />
      <BookmarkButton />
    </PostCardActions>
  </PostCardFooter>
</PostCard>
```

## 카드 컨테이너

### 기본 스타일

| 속성 | 라이트 모드 | 다크 모드 |
|------|------------|----------|
| 배경색 | `white` (#FFFFFF) | `gray-800` (#1F2937) |
| 테두리 | `gray-200` (#E5E7EB) | `gray-700` (#374151) |
| 테두리 반경 | 12px (0.75rem) | 12px |
| 패딩 | 16px (1rem) | 16px |

**Tailwind 클래스:**
```css
bg-white border border-gray-200 rounded-xl p-4
dark:bg-gray-800 dark:border-gray-700
```

### 호버 상태

```css
hover:border-gray-300 hover:shadow-sm
dark:hover:border-gray-600
transition-all duration-fast
cursor-pointer
```

### 클릭 가능한 영역

전체 카드가 클릭 가능하며, 게시글 상세 페이지로 이동합니다.

```tsx
<article
  onClick={() => router.push(`/posts/${post.id}`)}
  className="cursor-pointer"
  role="article"
  aria-label={`게시글: ${post.title}`}
>
```

## 헤더 영역 (PostCardHeader)

### 레이아웃

```css
flex items-center gap-3 mb-3
```

### 아바타 (Avatar)

| 속성 | 값 |
|------|-----|
| 크기 | 40px x 40px (2.5rem) |
| 테두리 반경 | 50% (원형) |
| 폴백 | 이니셜 또는 기본 아이콘 |

**Tailwind 클래스:**
```css
w-10 h-10 rounded-full bg-gray-200 flex-shrink-0
overflow-hidden object-cover
```

### 작성자 정보 (PostCardMeta)

```tsx
<div className="flex-1 min-w-0">
  <p className="text-sm font-medium text-gray-900 truncate">홍길동</p>
  <p className="text-xs text-gray-500">3시간 전</p>
</div>
```

| 요소 | 폰트 크기 | 폰트 두께 | 색상 |
|------|----------|----------|------|
| 작성자 이름 | 14px (0.875rem) | medium (500) | `gray-900` / `gray-100` |
| 작성 시간 | 12px (0.75rem) | regular (400) | `gray-500` / `gray-400` |

**Tailwind 클래스:**
```css
/* 작성자 이름 */
text-sm font-medium text-gray-900 dark:text-gray-100 truncate

/* 작성 시간 */
text-xs text-gray-500 dark:text-gray-400
```

### 더보기 메뉴 (PostCardMenu)

```tsx
<button
  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
  aria-label="더보기"
>
  <MoreHorizontalIcon className="w-5 h-5" />
</button>
```

## 콘텐츠 영역 (PostCardContent)

### 제목 (PostCardTitle)

| 속성 | 값 |
|------|-----|
| 폰트 크기 | 16px (1rem) |
| 폰트 두께 | semibold (600) |
| 줄 수 제한 | 2줄 (`line-clamp-2`) |
| 하단 여백 | 8px (0.5rem) |

**Tailwind 클래스:**
```css
text-base font-semibold text-gray-900 dark:text-gray-100
line-clamp-2 mb-2
```

### 본문 미리보기 (PostCardExcerpt)

| 속성 | 값 |
|------|-----|
| 폰트 크기 | 14px (0.875rem) |
| 텍스트 색상 | `gray-600` / `gray-300` |
| 줄 수 제한 | 3줄 (`line-clamp-3`) |
| 줄 높이 | 1.5 (relaxed) |

**Tailwind 클래스:**
```css
text-sm text-gray-600 dark:text-gray-300
line-clamp-3 leading-relaxed
```

### 썸네일 이미지 (PostCardThumbnail)

썸네일이 있는 경우 표시합니다.

| 속성 | 값 |
|------|-----|
| 최대 높이 | 200px |
| 테두리 반경 | 8px (0.5rem) |
| 상단 여백 | 12px (0.75rem) |
| 비율 | `aspect-video` (16:9) 또는 `object-cover` |

**Tailwind 클래스:**
```css
mt-3 rounded-lg overflow-hidden
w-full max-h-[200px] object-cover
bg-gray-100 dark:bg-gray-700
```

## 푸터 영역 (PostCardFooter)

### 레이아웃

```css
flex items-center justify-between mt-4 pt-3
border-t border-gray-100 dark:border-gray-700
```

### 통계 (PostCardStats)

좋아요, 댓글, 조회수 등 통계를 표시합니다.

```tsx
<div className="flex items-center gap-4 text-sm text-gray-500">
  <span className="flex items-center gap-1">
    <HeartIcon className="w-4 h-4" />
    <span>24</span>
  </span>
  <span className="flex items-center gap-1">
    <MessageCircleIcon className="w-4 h-4" />
    <span>12</span>
  </span>
  <span className="flex items-center gap-1">
    <EyeIcon className="w-4 h-4" />
    <span>156</span>
  </span>
</div>
```

| 속성 | 값 |
|------|-----|
| 폰트 크기 | 14px (0.875rem) |
| 텍스트 색상 | `gray-500` / `gray-400` |
| 아이콘 크기 | 16px |
| 간격 | 16px (1rem) |

**Tailwind 클래스:**
```css
flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400
```

### 액션 버튼 (PostCardActions)

좋아요, 북마크 버튼 영역입니다.

```tsx
<div className="flex items-center gap-1">
  <LikeButton isLiked={isLiked} onClick={handleLike} />
  <BookmarkButton isBookmarked={isBookmarked} onClick={handleBookmark} />
</div>
```

## 카드 변형

### 컴팩트 카드

목록 보기에서 사용하는 간소화된 카드입니다.

```tsx
<PostCard variant="compact">
  <PostCardTitle>{title}</PostCardTitle>
  <PostCardMeta>
    <span>{author.name}</span>
    <span>·</span>
    <span>{formatRelativeTime(createdAt)}</span>
    <span>·</span>
    <span>조회 {viewCount}</span>
  </PostCardMeta>
</PostCard>
```

**Tailwind 클래스:**
```css
p-3 flex items-center gap-3
```

### 이미지 강조 카드

이미지가 주요 콘텐츠인 경우 사용합니다.

```tsx
<PostCard variant="media">
  <PostCardThumbnail className="aspect-square" />
  <PostCardContent className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80">
    <PostCardTitle className="text-white">{title}</PostCardTitle>
  </PostCardContent>
</PostCard>
```

### 하이라이트 카드

인기 게시글이나 공지사항에 사용합니다.

```tsx
<PostCard variant="highlight" className="border-primary-200 bg-primary-50">
  <Badge variant="primary" className="mb-2">인기</Badge>
  {/* ... */}
</PostCard>
```

## 반응형 디자인

### 모바일 (< 640px)

- 패딩: 12px
- 제목 폰트 크기: 15px
- 썸네일 최대 높이: 160px

### 태블릿/데스크톱 (>= 640px)

- 패딩: 16px
- 제목 폰트 크기: 16px
- 썸네일 최대 높이: 200px

**Tailwind 클래스:**
```css
p-3 sm:p-4
```

## 애니메이션

### 등장 애니메이션

```css
animate-fade-in
/* 또는 리스트에서 stagger 효과 */
animate-slide-in-up
```

### 호버 효과

```css
transition-all duration-fast ease-in-out
hover:shadow-sm hover:-translate-y-0.5
```

## 스켈레톤 로딩

```tsx
<PostCardSkeleton>
  <div className="flex items-center gap-3 mb-3">
    <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
    <div className="flex-1 space-y-2">
      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
      <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
    </div>
  </div>
  <div className="space-y-2">
    <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse" />
    <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
    <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
  </div>
</PostCardSkeleton>
```

## 접근성 (Accessibility)

1. **시멘틱 마크업**: `<article>` 태그 사용
2. **제목 레벨**: 페이지 구조에 맞는 heading 사용
3. **이미지 alt**: 썸네일에 적절한 alt 텍스트 제공
4. **클릭 영역**: 충분한 터치 영역 확보 (최소 44px)
5. **키보드 접근**: Tab으로 탐색, Enter로 활성화

```tsx
<article
  tabIndex={0}
  role="article"
  aria-label={`게시글: ${title}`}
  onKeyDown={(e) => e.key === 'Enter' && onClick()}
>
  <h3>{title}</h3>
  {/* ... */}
</article>
```

## 사용 예시

```tsx
// 기본 게시글 카드
<PostCard>
  <PostCardHeader>
    <Avatar src="/avatar.jpg" alt="홍길동" size="sm" />
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-gray-900 truncate">홍길동</p>
      <p className="text-xs text-gray-500">3시간 전</p>
    </div>
    <PostCardMenu />
  </PostCardHeader>

  <PostCardContent>
    <h3 className="text-base font-semibold text-gray-900 line-clamp-2 mb-2">
      Next.js 16에서 새로 추가된 기능 정리
    </h3>
    <p className="text-sm text-gray-600 line-clamp-3">
      Next.js 16이 출시되면서 여러 가지 새로운 기능이 추가되었습니다.
      이번 포스트에서는 주요 변경사항과 새 기능들을 정리해보겠습니다...
    </p>
    <img
      src="/thumbnail.jpg"
      alt="게시글 썸네일"
      className="mt-3 rounded-lg w-full max-h-[200px] object-cover"
    />
  </PostCardContent>

  <PostCardFooter>
    <div className="flex items-center gap-4 text-sm text-gray-500">
      <span className="flex items-center gap-1">
        <Heart className="w-4 h-4" />
        <span>24</span>
      </span>
      <span className="flex items-center gap-1">
        <MessageCircle className="w-4 h-4" />
        <span>12</span>
      </span>
    </div>
    <div className="flex items-center gap-1">
      <LikeButton />
      <BookmarkButton />
    </div>
  </PostCardFooter>
</PostCard>
```

## 컴포넌트 구현 참조

게시글 카드 컴포넌트: `src/components/molecules/PostCard/PostCard.tsx`
