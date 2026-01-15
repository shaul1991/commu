# 새 글 작성 페이지 개선 - 팀 토론 결과

## 토론 개요

| 항목 | 내용 |
|------|------|
| **토론 주제** | 새 글 작성 페이지 (Write Page) 개선 |
| **토론 일시** | 2026-01-15 |
| **참여 팀** | PO, UX/UI, Frontend, Backend, Security |
| **결정 유형** | 기술 + 제품 |

## 요구사항

1. **미리보기 완성** - 현재 버튼만 있고 기능 없음
2. **이미지 추가 기능** - MinIO 저장소 사용
3. **대표 참고 링크 input 영역 추가**
4. **태그 유사 추천 기능 추가**

---

## 최종 합의 사항

### Phase 1 (MVP) 범위

#### 1. 미리보기 기능
| 항목 | 결정 사항 |
|------|----------|
| **UI 패턴** | 모달 다이얼로그 (화면의 80%) |
| **트리거** | 헤더 우측 '미리보기' 버튼 클릭 |
| **내용** | 제목, 채널, 태그, 본문(마크다운 렌더링), 이미지 |
| **마크다운 처리** | `react-markdown` + `remark-gfm` |
| **보안** | `DOMPurify`로 XSS 방지 (필수) |
| **모바일** | 전체 화면 모달 |

#### 2. 이미지 추가 기능
| 항목 | 결정 사항 |
|------|----------|
| **저장소** | MinIO |
| **업로드 방식** | Pre-signed URL (서버 부하 감소) |
| **최대 개수** | 게시글당 10장 |
| **파일 크기** | 단일 10MB, 총 30MB |
| **지원 포맷** | JPEG, PNG, GIF, WebP |
| **업로드 UI** | 클릭, 드래그앤드롭, 붙여넣기(Ctrl+V) |
| **결과** | 마크다운 형식 `![이미지](URL)` 자동 삽입 |

#### 3. 대표 참고 링크
| 항목 | 결정 사항 |
|------|----------|
| **개수** | 게시글당 1개 |
| **위치** | 태그 입력 영역 위 |
| **유효성** | URL 패턴 정규식 검증 |
| **프로토콜** | http/https만 허용 |
| **라벨** | "참고 링크 (선택사항)" |

#### 4. 태그 유사 추천
| 항목 | 결정 사항 |
|------|----------|
| **트리거** | 2글자 이상 입력 시 |
| **디바운스** | 300ms |
| **표시 개수** | 최대 5개 추천 |
| **UI 패턴** | 드롭다운 자동완성 (Combobox) |
| **인기 태그** | 입력 필드 포커스 시 표시 |

### Phase 2 (향후)
- OG 메타데이터 프리뷰 카드
- 이미지 썸네일 자동 생성
- 임시저장 기능
- 바이러스 스캔 (ClamAV)
- 실시간 미리보기 (좌우 분할)

---

## 팀별 의견 요약

### PO (Product Owner)
- 미리보기: 높은 우선순위 (기존 버튼이 동작하지 않아 사용자 혼란)
- 이미지: 게시글당 최대 10장, 총 30MB 제한
- 참고 링크: 게시글당 1개, MVP에서는 URL 입력만
- 태그: 기존 태그 기반 자동완성 + 인기 태그 추천

### UX/UI
- 미리보기: 모달 다이얼로그, ESC/배경클릭으로 닫기
- 이미지: 드래그앤드롭 시 드롭 영역 하이라이트 필요
- 참고 링크: URL 입력 필드 + 유효성 표시
- 태그: 키보드 네비게이션 지원 (화살표, Enter)

### Frontend
- 미리보기: `PreviewModal` 컴포넌트 신규 생성
- 이미지: `useImageUpload` 커스텀 훅, 커서 위치에 마크다운 삽입
- 참고 링크: URL 정규식 검증
- 태그: `TagAutocomplete` 컴포넌트 (디바운스 적용)

### Backend
- 이미지 API: `POST /api/upload/images` (Pre-signed URL 방식)
- 태그 API: `GET /api/tags/suggest`, `GET /api/tags/popular`
- Post 스키마: `images JSONB`, `reference_url VARCHAR(2048)` 추가
- MinIO 구조: `images/{userId}/{year}/{month}/{uuid}.{ext}`

### Security
- XSS 방지: `DOMPurify` 필수 적용
- 이미지 보안: MIME 타입 + 매직 바이트 검증, EXIF 제거
- Rate Limiting: 업로드 분당 10회, 태그 검색 분당 30회
- SSRF 방지: OG 크롤링 시 내부 IP 차단 (Phase 2)

