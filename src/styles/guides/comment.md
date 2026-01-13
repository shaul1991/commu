# 댓글 UI 스타일 가이드

## 개요

댓글 UI는 게시글에 대한 사용자들의 의견을 표시하고 상호작용을 가능하게 합니다. 계층적 구조(대댓글)를 지원하며, 좋아요, 답글 달기 등의 기능을 포함합니다.

## 기본 구조

```tsx
<CommentSection>
  <CommentInput />
  <CommentList>
    <Comment>
      <CommentHeader>
        <Avatar />
        <CommentMeta />
        <CommentMenu />
      </CommentHeader>
      <CommentBody />
      <CommentActions />
      <CommentReplies>
        <Comment isReply />
      </CommentReplies>
    </Comment>
  </CommentList>
</CommentSection>
```

## 댓글 입력 영역 (CommentInput)

### 기본 스타일

```tsx
<div className="flex gap-3 p-4 border-b border-gray-200">
  <Avatar size="sm" />
  <div className="flex-1">
    <Textarea
      placeholder="댓글을 입력하세요..."
      rows={2}
      className="resize-none"
    />
    <div className="flex justify-end mt-2">
      <Button variant="primary" size="sm">댓글 작성</Button>
    </div>
  </div>
</div>
```

| 속성 | 값 |
|------|-----|
| 패딩 | 16px (1rem) |
| 간격 | 12px (0.75rem) |
| 아바타 크기 | 36px (2.25rem) |
| 테두리 | `border-b border-gray-200` |

**Tailwind 클래스:**
```css
flex gap-3 p-4 border-b border-gray-200 dark:border-gray-700
```

### 포커스 상태

입력 필드에 포커스 시 배경색 변경:
```css
bg-gray-50 dark:bg-gray-900
```

## 댓글 아이템 (Comment)

### 기본 스타일

| 속성 | 라이트 모드 | 다크 모드 |
|------|------------|----------|
| 배경색 | `white` | `gray-800` |
| 패딩 | 16px (1rem) | 16px |
| 하단 테두리 | `gray-100` | `gray-700` |

**Tailwind 클래스:**
```css
p-4 border-b border-gray-100 dark:border-gray-700
last:border-b-0
```

### 호버 상태

```css
hover:bg-gray-50 dark:hover:bg-gray-800/50
transition-colors duration-fast
```

## 댓글 헤더 (CommentHeader)

### 레이아웃

```css
flex items-start gap-3
```

### 아바타 (Avatar)

| 속성 | 값 |
|------|-----|
| 크기 | 36px x 36px (2.25rem) |
| 테두리 반경 | 50% (원형) |

**Tailwind 클래스:**
```css
w-9 h-9 rounded-full flex-shrink-0
```

### 메타 정보 (CommentMeta)

```tsx
<div className="flex-1 min-w-0">
  <div className="flex items-center gap-2">
    <span className="text-sm font-medium text-gray-900">홍길동</span>
    <span className="text-xs text-gray-500">·</span>
    <span className="text-xs text-gray-500">2시간 전</span>
  </div>
</div>
```

| 요소 | 폰트 크기 | 폰트 두께 | 색상 |
|------|----------|----------|------|
| 작성자 이름 | 14px (0.875rem) | medium (500) | `gray-900` / `gray-100` |
| 작성 시간 | 12px (0.75rem) | regular (400) | `gray-500` / `gray-400` |

**Tailwind 클래스:**
```css
/* 작성자 이름 */
text-sm font-medium text-gray-900 dark:text-gray-100

/* 작성 시간 */
text-xs text-gray-500 dark:text-gray-400
```

### 작성자 배지

게시글 작성자가 댓글을 달았을 때 표시:

```tsx
<Badge variant="primary" size="xs">작성자</Badge>
```

**Tailwind 클래스:**
```css
px-1.5 py-0.5 text-xs font-medium rounded
bg-primary-100 text-primary-700
dark:bg-primary-900/30 dark:text-primary-300
```

### 더보기 메뉴 (CommentMenu)

