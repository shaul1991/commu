# Button 스타일 가이드

## 개요

버튼은 사용자 인터랙션의 핵심 요소입니다. 일관된 디자인과 명확한 피드백을 제공하여 사용자 경험을 향상시킵니다.

## 버튼 변형 (Variants)

### Primary Button

기본 액션 버튼으로 가장 중요한 행동을 유도합니다.

```tsx
<Button variant="primary">게시하기</Button>
```

| 속성 | 라이트 모드 | 다크 모드 |
|------|------------|----------|
| 배경색 | `primary-500` (#3B82F6) | `primary-500` (#3B82F6) |
| 텍스트 | `white` (#FFFFFF) | `white` (#FFFFFF) |
| 호버 배경 | `primary-600` (#2563EB) | `primary-400` (#60A5FA) |
| 활성 배경 | `primary-700` (#1D4ED8) | `primary-600` (#2563EB) |

**Tailwind 클래스:**
```css
bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700
```

### Secondary Button

보조 액션 버튼으로 primary보다 낮은 우선순위의 행동에 사용합니다.

```tsx
<Button variant="secondary">취소</Button>
```

| 속성 | 라이트 모드 | 다크 모드 |
|------|------------|----------|
| 배경색 | `gray-100` (#F3F4F6) | `gray-700` (#374151) |
| 텍스트 | `gray-700` (#374151) | `gray-200` (#E5E7EB) |
| 호버 배경 | `gray-200` (#E5E7EB) | `gray-600` (#4B5563) |
| 테두리 | `gray-200` (#E5E7EB) | `gray-600` (#4B5563) |

**Tailwind 클래스:**
```css
bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200
dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600
```

### Ghost Button

배경이 없는 투명 버튼으로 덜 강조되는 액션에 사용합니다.

```tsx
<Button variant="ghost">더 보기</Button>
```

| 속성 | 라이트 모드 | 다크 모드 |
|------|------------|----------|
| 배경색 | `transparent` | `transparent` |
| 텍스트 | `gray-600` (#4B5563) | `gray-300` (#D1D5DB) |
| 호버 배경 | `gray-100` (#F3F4F6) | `gray-800` (#1F2937) |

**Tailwind 클래스:**
```css
bg-transparent text-gray-600 hover:bg-gray-100
dark:text-gray-300 dark:hover:bg-gray-800
```

### Danger Button

삭제, 취소 등 위험한 행동에 사용합니다.

```tsx
<Button variant="danger">삭제하기</Button>
```

| 속성 | 라이트 모드 | 다크 모드 |
|------|------------|----------|
| 배경색 | `error-500` (#EF4444) | `error-600` (#DC2626) |
| 텍스트 | `white` (#FFFFFF) | `white` (#FFFFFF) |
| 호버 배경 | `error-600` (#DC2626) | `error-500` (#EF4444) |
| 활성 배경 | `error-700` (#B91C1C) | `error-700` (#B91C1C) |

**Tailwind 클래스:**
```css
bg-error-500 text-white hover:bg-error-600 active:bg-error-700
```

## 버튼 크기 (Sizes)

| 크기 | 높이 | 패딩 (좌우) | 폰트 크기 | 아이콘 크기 |
|------|------|-----------|----------|------------|
| `sm` | 32px (2rem) | 12px (0.75rem) | 14px (0.875rem) | 16px |
| `md` | 40px (2.5rem) | 16px (1rem) | 16px (1rem) | 20px |
| `lg` | 48px (3rem) | 24px (1.5rem) | 18px (1.125rem) | 24px |

**Tailwind 클래스:**
```css
/* Small */
h-8 px-3 text-sm gap-1.5

/* Medium (기본) */
h-10 px-4 text-base gap-2

/* Large */
h-12 px-6 text-lg gap-2.5
```

## 상태 (States)

### 비활성 상태 (Disabled)

```tsx
<Button disabled>비활성 버튼</Button>
```

| 속성 | 값 |
|------|-----|
| 투명도 | 0.5 (50%) |
| 커서 | `not-allowed` |
| 포인터 이벤트 | `none` |

**Tailwind 클래스:**
```css
disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
```

### 로딩 상태 (Loading)

```tsx
<Button loading>로딩 중...</Button>
```

- 버튼 텍스트 앞에 스피너 아이콘 표시
- 버튼 클릭 비활성화
- 텍스트 변경: "처리 중..." 또는 원래 텍스트 유지

**Tailwind 클래스:**
```css
relative cursor-wait
/* 스피너: animate-spin h-4 w-4 mr-2 */
```

### 포커스 상태 (Focus)

키보드 접근성을 위한 포커스 스타일입니다.

```css
focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500
```

## 아이콘 버튼

### 아이콘만 있는 버튼

```tsx
<Button variant="ghost" size="md" aria-label="메뉴">
  <MenuIcon />
</Button>
```

| 크기 | 너비/높이 | 아이콘 크기 |
|------|----------|------------|
| `sm` | 32px | 16px |
| `md` | 40px | 20px |
| `lg` | 48px | 24px |

**Tailwind 클래스:**
```css
/* Icon only button */
aspect-square p-0 justify-center
```

### 아이콘 + 텍스트

```tsx
<Button>
  <PlusIcon />
  <span>새 게시글</span>
</Button>
```

- 아이콘과 텍스트 사이 간격: 8px (0.5rem)
- 아이콘은 텍스트 왼쪽 또는 오른쪽에 배치 가능

## 전체 너비 버튼

모바일 화면이나 폼 제출에서 사용합니다.

```tsx
<Button fullWidth>가입하기</Button>
```

**Tailwind 클래스:**
```css
w-full
```

## 애니메이션

모든 버튼에 적용되는 기본 트랜지션:

```css
transition-colors duration-normal ease-in-out
/* duration-normal: 200ms */
```

## 접근성 (Accessibility)

1. **색상 대비**: WCAG AA 기준 4.5:1 이상 유지
2. **포커스 표시**: 키보드 포커스 시 outline 표시
3. **aria-label**: 아이콘만 있는 버튼에 필수
4. **disabled 속성**: 비활성 상태 명시
5. **로딩 상태**: `aria-busy="true"` 속성 추가

## 사용 예시

```tsx
// Primary 버튼
<Button variant="primary" size="md">
  게시하기
</Button>

// 아이콘 + 텍스트
<Button variant="secondary">
  <PlusIcon className="w-5 h-5" />
  <span>새 게시글</span>
</Button>

// 로딩 상태
<Button variant="primary" loading>
  처리 중...
</Button>

// 비활성 상태
<Button variant="primary" disabled>
  비활성
</Button>

// 위험 액션
<Button variant="danger">
  삭제하기
</Button>
```

## 컴포넌트 구현 참조

실제 Button 컴포넌트: `src/components/atoms/Button/Button.tsx`
