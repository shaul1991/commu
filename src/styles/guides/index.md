# 커뮤(Commu) 스타일 가이드 인덱스

## 개요

이 문서는 커뮤(Commu) 프로젝트의 디자인 시스템과 UI 컴포넌트 스타일 가이드를 안내합니다.

## 디자인 토큰

디자인 토큰은 디자인 시스템의 기초가 되는 값들입니다.

- **위치**: `/src/styles/tokens/design-tokens.json`
- **TypeScript 접근**: `/src/styles/tokens/index.ts`

### 포함 항목

| 카테고리 | 설명 |
|----------|------|
| **색상 (Colors)** | Primary, Secondary, Accent, Gray Scale, Semantic Colors |
| **타이포그래피 (Typography)** | 폰트 패밀리, 사이즈, 두께, 줄 높이, 프리셋 |
| **간격 (Spacing)** | 4px 기반 스케일 및 시맨틱 간격 |
| **테두리 반경 (Border Radius)** | xs ~ full 까지의 스케일 |
| **그림자 (Shadows)** | xs ~ 2xl, inner, 다크 모드 그림자 |
| **애니메이션 (Animation)** | 지속 시간, 이징 함수, 키프레임 |
| **Z-Index** | 레이어 스택 순서 |
| **브레이크포인트 (Breakpoints)** | 반응형 디자인 기준점 |

## TailwindCSS 4 테마

TailwindCSS 4의 새로운 CSS 기반 설정을 사용합니다.

- **위치**: `/src/app/globals.css`
- **@theme 지시자**: 커스텀 색상, 폰트, 간격, 애니메이션 정의

## 컴포넌트 스타일 가이드

### 기본 UI 컴포넌트

| 가이드 | 파일 | 설명 |
|--------|------|------|
| [Button](./button.md) | `button.md` | 버튼 변형, 크기, 상태, 아이콘 버튼 |
| [Input](./input.md) | `input.md` | 텍스트 입력, 상태, 라벨, Textarea, Select, Checkbox, Radio |
| [Card](./card.md) | `card.md` | 카드 컨테이너, 변형, 구성 요소 |
| [Modal](./modal.md) | `modal.md` | 모달 대화상자, 오버레이, 크기, 유형 |

### 커뮤니티 전용 컴포넌트

| 가이드 | 파일 | 설명 |
|--------|------|------|
| [게시글 카드](./post-card.md) | `post-card.md` | 게시글 목록 카드, 헤더, 콘텐츠, 푸터 |
| [댓글 UI](./comment.md) | `comment.md` | 댓글 섹션, 입력, 대댓글, 액션 |
| [인터랙션](./interactions.md) | `interactions.md` | 좋아요, 북마크 아이콘 및 애니메이션 |

## 색상 팔레트 요약

### Primary (Blue)

```
50: #EFF6FF  |  100: #DBEAFE  |  200: #BFDBFE  |  300: #93C5FD
400: #60A5FA |  500: #3B82F6  |  600: #2563EB  |  700: #1D4ED8
800: #1E40AF |  900: #1E3A8A  |  950: #172554
```

### Secondary (Purple)

```
50: #F5F3FF  |  100: #EDE9FE  |  200: #DDD6FE  |  300: #C4B5FD
400: #A78BFA |  500: #8B5CF6  |  600: #7C3AED  |  700: #6D28D9
800: #5B21B6 |  900: #4C1D95  |  950: #2E1065
```

### Accent (Orange)

```
50: #FFF7ED  |  100: #FFEDD5  |  200: #FED7AA  |  300: #FDBA74
400: #FB923C |  500: #F97316  |  600: #EA580C  |  700: #C2410C
800: #9A3412 |  900: #7C2D12  |  950: #431407
```

### Semantic Colors

| 유형 | 기본 색상 | 용도 |
|------|----------|------|
| Success | `#22C55E` | 성공, 완료, 긍정적 상태 |
| Warning | `#F59E0B` | 경고, 주의 |
| Error | `#EF4444` | 오류, 삭제, 위험 |
| Info | `#3B82F6` | 정보, 안내 |

## 타이포그래피 프리셋

