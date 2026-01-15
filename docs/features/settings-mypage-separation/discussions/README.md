# 팀 토론: /settings와 /mypage 분리 설계

## 개요

| 항목 | 내용 |
|------|------|
| **날짜** | 2026-01-15 |
| **의제** | /settings 페이지와 /mypage 페이지 분리 설계 |
| **참여 팀** | PO, UX-UI, Frontend, Backend, Security |
| **결정** | ✅ 분리 진행 |

## 최종 결정 사항

### 페이지 구조

| 페이지 | 인증 | 주요 기능 |
|--------|------|----------|
| `/settings` | 불필요 | 테마, 언어, 앱정보 |
| `/mypage` | 필수 | 프로필, 계정정보, 로그아웃 |
| `/profile` | - | 삭제 (mypage로 통합) |

### /settings (Public)

- 테마 설정 (라이트/다크/시스템)
- 언어 설정 (한국어/English)
- 앱 정보 (버전, 약관, 개인정보처리방침)
- 저장소: localStorage

### /mypage (Protected)

- 프로필 섹션: 이미지, 닉네임, 이메일(읽기)
- 계정 섹션: 이메일 인증, 비밀번호 변경, 알림 설정
- 활동 섹션: 내 게시글, 내 댓글, 좋아요
- 액션: 로그아웃, 계정 탈퇴

## 팀별 주요 의견

### PO
- 비로그인 사용자 경험 향상으로 진입장벽 감소
- 정보 아키텍처 개선 효과

### UX-UI
- 명확한 네비게이션 구조
- /profile → /mypage 통합으로 중복 최소화

### Frontend
- 구현 복잡도 낮음 (3-4시간 예상)
- 라우트 분리 + 상태관리 분리

### Backend
- API 변경 불필요
- 기존 /users/me API 활용

### Security
- Least Privilege 원칙 준수
- /settings: 민감정보 저장 금지
- /mypage: 토큰 검증 필수

## 후속 조치

- [ ] PHASE 2: API Contract 정의
- [ ] PHASE 3: QA 테스트 계획 수립
- [ ] PHASE 4: TDD 기반 구현
