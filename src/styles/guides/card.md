# Card 스타일 가이드

## 개요

카드는 관련 콘텐츠를 그룹화하여 표시하는 컨테이너 컴포넌트입니다. 정보를 시각적으로 구분하고 일관된 레이아웃을 제공합니다.

## 기본 스타일

### 기본 카드 (Default Card)

```tsx
<Card>
  <CardHeader>제목</CardHeader>
  <CardContent>내용</CardContent>
</Card>
```

| 속성 | 라이트 모드 | 다크 모드 |
|------|------------|----------|
| 배경색 | `white` (#FFFFFF) | `gray-800` (#1F2937) |
| 테두리 | `gray-200` (#E5E7EB) | `gray-700` (#374151) |
| 테두리 반경 | 12px (0.75rem) | 12px |
| 그림자 | `shadow-sm` | `shadow-md` (다크) |

**Tailwind 클래스:**
```css
bg-white border border-gray-200 rounded-xl shadow-sm
dark:bg-gray-800 dark:border-gray-700
```

## 카드 변형 (Variants)

### Elevated Card

그림자로 부각된 카드입니다.

```tsx
<Card variant="elevated">내용</Card>
```

| 속성 | 값 |
|------|-----|
| 그림자 | `shadow-md` |
| 호버 그림자 | `shadow-lg` |
| 테두리 | 없음 |

**Tailwind 클래스:**
```css
bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow
dark:bg-gray-800
```

### Outlined Card

테두리로 구분된 카드입니다.

```tsx
<Card variant="outlined">내용</Card>
```

| 속성 | 값 |
|------|-----|
| 그림자 | 없음 |
| 테두리 | 1px solid `gray-200` |

**Tailwind 클래스:**
```css
bg-white border border-gray-200 rounded-xl
dark:bg-gray-800 dark:border-gray-700
```

### Flat Card

배경색만 있는 평면 카드입니다.

```tsx
<Card variant="flat">내용</Card>
```

| 속성 | 라이트 모드 | 다크 모드 |
|------|------------|----------|
| 배경색 | `gray-50` (#F9FAFB) | `gray-900` (#111827) |
| 테두리/그림자 | 없음 | 없음 |

**Tailwind 클래스:**
```css
bg-gray-50 rounded-xl dark:bg-gray-900
```

## 카드 구성 요소

### CardHeader

```tsx
<CardHeader>
  <CardTitle>제목</CardTitle>
  <CardDescription>설명 텍스트</CardDescription>
</CardHeader>
```

| 속성 | 값 |
|------|-----|
| 패딩 | 16px 16px 0 16px |
| 제목 폰트 크기 | 18px (1.125rem) |
| 제목 폰트 두께 | semibold (600) |
| 설명 텍스트 색상 | `gray-500` |

**Tailwind 클래스:**
```css
/* Header */
px-4 pt-4

/* Title */
text-lg font-semibold text-gray-900 dark:text-gray-100

/* Description */
text-sm text-gray-500 mt-1 dark:text-gray-400
```

### CardContent

```tsx
<CardContent>
  <p>카드 본문 내용</p>
</CardContent>
```

| 속성 | 값 |
|------|-----|
| 패딩 | 16px (1rem) |
| 텍스트 색상 | `gray-700` / `gray-300` |

**Tailwind 클래스:**
```css
p-4 text-gray-700 dark:text-gray-300
```

### CardFooter

```tsx
<CardFooter>
  <Button>액션</Button>
</CardFooter>
```

| 속성 | 값 |
|------|-----|
| 패딩 | 0 16px 16px 16px |
| 상단 테두리 | 선택적 (`border-t`) |
| 정렬 | flex, `justify-end` 또는 `justify-between` |

**Tailwind 클래스:**
```css
px-4 pb-4 flex items-center gap-2

/* 테두리 있는 경우 */
px-4 py-4 border-t border-gray-200 dark:border-gray-700
```

### CardMedia

이미지나 미디어를 포함하는 영역입니다.

```tsx
<Card>
  <CardMedia src="/image.jpg" alt="설명" />
  <CardContent>내용</CardContent>
</Card>
```

| 속성 | 값 |
|------|-----|
| 위치 | 카드 상단 |
| 테두리 반경 | 상단만 12px |
| 비율 | `aspect-video` (16:9) 또는 `aspect-square` |

**Tailwind 클래스:**
```css
w-full aspect-video object-cover rounded-t-xl
```

## 패딩 크기 (Padding)

| 크기 | 패딩 |
|------|------|
| `sm` | 12px (0.75rem) |
| `md` | 16px (1rem) |
| `lg` | 24px (1.5rem) |

**Tailwind 클래스:**
```css
/* Small */
p-3

/* Medium (기본) */
p-4

/* Large */
p-6
```

## 상호작용 (Interactive)

### 클릭 가능한 카드

```tsx
<Card as="button" onClick={handleClick} interactive>
  내용
</Card>
```

| 속성 | 값 |
|------|-----|
| 커서 | `pointer` |
| 호버 배경 | `gray-50` / `gray-700` |
| 호버 테두리 | `gray-300` / `gray-600` |
| 활성 배경 | `gray-100` / `gray-600` |

**Tailwind 클래스:**
```css
cursor-pointer
hover:bg-gray-50 hover:border-gray-300
active:bg-gray-100
dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:active:bg-gray-600
transition-colors duration-fast
```

### 링크 카드

```tsx
<Card as="a" href="/post/1">
  내용
</Card>
```

## 레이아웃 패턴

### 수평 카드

```tsx
<Card className="flex flex-row">
  <CardMedia className="w-32 h-32 rounded-l-xl rounded-r-none" />
  <div className="flex flex-col">
    <CardHeader>제목</CardHeader>
    <CardContent>내용</CardContent>
  </div>
</Card>
```

### 그리드 카드

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  <Card>카드 1</Card>
  <Card>카드 2</Card>
  <Card>카드 3</Card>
</div>
```

### 리스트 카드

```tsx
<div className="space-y-4">
  <Card>카드 1</Card>
  <Card>카드 2</Card>
  <Card>카드 3</Card>
</div>
```

## 애니메이션

### 호버 효과

```css
transition-all duration-normal ease-in-out
hover:shadow-lg hover:-translate-y-0.5
```

### 등장 애니메이션

```css
animate-fade-in
/* 또는 */
animate-slide-in-up
```

## 접근성 (Accessibility)

1. **시멘틱 구조**: 적절한 heading 레벨 사용
2. **포커스 스타일**: 클릭 가능한 카드에 포커스 표시
3. **키보드 접근**: Enter/Space로 클릭 가능한 카드 활성화
4. **ARIA 속성**: 필요시 `role`, `aria-label` 추가

```tsx
<Card
  as="article"
  interactive
  tabIndex={0}
  onKeyDown={(e) => e.key === 'Enter' && onClick()}
  aria-label="게시글: 제목"
>
  <CardHeader>
    <CardTitle as="h3">제목</CardTitle>
  </CardHeader>
  <CardContent>내용</CardContent>
</Card>
```

## 사용 예시

```tsx
// 기본 카드
<Card>
  <CardHeader>
    <CardTitle>카드 제목</CardTitle>
    <CardDescription>카드 설명</CardDescription>
  </CardHeader>
  <CardContent>
    <p>카드 본문 내용입니다.</p>
  </CardContent>
  <CardFooter>
    <Button variant="ghost">취소</Button>
    <Button variant="primary">확인</Button>
  </CardFooter>
</Card>

// 이미지가 있는 카드
<Card>
  <CardMedia src="/image.jpg" alt="설명" />
  <CardContent>
    <CardTitle>이미지 카드</CardTitle>
    <p>이미지가 포함된 카드입니다.</p>
  </CardContent>
</Card>

// 클릭 가능한 카드
<Card as="a" href="/post/1" interactive>
  <CardContent>
    <CardTitle>클릭 가능한 카드</CardTitle>
    <p>클릭하면 상세 페이지로 이동합니다.</p>
  </CardContent>
</Card>

// Elevated 카드
<Card variant="elevated">
  <CardContent>
    <CardTitle>강조된 카드</CardTitle>
    <p>그림자로 부각된 카드입니다.</p>
  </CardContent>
</Card>
```

## 컴포넌트 구현 참조

카드 컴포넌트는 `src/components/atoms/` 또는 `src/components/molecules/`에 구현됩니다.