```tsx
<button
  className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100"
  aria-label="더보기"
>
  <MoreHorizontalIcon className="w-4 h-4" />
</button>
```

**Tailwind 클래스:**
```css
p-1 rounded text-gray-400
hover:text-gray-600 hover:bg-gray-100
dark:hover:text-gray-300 dark:hover:bg-gray-700
opacity-0 group-hover:opacity-100 transition-opacity
```

## 댓글 본문 (CommentBody)

### 기본 스타일

| 속성 | 값 |
|------|-----|
| 폰트 크기 | 14px (0.875rem) |
| 줄 높이 | 1.625 (relaxed) |
| 텍스트 색상 | `gray-700` / `gray-300` |
| 좌측 여백 | 48px (아바타 + 간격) |

**Tailwind 클래스:**
```css
ml-12 text-sm text-gray-700 dark:text-gray-300
leading-relaxed whitespace-pre-wrap break-words
```

### 멘션 스타일 (@username)

```css
text-primary-500 font-medium hover:underline cursor-pointer
```

### 링크 스타일

```css
text-primary-500 hover:underline
```

## 댓글 액션 (CommentActions)

### 레이아웃

```tsx
<div className="ml-12 mt-2 flex items-center gap-4">
  <button className="text-xs text-gray-500 hover:text-gray-700">
    <ThumbsUpIcon className="w-4 h-4 mr-1 inline" />
    <span>좋아요 {likeCount}</span>
  </button>
  <button className="text-xs text-gray-500 hover:text-gray-700">
    답글 달기
  </button>
</div>
```

| 속성 | 값 |
|------|-----|
| 폰트 크기 | 12px (0.75rem) |
| 텍스트 색상 | `gray-500` |
| 호버 색상 | `gray-700` / `gray-300` |
| 간격 | 16px (1rem) |

**Tailwind 클래스:**
```css
ml-12 mt-2 flex items-center gap-4

/* 버튼 */
text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300
flex items-center gap-1 transition-colors
```

### 좋아요 활성 상태

```css
text-primary-500 dark:text-primary-400
```

## 대댓글 (Reply Comments)

### 들여쓰기

대댓글은 부모 댓글 아래에 들여쓰기되어 표시됩니다.

| 속성 | 값 |
|------|-----|
| 좌측 패딩 | 48px (3rem) |
| 상단 여백 | 8px |
| 배경색 | `gray-50` / `gray-900` |

**Tailwind 클래스:**
```css
ml-12 pl-4 border-l-2 border-gray-200 dark:border-gray-700
mt-2 space-y-2
```

### 대댓글 스타일

```tsx
<div className="py-3 first:pt-0">
  <div className="flex gap-2">
    <Avatar size="xs" className="w-7 h-7" />
    <div className="flex-1">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">김철수</span>
        <span className="text-xs text-gray-500">1시간 전</span>
      </div>
      <p className="text-sm text-gray-700 mt-1">대댓글 내용</p>
      <CommentActions />
    </div>
  </div>
</div>
```

### 대댓글 아바타 크기

| 속성 | 값 |
|------|-----|
| 크기 | 28px x 28px (1.75rem) |

## 답글 입력 (Reply Input)

답글 달기 클릭 시 표시되는 입력 영역:

```tsx
<div className="ml-12 mt-3 flex gap-2">
  <Avatar size="xs" />
  <div className="flex-1 flex gap-2">
    <Input
      placeholder="답글을 입력하세요..."
      className="flex-1"
      size="sm"
    />
    <Button variant="primary" size="sm">답글</Button>
    <Button variant="ghost" size="sm" onClick={onCancel}>취소</Button>
  </div>
</div>
```

## 댓글 수 표시

### 섹션 헤더

```tsx
<div className="flex items-center justify-between p-4 border-b border-gray-200">
  <h3 className="text-base font-semibold text-gray-900">
    댓글 <span className="text-primary-500">{commentCount}</span>
  </h3>
  <select className="text-sm text-gray-600 border-0 bg-transparent">
    <option>최신순</option>
    <option>인기순</option>
  </select>
</div>
```

## 상태 표시

### 댓글 없음

