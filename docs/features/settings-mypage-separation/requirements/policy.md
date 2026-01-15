# PO 정책 결정: /settings와 /mypage 분리

## 정책 요약

### 1. 페이지 접근 정책

| 페이지 | 접근 권한 | 근거 |
|--------|----------|------|
| `/settings` | 모든 사용자 | 앱 진입장벽 최소화 |
| `/mypage` | 로그인 사용자만 | 민감정보 보호 |

### 2. 기능 배치 정책

#### /settings에 포함될 기능
| 기능 | 저장소 | 비고 |
|------|--------|------|
| 테마 설정 | localStorage | 시스템 연동 |
| 언어 설정 | localStorage | i18n |
| 앱 버전 | - | 읽기 전용 |
| 이용약관 | - | 외부 링크 |
| 개인정보처리방침 | - | 외부 링크 |

#### /mypage에 포함될 기능
| 기능 | API | 비고 |
|------|-----|------|
| 프로필 이미지 | PATCH /users/me | 업로드 |
| 닉네임/표시명 | PATCH /users/me | 수정 |
| 이메일 | GET /users/me | 읽기 전용 |
| 이메일 인증 상태 | GET /users/me | 상태 표시 |
| 비밀번호 변경 | POST /auth/change-password | 인증 필요 |
| 알림 설정 | PATCH /users/me | (추후 구현) |
| 내 게시글 | GET /users/me/posts | 목록 |
| 내 댓글 | GET /users/me/comments | 목록 |
| 좋아요한 글 | GET /users/me/likes | 목록 |
| 로그아웃 | POST /auth/logout | 토큰 무효화 |
| 계정 탈퇴 | DELETE /users/me | (추후 구현) |

### 3. 네비게이션 정책

```
비로그인 상태:
  - Header: 로그인 버튼
  - Settings 접근 가능 (Footer 또는 메뉴)

로그인 상태:
  - Header: 프로필 아이콘 → MyPage 링크
  - Bottom Nav: MyPage 탭 표시
  - Settings 접근 가능 (MyPage 내 또는 별도)
```

### 4. 마이그레이션 정책

| 현재 | 변경 후 | 처리 |
|------|---------|------|
| `/settings` | `/settings` | 인증 제거, 기능 축소 |
| `/profile` | `/mypage` | 리다이렉트 (301) |

### 5. 우선순위

1. **P0 (필수)**
   - /mypage 페이지 생성
   - /settings 인증 제거
   - /profile → /mypage 리다이렉트

2. **P1 (중요)**
   - 프로필 수정 기능
   - 비밀번호 변경 기능

3. **P2 (개선)**
   - 알림 설정
   - 계정 탈퇴

## 승인

- [x] PO 검토 완료
- [x] 정책 확정
- [x] 개발 착수 승인
