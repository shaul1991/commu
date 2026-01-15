# 새 글 작성 페이지 개선

## 개요

새 글 작성 페이지(`/write`)에 다음 기능들을 추가하여 사용자 경험을 개선했습니다.

| 기능 | 설명 |
|------|------|
| 미리보기 완성 | 마크다운 렌더링, 이미지, 태그 등 전체 미리보기 |
| 이미지 추가 | MinIO 스토리지 연동 이미지 업로드 |
| 대표 참고 링크 | 게시글에 참고 URL 추가 |
| 태그 유사 추천 | 자동완성 및 인기 태그 추천 |

---

## 구현된 컴포넌트

### 1. PreviewModal

마크다운 미리보기 모달 컴포넌트

**파일**: `src/components/molecules/PreviewModal.tsx`

**기능**:
- 마크다운 렌더링 (react-markdown + remark-gfm)
- XSS 방지 (DOMPurify sanitize)
- 제목, 채널명, 태그, 이미지, 참고 링크 표시
- ESC 키, 배경 클릭, X 버튼으로 닫기
- 반응형 (모바일 전체화면)

**사용 예시**:
```tsx
<PreviewModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="게시글 제목"
  content="## 마크다운 내용"
  channelName="기술"
  tags={['react', 'typescript']}
  images={['https://storage.example.com/image.jpg']}
  referenceUrl="https://example.com"
/>
```

### 2. ReferenceUrlInput

참고 URL 입력 컴포넌트

**파일**: `src/components/molecules/ReferenceUrlInput.tsx`

**기능**:
- URL 유효성 검사 (http/https)
- 성공/에러 상태 표시
- 빈 값 허용 (선택 필드)

**사용 예시**:
```tsx
<ReferenceUrlInput
  value={referenceUrl}
  onChange={setReferenceUrl}
/>
```

### 3. TagAutocomplete

태그 자동완성 컴포넌트

**파일**: `src/components/molecules/TagAutocomplete.tsx`

**기능**:
- 입력 시 태그 추천 (디바운스 300ms)
- 인기 태그 표시
- 키보드 네비게이션 (화살표, Enter, ESC)
- 선택된 태그 Badge 표시
- 최대 5개 제한
- 중복 방지

**사용 예시**:
```tsx
<TagAutocomplete
  selectedTags={tags}
  onTagsChange={setTags}
  maxTags={5}
/>
```

### 4. ImageUploadButton

이미지 업로드 버튼 컴포넌트

**파일**: `src/components/molecules/ImageUploadButton.tsx`

**기능**:
- 파일 선택 다이얼로그
- 업로드 진행률 표시
- 썸네일 미리보기
- 이미지 삭제
- 최대 10장 제한

**사용 예시**:
```tsx
<ImageUploadButton
  images={images}
  onImagesChange={setImages}
  maxImages={10}
/>
```

---

## 커스텀 훅

### useImageUpload

이미지 업로드 로직 훅

**파일**: `src/hooks/useImageUpload.ts`

**기능**:
- 파일 유효성 검사 (크기, 형식, 개수)
- 업로드 진행률 추적
- 에러 상태 관리

### useTagSuggestion

태그 추천 로직 훅

**파일**: `src/hooks/useTagSuggestion.ts`

**기능**:
- 디바운스 적용 (300ms)
- React Query 캐싱
- 인기 태그 조회

---

## API 클라이언트

### 이미지 업로드 API

**파일**: `src/lib/api/upload.ts`

```typescript
// 이미지 업로드
uploadImages(files: File[]): Promise<{ urls: string[] }>
```

### 태그 API

**파일**: `src/lib/api/tags.ts`

```typescript
// 태그 추천
suggestTags(query: string): Promise<{ tags: TagSuggestion[] }>

// 인기 태그
getPopularTags(): Promise<{ tags: TagSuggestion[] }>
```

---

## 타입 정의

**파일**: `src/types/index.ts`

```typescript
interface CreatePostInput {
  title: string;
  content: string;
  channelSlug: string;
  tags?: string[];
  images?: string[];
  referenceUrl?: string;
}

interface UploadedImage {
  url: string;
  filename: string;
}

interface TagSuggestion {
  name: string;
  count: number;
}
```

---

## 테스트

### 단위 테스트

| 파일 | 테스트 수 |
|-----|----------|
| PreviewModal.test.tsx | 13 |
| ReferenceUrlInput.test.tsx | 8 |
| TagAutocomplete.test.tsx | 22 |
| ImageUploadButton.test.tsx | 19 |
| useImageUpload.test.ts | 9 |
| useTagSuggestion.test.tsx | 4 |
| page.test.tsx (WritePage) | 17 |

### E2E 테스트

**파일**: `e2e/write-page.spec.ts`

| 카테고리 | 테스트 수 |
|---------|----------|
| 페이지 기본 요소 | 3 |
| 미리보기 기능 | 6 |
| 참고 링크 기능 | 4 |
| 태그 기능 | 2 |
| 이미지 업로드 | 1 |
| 게시글 작성 플로우 | 2 |
| 반응형 디자인 | 2 |
| 다크 모드 | 1 |

---

## 의존성

```bash
npm install react-markdown remark-gfm dompurify
npm install -D @types/dompurify
```

---

## 관련 문서

- [팀 토론 결과](./discussions/README.md)
- [UI 명세서](./requirements/ui-spec.md)
- [구현 태스크](./implementation/tasks.md)
- [QA 테스트 계획](./test-plans/qa-test-plan.md)

---

*작성일: 2026-01-15*
*완료일: 2026-01-15*