```tsx
<div className="py-12 text-center">
  <MessageCircleIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
  <p className="text-gray-500">아직 댓글이 없습니다.</p>
  <p className="text-sm text-gray-400 mt-1">첫 번째 댓글을 작성해보세요!</p>
</div>
```

### 댓글 로딩

```tsx
<div className="py-8 text-center">
  <Spinner className="w-6 h-6 mx-auto text-gray-400" />
  <p className="text-sm text-gray-500 mt-2">댓글을 불러오는 중...</p>
</div>
```

### 삭제된 댓글

```tsx
<div className="p-4 bg-gray-50 dark:bg-gray-900 rounded text-sm text-gray-500 italic">
  삭제된 댓글입니다.
</div>
```

## 애니메이션

### 새 댓글 등장

```css
animate-slide-in-up
```

### 답글 영역 펼침

```tsx
<motion.div
  initial={{ height: 0, opacity: 0 }}
  animate={{ height: 'auto', opacity: 1 }}
  exit={{ height: 0, opacity: 0 }}
  transition={{ duration: 0.2 }}
>
```

## 접근성 (Accessibility)

1. **시멘틱 구조**: `<article>` 또는 `<section>` 사용
2. **목록 구조**: 댓글 목록에 `<ul>`, `<li>` 사용
3. **시간 표시**: `<time datetime="">` 사용
4. **버튼 라벨**: 아이콘 버튼에 `aria-label` 제공
5. **상태 알림**: 댓글 작성 완료 시 `aria-live` 영역으로 알림

```tsx
<section aria-label="댓글">
  <h3>댓글 {commentCount}</h3>
  <ul role="list">
    <li role="listitem">
      <article>
        <header>
          <span>홍길동</span>
          <time datetime="2024-01-15T10:30:00">2시간 전</time>
        </header>
        <p>댓글 내용</p>
        <footer>
          <button aria-label="좋아요">좋아요</button>
          <button aria-label="답글 달기">답글</button>
        </footer>
      </article>
    </li>
  </ul>
</section>
```

## 사용 예시

```tsx
// 댓글 섹션
<CommentSection>
  {/* 댓글 입력 */}
  <div className="flex gap-3 p-4 border-b border-gray-200">
    <Avatar size="sm" src="/my-avatar.jpg" />
    <div className="flex-1">
      <Textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="댓글을 입력하세요..."
        rows={2}
      />
      <div className="flex justify-end mt-2">
        <Button
          variant="primary"
          size="sm"
          onClick={handleSubmit}
          disabled={!newComment.trim()}
        >
          댓글 작성
        </Button>
      </div>
    </div>
  </div>

  {/* 댓글 목록 */}
  <ul className="divide-y divide-gray-100 dark:divide-gray-700">
    {comments.map((comment) => (
      <li key={comment.id} className="p-4 group">
        <div className="flex gap-3">
          <Avatar size="sm" src={comment.author.avatar} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900">
                {comment.author.name}
              </span>
              {comment.isAuthor && (
                <Badge variant="primary" size="xs">작성자</Badge>
              )}
              <span className="text-xs text-gray-500">
                {formatRelativeTime(comment.createdAt)}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">
              {comment.content}
            </p>
            <div className="mt-2 flex items-center gap-4">
              <button className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1">
                <ThumbsUp className="w-4 h-4" />
                <span>{comment.likeCount}</span>
              </button>
              <button className="text-xs text-gray-500 hover:text-gray-700">
                답글 달기
              </button>
            </div>

            {/* 대댓글 */}
            {comment.replies?.length > 0 && (
              <div className="mt-3 ml-4 pl-4 border-l-2 border-gray-200 space-y-3">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="flex gap-2">
                    <Avatar size="xs" src={reply.author.avatar} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{reply.author.name}</span>
                        <span className="text-xs text-gray-500">
                          {formatRelativeTime(reply.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mt-1">{reply.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </li>
    ))}
  </ul>
</CommentSection>
```

## 컴포넌트 구현 참조

댓글 컴포넌트: `src/components/molecules/Comment/` 또는 `src/components/organisms/CommentSection/`
