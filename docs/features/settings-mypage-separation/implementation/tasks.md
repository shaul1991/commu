# 구현 태스크: /settings & /mypage 분리

## Frontend 태스크

### FE-01: /mypage 페이지 생성
- **파일**: `src/app/mypage/page.tsx`
- **내용**:
  - useRequireAuth 적용
  - 프로필 헤더 컴포넌트
  - 메뉴 섹션 (프로필 관리, 내 활동, 계정)
  - 로그아웃 버튼
- **의존성**: 없음
- **예상 시간**: 2시간

### FE-02: /settings 페이지 수정
- **파일**: `src/app/settings/page.tsx`
- **내용**:
  - useRequireAuth 제거
  - 계정 관련 섹션 제거
  - 테마/언어/앱정보만 유지
- **의존성**: FE-01
- **예상 시간**: 1시간

### FE-03: /profile 리다이렉트 설정
- **파일**: `src/app/profile/page.tsx` 또는 `next.config.ts`
- **내용**:
  - /profile → /mypage 301 리다이렉트
- **의존성**: FE-01
- **예상 시간**: 30분

### FE-04: 네비게이션 업데이트
- **파일**:
  - `src/components/organisms/Header.tsx`
  - `src/components/organisms/BottomNav.tsx`
- **내용**:
  - 프로필 드롭다운에 마이페이지 링크
  - Bottom Nav에 MY 탭 추가
- **의존성**: FE-01
- **예상 시간**: 1시간

### FE-05: 프로필 수정 페이지
- **파일**: `src/app/mypage/edit/page.tsx`
- **내용**:
  - 프로필 수정 폼
  - 이미지 업로드
  - API 연동
- **의존성**: FE-01
- **예상 시간**: 2시간

### FE-06: 비밀번호 변경 페이지
- **파일**: `src/app/mypage/password/page.tsx`
- **내용**:
  - 비밀번호 변경 폼
  - 유효성 검사
  - API 연동
- **의존성**: FE-01
- **예상 시간**: 1.5시간

### FE-07: 활동 목록 페이지들
- **파일**:
  - `src/app/mypage/posts/page.tsx`
  - `src/app/mypage/comments/page.tsx`
  - `src/app/mypage/likes/page.tsx`
  - `src/app/mypage/bookmarks/page.tsx`
- **내용**:
  - 목록 조회 및 표시
  - 페이지네이션
  - 빈 상태 처리
- **의존성**: FE-01, BE-01
- **예상 시간**: 3시간

---

## Backend 태스크

### BE-01: 내 게시글/댓글 목록 API
- **파일**: `src/users/users.controller.ts`
- **내용**:
  - GET /users/me/posts
  - GET /users/me/comments
  - 페이지네이션 지원
- **의존성**: 없음
- **예상 시간**: 2시간

### BE-02: 프로필 이미지 업로드 API
- **파일**: `src/users/users.controller.ts`
- **내용**:
  - PATCH /users/me/profile-image
  - 파일 업로드 처리
  - S3 또는 로컬 저장
- **의존성**: 없음
- **예상 시간**: 2시간

---

## 테스트 태스크

### TEST-01: Frontend 단위 테스트
- **파일**: `src/app/mypage/__tests__/`
- **내용**:
  - 컴포넌트 렌더링 테스트
  - 사용자 상호작용 테스트
- **의존성**: FE-01 ~ FE-07
- **예상 시간**: 2시간

### TEST-02: Backend 단위 테스트
- **파일**: `src/users/users.controller.spec.ts`
- **내용**:
  - API 엔드포인트 테스트
  - 인증/인가 테스트
- **의존성**: BE-01, BE-02
- **예상 시간**: 1.5시간

### TEST-03: E2E 테스트 (Playwright)
- **파일**: `e2e/settings-mypage.spec.ts`
- **내용**:
  - 전체 사용자 흐름 테스트
  - 인증 시나리오 테스트
- **의존성**: FE-*, BE-*
- **예상 시간**: 3시간

---

## 태스크 순서

```
1. BE-01 (내 게시글/댓글 API) ─┐
                               ├─→ FE-01 (mypage 페이지)
2. BE-02 (이미지 업로드 API) ──┘        │
                                        ↓
                               ├─→ FE-02 (settings 수정)
                               ├─→ FE-03 (profile 리다이렉트)
                               ├─→ FE-04 (네비게이션)
                               ├─→ FE-05 (프로필 수정)
                               ├─→ FE-06 (비밀번호 변경)
                               └─→ FE-07 (활동 목록)
                                        │
                                        ↓
                               TEST-01, TEST-02
                                        │
                                        ↓
                                   TEST-03 (E2E)
```

---

## 체크리스트

### Phase 4 완료 조건
- [ ] FE-01 ~ FE-07 완료
- [ ] BE-01 ~ BE-02 완료
- [ ] TEST-01 ~ TEST-02 통과
- [ ] 코드 리뷰 완료

### Phase 5 완료 조건
- [ ] TEST-03 E2E 통과
- [ ] Visual Regression 통과
- [ ] 성능 테스트 통과
