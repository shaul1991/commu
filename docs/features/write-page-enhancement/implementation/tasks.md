# 구현 태스크 목록

## 개요

| 항목 | 내용 |
|------|------|
| 기능 | 새 글 작성 페이지 개선 |
| 총 태스크 | 12개 |
| 예상 소요 | Frontend 8일 |

---

## 태스크 목록

### Phase 4-1: 타입 정의 및 API 클라이언트

#### TASK-001: 타입 정의 확장
- **파일**: `src/types/index.ts`
- **변경 내용**:
  - `Post` 인터페이스에 `images?: string[]`, `referenceUrl?: string` 추가
  - `CreatePostInput` 인터페이스 신규 생성
  - `UploadedImage`, `TagSuggestion` 타입 추가
- **테스트**: 타입 체크 통과

#### TASK-002: 이미지 업로드 API 클라이언트
- **파일**: `src/lib/api/upload.ts` (신규)
- **구현**:
  - `uploadImages(files: File[])` 함수
  - multipart/form-data 전송
  - 에러 핸들링
- **테스트**: 모킹된 API 호출 테스트

#### TASK-003: 태그 API 클라이언트
- **파일**: `src/lib/api/tags.ts` (신규)
- **구현**:
  - `suggestTags(query: string)` 함수
  - `getPopularTags()` 함수
- **테스트**: 모킹된 API 호출 테스트

---

### Phase 4-2: 커스텀 훅 구현

#### TASK-004: useImageUpload 훅
- **파일**: `src/hooks/useImageUpload.ts` (신규)
- **기능**:
  - 파일 유효성 검사 (크기, 형식, 개수)
  - 업로드 진행률 추적
  - 에러 상태 관리
- **테스트**: `src/hooks/__tests__/useImageUpload.test.ts`

#### TASK-005: useTagSuggestion 훅
- **파일**: `src/hooks/useTagSuggestion.ts` (신규)
- **기능**:
  - 디바운스 적용 (300ms)
  - React Query로 캐싱
  - 인기 태그 조회
- **테스트**: `src/hooks/__tests__/useTagSuggestion.test.ts`

---

### Phase 4-3: 컴포넌트 구현

#### TASK-006: PreviewModal 컴포넌트
- **파일**: `src/components/molecules/PreviewModal.tsx` (신규)
- **기능**:
  - 마크다운 렌더링 (react-markdown + remark-gfm)
  - XSS 방지 (DOMPurify)
  - 모달 UI (ESC, 배경 클릭 닫기)
  - 반응형 (모바일 전체화면)
- **테스트**: `src/components/molecules/__tests__/PreviewModal.test.tsx`
- **의존성**: `npm install react-markdown remark-gfm dompurify @types/dompurify`

#### TASK-007: ReferenceUrlInput 컴포넌트
- **파일**: `src/components/molecules/ReferenceUrlInput.tsx` (신규)
- **기능**:
  - URL 유효성 검사
  - 성공/에러 상태 표시
- **테스트**: `src/components/molecules/__tests__/ReferenceUrlInput.test.tsx`

#### TASK-008: TagAutocomplete 컴포넌트
- **파일**: `src/components/molecules/TagAutocomplete.tsx` (신규)
- **기능**:
  - 자동완성 드롭다운
  - 키보드 네비게이션
  - 인기 태그 표시
  - 선택된 태그 Badge
- **테스트**: `src/components/molecules/__tests__/TagAutocomplete.test.tsx`

#### TASK-009: ImageUploadButton 컴포넌트
- **파일**: `src/components/molecules/ImageUploadButton.tsx` (신규)
- **기능**:
  - 파일 선택 트리거
  - 업로드 진행률 표시
  - 에러 표시
- **테스트**: `src/components/molecules/__tests__/ImageUploadButton.test.tsx`

---

### Phase 4-4: 페이지 통합

#### TASK-010: WritePage 리팩토링
- **파일**: `src/app/write/page.tsx`
- **변경 내용**:
  - PreviewModal 연동
  - ImageUploadButton 연동
  - ReferenceUrlInput 추가
  - TagAutocomplete로 태그 입력 교체
  - createPost에 images, referenceUrl 전달
- **테스트**: `src/app/write/__tests__/page.test.tsx` 업데이트

#### TASK-011: 드래그앤드롭 지원
- **파일**: `src/app/write/page.tsx`
- **기능**:
  - 본문 영역 드래그앤드롭
  - 드롭 영역 하이라이트
- **테스트**: E2E 테스트

---

### Phase 4-5: API 연동

#### TASK-012: posts API 수정
- **파일**: `src/lib/api/posts.ts`
- **변경 내용**:
  - `createPost` 함수 시그니처 변경 (images, referenceUrl 추가)
- **테스트**: 기존 테스트 업데이트

---

## 의존성 설치

```bash
npm install react-markdown remark-gfm dompurify
npm install -D @types/dompurify
```

---

## 태스크 순서

```
TASK-001 (타입)
    ↓
TASK-002, TASK-003 (API 클라이언트) - 병렬
    ↓
TASK-004, TASK-005 (훅) - 병렬
    ↓
TASK-006, TASK-007, TASK-008, TASK-009 (컴포넌트) - 병렬
    ↓
TASK-010 (페이지 통합)
    ↓
TASK-011 (드래그앤드롭)
    ↓
TASK-012 (API 연동)
```

---

## 체크리스트

- [x] TASK-001: 타입 정의 확장 ✅
- [x] TASK-002: 이미지 업로드 API ✅
- [x] TASK-003: 태그 API ✅
- [x] TASK-004: useImageUpload 훅 ✅
- [x] TASK-005: useTagSuggestion 훅 ✅
- [x] TASK-006: PreviewModal ✅
- [x] TASK-007: ReferenceUrlInput ✅
- [x] TASK-008: TagAutocomplete ✅
- [x] TASK-009: ImageUploadButton ✅
- [x] TASK-010: WritePage 통합 ✅
- [x] TASK-011: 드래그앤드롭 ✅
- [x] TASK-012: API 연동 ✅

---

*태스크 목록 작성일: 2026-01-15*
*태스크 완료일: 2026-01-15*
