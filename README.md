# 커뮤 (Commu)

> 모던하고 클린한, MZ세대를 위한 신세대 커뮤니티

## 시작하기

### 요구사항

- Node.js 18+
- npm 9+

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인하세요.

### 빌드

```bash
npm run build
npm run start
```

## 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: TailwindCSS 4
- **State**: Zustand, React Query
- **Icons**: Lucide React
- **Animation**: Framer Motion

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css         # 글로벌 스타일 및 디자인 토큰
│   ├── layout.tsx          # 루트 레이아웃
│   └── page.tsx            # 홈 페이지
├── components/             # UI 컴포넌트 (Atomic Design)
│   ├── atoms/              # 기본 UI 요소 (Button, Input, etc.)
│   ├── molecules/          # 복합 컴포넌트
│   ├── organisms/          # 섹션 컴포넌트 (Header, Sidebar, etc.)
│   └── templates/          # 페이지 레이아웃
├── contexts/               # React Context
│   └── ThemeContext.tsx    # 테마 상태 관리
├── hooks/                  # 커스텀 훅
├── lib/                    # 유틸리티 함수
│   └── utils.ts            # 공통 유틸리티
├── constants/              # 상수
├── types/                  # TypeScript 타입
└── styles/                 # 추가 스타일
```

## 주요 기능

- 라이트/다크 테마 지원 (시스템 설정 연동)
- 반응형 디자인 (Mobile First)
- 접근성 (WCAG 2.1 AA 준수)
- 디자인 시스템 기반 일관된 UI

## 디자인 시스템

### 컴러

- Primary: Blue (#3B82F6)
- Gray Scale: 50-950
- Semantic: Success, Warning, Error, Info

### 브레이크포인트

| 이름 | 범위 | 레이아웃 |
|------|------|----------|
| Mobile | < 640px | 1컴럼, 하단 탭 |
| Tablet | 640-1023px | 1컴럼, 하단 탭 |
| Desktop | 1024-1279px | 사이드바 + 콘텐츠 |
| Wide | ≥ 1280px | 3컴럼 |

### 컴포넌트

- **Atoms**: Button, Input, Avatar, Badge, ThemeToggle
- **Organisms**: Header, Sidebar, BottomNav
- **Templates**: MainLayout

## 스크립트

```bash
npm run dev       # 개발 서버
npm run build     # 프로덕션 빌드
npm run start     # 프로덕션 서버
npm run lint      # ESLint 검사
```

## 라이선스

Private