| 프리셋 | 크기 | 두께 | 용도 |
|--------|------|------|------|
| h1 | 48px (3rem) | Bold | 페이지 제목 |
| h2 | 36px (2.25rem) | Bold | 섹션 제목 |
| h3 | 30px (1.875rem) | Semibold | 서브섹션 제목 |
| h4 | 24px (1.5rem) | Semibold | 카드 제목 |
| h5 | 20px (1.25rem) | Semibold | 소제목 |
| h6 | 18px (1.125rem) | Semibold | 작은 제목 |
| body-lg | 18px (1.125rem) | Regular | 큰 본문 |
| body | 16px (1rem) | Regular | 기본 본문 |
| body-sm | 14px (0.875rem) | Regular | 작은 본문 |
| caption | 12px (0.75rem) | Regular | 캡션, 보조 텍스트 |

## 간격 스케일

시맨틱 간격 (4px 기반):

| 토큰 | 값 | 픽셀 |
|------|-----|------|
| xs | 0.25rem | 4px |
| sm | 0.5rem | 8px |
| md | 1rem | 16px |
| lg | 1.5rem | 24px |
| xl | 2rem | 32px |
| 2xl | 3rem | 48px |
| 3xl | 4rem | 64px |

## 접근성 가이드라인

모든 컴포넌트는 다음 접근성 기준을 준수합니다:

1. **색상 대비**: WCAG AA 기준 (4.5:1) 이상
2. **포커스 표시**: 명확한 포커스 아웃라인
3. **키보드 접근**: Tab, Enter, Space로 모든 인터랙션 가능
4. **ARIA 속성**: 적절한 role, aria-label, aria-describedby 사용
5. **시맨틱 마크업**: 의미있는 HTML 태그 사용

## 반응형 브레이크포인트

| 브레이크포인트 | 값 | 용도 |
|----------------|-----|------|
| sm | 640px | 작은 태블릿 |
| md | 768px | 태블릿 |
| lg | 1024px | 작은 데스크톱 |
| xl | 1280px | 데스크톱 |
| 2xl | 1536px | 큰 데스크톱 |

## 다크 모드

다크 모드는 `data-theme="dark"` 속성으로 활성화됩니다.

```html
<html data-theme="dark">
```

CSS 변수가 자동으로 다크 모드 값으로 전환됩니다.

## 애니메이션

### 지속 시간

| 토큰 | 값 | 용도 |
|------|-----|------|
| instant | 50ms | 즉각적 피드백 |
| fast | 100ms | 빠른 트랜지션 |
| normal | 200ms | 기본 트랜지션 |
| slow | 300ms | 느린 트랜지션 |
| slower | 400ms | 모달, 드로어 |

### 이징 함수

| 토큰 | 값 | 용도 |
|------|-----|------|
| linear | linear | 균일한 속도 |
| ease-in | cubic-bezier(0.4, 0, 1, 1) | 시작이 느림 |
| ease-out | cubic-bezier(0, 0, 0.2, 1) | 끝이 느림 |
| ease-in-out | cubic-bezier(0.4, 0, 0.2, 1) | 양쪽이 느림 |
| bounce | cubic-bezier(0.68, -0.55, 0.265, 1.55) | 튀는 효과 |

## 사용 방법

### 디자인 토큰 가져오기

```typescript
import { colors, typography, spacing } from '@/styles/tokens';

// 사용 예시
const primaryColor = colors.primary[500]; // "#3B82F6"
const headingFont = typography.presets.h1; // { fontSize, fontWeight, ... }
```

### Tailwind 커스텀 클래스 사용

```tsx
// 커스텀 색상
<div className="bg-primary-500 text-white">Primary Button</div>

// 커스텀 간격
<div className="p-md gap-sm">Content</div>

// 커스텀 애니메이션
<div className="animate-fade-in">Animated Content</div>
```

## 파일 구조

```
src/styles/
├── tokens/
│   ├── design-tokens.json    # 디자인 토큰 정의
│   └── index.ts              # TypeScript export
└── guides/
    ├── index.md              # 이 파일
    ├── button.md             # Button 스타일 가이드
    ├── input.md              # Input 스타일 가이드
    ├── card.md               # Card 스타일 가이드
    ├── modal.md              # Modal 스타일 가이드
    ├── post-card.md          # 게시글 카드 스타일 가이드
    ├── comment.md            # 댓글 UI 스타일 가이드
    └── interactions.md       # 좋아요/북마크 스타일 가이드
```

## 관련 문서

- 프로젝트 구조: `/src/STRUCTURE.md`
- 컴포넌트 구현: `/src/components/`
- 유틸리티 함수: `/src/lib/utils.ts`