---

## 충돌 해결 내역

| 항목 | 상충 내용 | 해결 방안 |
|------|----------|----------|
| 이미지 개수 | PO: 5~10장 범위 | **10장**으로 확정 (Backend/Security 동의) |
| OG 프리뷰 | UX: 필요 / Security: SSRF 우려 | **Phase 2로 연기**, 서버 측 크롤링 + IP 차단 적용 |
| 마크다운 라이브러리 | react-markdown vs marked | **react-markdown** + DOMPurify 조합 (Security 승인) |
| 바이러스 스캔 | Security 권장 | **Phase 2로 연기** (비용/시간 고려) |

---

## API 명세

### 1. 이미지 업로드

```
POST /api/upload/images
Content-Type: multipart/form-data

Request:
- files: File[] (최대 10개)

Response:
{
  "success": true,
  "data": {
    "images": [
      {
        "id": "uuid",
        "url": "https://minio.example.com/bucket/filename.jpg",
        "filename": "original-name.jpg",
        "size": 102400,
        "mimeType": "image/jpeg"
      }
    ]
  }
}
```

### 2. 태그 추천

```
GET /api/tags/suggest?q={query}&limit=5

Response:
{
  "success": true,
  "data": {
    "tags": [
      { "name": "react", "count": 150 },
      { "name": "reactnative", "count": 45 }
    ]
  }
}
```

### 3. 인기 태그

```
GET /api/tags/popular?limit=10

Response:
{
  "success": true,
  "data": {
    "tags": [
      { "name": "javascript", "count": 500 },
      { "name": "typescript", "count": 420 }
    ]
  }
}
```

### 4. 게시글 생성 (수정)

```
POST /api/posts

Request:
{
  "title": "...",
  "content": "...",
  "channelSlug": "...",
  "tags": [...],
  "images": ["url1", "url2"],      // 새로 추가
  "referenceUrl": "https://..."    // 새로 추가
}
```

---

## 타입 변경

### src/types/index.ts

```typescript
export interface Post {
  // 기존 필드들...
  images?: string[];        // 이미지 URL 배열 (새로 추가)
  referenceUrl?: string;    // 참고 링크 (새로 추가)
}

// 게시글 작성 입력 타입 (새로 추가)
export interface CreatePostInput {
  title: string;
  content: string;
  channelSlug: string;
  tags: string[];
  images?: string[];
  referenceUrl?: string;
}
```

---

## 후속 조치 (Action Items)

| 담당 팀 | 작업 항목 | 우선순위 | 예상 소요 |
|---------|----------|----------|----------|
| **Backend** | 이미지 업로드 API 구현 (MinIO 연동) | P0 | 3일 |
| **Backend** | 태그 추천 API 구현 | P0 | 1일 |
| **Backend** | Post 스키마 확장 (images, referenceUrl) | P0 | 0.5일 |
| **Backend** | 게시글 생성 API 수정 | P0 | 0.5일 |
| **Frontend** | PreviewModal 컴포넌트 구현 | P0 | 2일 |
| **Frontend** | ImageUpload 컴포넌트 구현 | P0 | 3일 |
| **Frontend** | TagAutocomplete 컴포넌트 구현 | P0 | 2일 |
| **Frontend** | ReferenceUrlInput 컴포넌트 구현 | P1 | 1일 |
| **Frontend** | 타입 정의 업데이트 | P0 | 0.5일 |
| **DevOps** | MinIO 버킷 및 정책 설정 | P0 | 1일 |
| **Security** | CSP 헤더 설정 검토 | P1 | 0.5일 |

---

## 기술 스택 확정

| 영역 | 선택 기술 |
|------|----------|
| 마크다운 렌더링 | `react-markdown` + `remark-gfm` |
| XSS 방지 | `DOMPurify` |
| 이미지 저장소 | MinIO (Pre-signed URL 방식) |
| 태그 자동완성 | Debounced API (300ms) |
| 상태 관리 | React Query (기존 구조 활용) |

---

## 참고 문서

- 현재 코드: `src/app/write/page.tsx`
- API 모듈: `src/lib/api/posts.ts`
- 훅: `src/hooks/usePost.ts`
- 타입: `src/types/index.ts`

---

*본 문서는 2026-01-15 팀 토론 결과를 기록한 것입니다.*
