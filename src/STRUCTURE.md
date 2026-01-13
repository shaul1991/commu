# Commu 프로젝트 폴더 구조 가이드

## 개요

이 문서는 Commu 프로젝트의 프론트엔드 폴더 구조를 설명합니다.

## 폴더 구조

```
src/
├── app/                    # Next.js App Router
│   ├── (routes)/          # 페이지 라우트
│   ├── layout.tsx         # 루트 레이아웃
│   ├── page.tsx           # 홈 페이지
│   └── globals.css        # 전역 스타일 (CSS Variables, Tailwind)
│
├── components/            # 컴포넌트 (Atomic Design)
│   ├── atoms/             # 기본 UI 컴포넌트
│   │   ├── Button.tsx     # 버튼 컴포넌트
│   │   ├── Input.tsx      # 입력 필드
│   │   ├── Avatar.tsx     # 아바타
│   │   ├── Badge.tsx      # 배지
│   │   └── ThemeToggle.tsx # 테마 토글
│   │
│   ├── molecules/         # 조합 컴포넌트
│   │   ├── AuthInput.tsx  # 인증 입력 필드
│   │   └── SocialLoginButtons.tsx # 소셜 로그인 버튼
│   │
│   ├── organisms/         # 복합 컴포넌트
│   │   ├── Header.tsx     # 헤더
│   │   ├── Sidebar.tsx    # 사이드바
│   │   └── BottomNav.tsx  # 하단 네비게이션
│   │
│   └── templates/         # 페이지 템플릿
│       └── MainLayout.tsx # 메인 레이아웃
│
├── contexts/              # React Context
│   └── ThemeContext.tsx   # 테마 컨텍스트
│
├── hooks/                 # 커스텀 훅
│   ├── useAuth.ts         # 인증 훅
│   └── index.ts           # Barrel export
│
├── lib/                   # 유틸리티 및 라이브러리
│   ├── utils.ts           # 유틸리티 함수
│   └── api/               # API 클라이언트
│       ├── client.ts      # API 클라이언트 설정
│       └── auth.ts        # 인증 API
│
├── mocks/                 # Mock 데이터 (개발/테스트용)
│   └── factories/         # 팩토리 함수
│       ├── userFactory.ts     # 사용자 Mock 데이터
│       ├── postFactory.ts     # 게시글 Mock 데이터
│       ├── commentFactory.ts  # 댓글 Mock 데이터
│       └── index.ts           # Barrel export
│
├── stores/                # Zustand 상태 관리
│   ├── authStore.ts       # 인증 상태
│   ├── uiStore.ts         # UI 상태 (사이드바, 모달, 토스트)
│   └── index.ts           # Barrel export
│
└── types/                 # TypeScript 타입 정의
    └── index.ts           # 공통 타입 정의
```

## 경로 별칭

`tsconfig.json`에서 설정된 경로 별칭:

```json
{
  "paths": {
    "@/*": ["./src/*"]
  }
}
```

**사용 예시:**
```typescript
// 권장: 경로 별칭 사용
import { Button } from '@/components/atoms';
import { createMockUser } from '@/mocks/factories';
import { useUIStore, toast } from '@/stores';
import type { User, Post } from '@/types';

// 비권장: 상대 경로
import { Button } from '../../../components/atoms';
```

## 주요 컨벤션

### 1. 컴포넌트 작성

- **Atomic Design**: atoms → molecules → organisms → templates 순으로 조합
- **Barrel Export**: 각 폴더에 `index.ts` 파일로 re-export
- **테스트 파일**: `__tests__/` 폴더 내에 `.test.tsx` 확장자로 작성

### 2. 상태 관리

- **서버 상태**: `@tanstack/react-query` 사용
- **클라이언트 상태**: `zustand` 사용
- **테마**: React Context (`ThemeContext`)

### 3. Mock 데이터

```typescript
// 개발/테스트 시 Mock 데이터 사용
import { createMockUser, createMockPosts } from '@/mocks/factories';

const mockUser = createMockUser({ displayName: '테스트 유저' });
const mockPosts = createMockPosts(10, { channelSlug: 'tech' });
```

### 4. UI 상태 관리

```typescript
import { useSidebar, useModal, toast } from '@/stores';

// 사이드바
const { isOpen, toggle } = useSidebar();

// 모달
const { open: openModal, close: closeModal } = useModal();
openModal('confirm', {
  title: '삭제 확인',
  message: '정말 삭제하시겠습니까?'
});

// 토스트
toast.success('저장되었습니다.');
toast.error('오류가 발생했습니다.');
```

## 파일 명명 규칙

| 유형 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 | PascalCase | `Button.tsx`, `UserProfile.tsx` |
| 훅 | camelCase, use 접두사 | `useAuth.ts`, `useDebounce.ts` |
| 유틸리티 | camelCase | `utils.ts`, `formatDate.ts` |
| 스토어 | camelCase, Store 접미사 | `authStore.ts`, `uiStore.ts` |
| 팩토리 | camelCase, Factory 접미사 | `userFactory.ts` |
| 타입 | PascalCase | `types/index.ts` |
| 테스트 | `.test.ts(x)` 확장자 | `Button.test.tsx` |
