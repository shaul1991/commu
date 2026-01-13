# Input 스타일 가이드

## 개요

입력 필드는 사용자로부터 데이터를 수집하는 핵심 폼 요소입니다. 명확한 상태 표시와 일관된 디자인으로 사용성을 높입니다.

## 기본 스타일

### 텍스트 입력 (Text Input)

```tsx
<Input type="text" placeholder="이름을 입력하세요" />
```

| 속성 | 라이트 모드 | 다크 모드 |
|------|------------|----------|
| 배경색 | `white` (#FFFFFF) | `gray-800` (#1F2937) |
| 테두리 | `gray-200` (#E5E7EB) | `gray-700` (#374151) |
| 텍스트 | `gray-900` (#111827) | `gray-100` (#F3F4F6) |
| 플레이스홀더 | `gray-400` (#9CA3AF) | `gray-500` (#6B7280) |

**Tailwind 클래스:**
```css
w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5
text-gray-900 placeholder:text-gray-400
dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500
```

## 입력 필드 크기 (Sizes)

| 크기 | 높이 | 패딩 (좌우) | 폰트 크기 |
|------|------|-----------|----------|
| `sm` | 36px (2.25rem) | 12px (0.75rem) | 14px (0.875rem) |
| `md` | 44px (2.75rem) | 16px (1rem) | 16px (1rem) |
| `lg` | 52px (3.25rem) | 20px (1.25rem) | 18px (1.125rem) |

**Tailwind 클래스:**
```css
/* Small */
h-9 px-3 text-sm

/* Medium (기본) */
h-11 px-4 text-base

/* Large */
h-13 px-5 text-lg
```

## 상태 (States)

### 기본 상태 (Default)

```css
border-gray-200 dark:border-gray-700
```

### 포커스 상태 (Focus)

```tsx
<Input autoFocus />
```

| 속성 | 값 |
|------|-----|
| 테두리 색상 | `primary-500` (#3B82F6) |
| 테두리 두께 | 2px |
| 아웃라인 | `ring-2 ring-primary-500/20` |

**Tailwind 클래스:**
```css
focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none
```

### 호버 상태 (Hover)

```css
hover:border-gray-300 dark:hover:border-gray-600
```

### 에러 상태 (Error)

```tsx
<Input error errorMessage="필수 입력 항목입니다" />
```

| 속성 | 라이트 모드 | 다크 모드 |
|------|------------|----------|
| 테두리 | `error-500` (#EF4444) | `error-400` (#F87171) |
| 배경 | `error-50` (#FEF2F2) | `error-900/10` |
| 에러 메시지 | `error-600` (#DC2626) | `error-400` (#F87171) |

**Tailwind 클래스:**
```css
border-error-500 bg-error-50 focus:border-error-500 focus:ring-error-500/20
dark:border-error-400 dark:bg-error-900/10
```

### 성공 상태 (Success)

```tsx
<Input success />
```

| 속성 | 라이트 모드 | 다크 모드 |
|------|------------|----------|
| 테두리 | `success-500` (#22C55E) | `success-400` (#4ADE80) |
| 아이콘 | `success-500` | `success-400` |

**Tailwind 클래스:**
```css
border-success-500 focus:border-success-500 focus:ring-success-500/20
dark:border-success-400
```

### 비활성 상태 (Disabled)

```tsx
<Input disabled />
```

| 속성 | 값 |
|------|-----|
| 배경색 | `gray-100` / `gray-800` |
| 텍스트 | `gray-400` / `gray-500` |
| 커서 | `not-allowed` |

**Tailwind 클래스:**
```css
disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed
dark:disabled:bg-gray-800 dark:disabled:text-gray-500
```

### 읽기 전용 상태 (Read-only)

```tsx
<Input readOnly value="읽기 전용 값" />
```

**Tailwind 클래스:**
```css
read-only:bg-gray-50 read-only:cursor-default
dark:read-only:bg-gray-900
```

## 라벨 (Label)

```tsx
<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
  이메일 <span className="text-error-500">*</span>
</label>
<Input id="email" type="email" required />
```

| 속성 | 라이트 모드 | 다크 모드 |
|------|------------|----------|
| 텍스트 | `gray-700` (#374151) | `gray-200` (#E5E7EB) |
| 폰트 크기 | 14px (0.875rem) | 14px |
| 폰트 두께 | medium (500) | medium |
| 하단 여백 | 6px (0.375rem) | 6px |

**Tailwind 클래스:**
```css
block text-sm font-medium text-gray-700 mb-1.5
dark:text-gray-200
```

## 도움말 텍스트 (Helper Text)

```tsx
<Input />
<p className="mt-1.5 text-sm text-gray-500">8자 이상 입력해주세요</p>
```

**Tailwind 클래스:**
```css
mt-1.5 text-sm text-gray-500 dark:text-gray-400
```

## 에러 메시지 (Error Message)

```tsx
<Input error />
<p className="mt-1.5 text-sm text-error-600">필수 입력 항목입니다</p>
```

**Tailwind 클래스:**
```css
mt-1.5 text-sm text-error-600 dark:text-error-400
```

## 아이콘이 있는 입력

### 왼쪽 아이콘

```tsx
<div className="relative">
  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
  <Input className="pl-10" placeholder="검색어를 입력하세요" />
</div>
```

### 오른쪽 아이콘

```tsx
<div className="relative">
  <Input className="pr-10" type="password" />
  <EyeIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer" />
</div>
```

## Textarea

여러 줄 입력을 위한 텍스트 영역입니다.

```tsx
<Textarea placeholder="내용을 입력하세요" rows={4} />
```

| 속성 | 값 |
|------|-----|
| 최소 높이 | 100px |
| 패딩 | 16px (1rem) |
| 리사이즈 | `resize-y` (세로만) |
| 줄 높이 | 1.5 |

**Tailwind 클래스:**
```css
w-full min-h-[100px] px-4 py-3 resize-y
bg-white border border-gray-200 rounded-lg
text-gray-900 placeholder:text-gray-400 leading-relaxed
dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100
```

## Select (드롭다운)

```tsx
<Select>
  <option value="">선택하세요</option>
  <option value="1">옵션 1</option>
  <option value="2">옵션 2</option>
</Select>
```

**Tailwind 클래스:**
```css
w-full h-11 px-4 pr-10 text-base
bg-white border border-gray-200 rounded-lg
text-gray-900 cursor-pointer appearance-none
bg-[url('data:image/svg+xml,...')] bg-no-repeat bg-[right_1rem_center] bg-[length:1rem]
```

## Checkbox

```tsx
<label className="flex items-center gap-2 cursor-pointer">
  <input type="checkbox" className="checkbox" />
  <span className="text-sm text-gray-700">동의합니다</span>
</label>
```

| 속성 | 값 |
|------|-----|
| 크기 | 18px x 18px |
| 테두리 반경 | 4px (0.25rem) |
| 체크 색상 | `primary-500` |
| 체크 아이콘 | 흰색 체크마크 |

**Tailwind 클래스:**
```css
w-[18px] h-[18px] rounded border border-gray-300
checked:bg-primary-500 checked:border-primary-500
focus:ring-2 focus:ring-primary-500/20
```

## Radio

```tsx
<label className="flex items-center gap-2 cursor-pointer">
  <input type="radio" name="option" className="radio" />
  <span className="text-sm text-gray-700">옵션 1</span>
</label>
```

| 속성 | 값 |
|------|-----|
| 크기 | 18px x 18px |
| 테두리 반경 | 50% (원형) |
| 선택 색상 | `primary-500` |
| 내부 원 크기 | 8px |

**Tailwind 클래스:**
```css
w-[18px] h-[18px] rounded-full border border-gray-300
checked:border-primary-500 checked:bg-primary-500
checked:before:content-[''] checked:before:block checked:before:w-2 checked:before:h-2
checked:before:rounded-full checked:before:bg-white checked:before:m-auto
```

## 애니메이션

포커스 트랜지션:
```css
transition-[border-color,box-shadow] duration-normal ease-in-out
```

## 접근성 (Accessibility)

1. **라벨 연결**: `id`와 `htmlFor`로 라벨과 입력 필드 연결
2. **필수 표시**: 필수 입력 항목에 `*` 표시 및 `required` 속성
3. **에러 연결**: `aria-describedby`로 에러 메시지 연결
4. **포커스 표시**: 명확한 포커스 스타일 유지
5. **자동 완성**: 적절한 `autocomplete` 속성 사용

```tsx
<div>
  <label htmlFor="email">이메일 <span className="text-error-500">*</span></label>
  <Input
    id="email"
    type="email"
    required
    aria-required="true"
    aria-invalid={hasError}
    aria-describedby={hasError ? "email-error" : undefined}
  />
  {hasError && <p id="email-error" role="alert">올바른 이메일을 입력하세요</p>}
</div>
```

## 사용 예시

```tsx
// 기본 입력
<Input type="text" placeholder="이름" />

// 라벨과 함께
<div>
  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
    이름 <span className="text-error-500">*</span>
  </label>
  <Input id="name" type="text" required />
</div>

// 에러 상태
<div>
  <Input type="email" error />
  <p className="mt-1.5 text-sm text-error-600">올바른 이메일을 입력하세요</p>
</div>

// 아이콘과 함께
<div className="relative">
  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
  <Input className="pl-10" placeholder="검색" />
</div>

// 텍스트 영역
<Textarea placeholder="내용을 입력하세요" rows={4} />
```

## 컴포넌트 구현 참조

실제 Input 컴포넌트: `src/components/atoms/Input/Input.tsx`
