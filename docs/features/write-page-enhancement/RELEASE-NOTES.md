# 새 글 작성 페이지 개선 - 릴리즈 노트

## 버전 정보

- **기능명**: 새 글 작성 페이지 개선
- **버전**: 1.0.0
- **릴리즈 예정일**: 2026-01-15
- **개발 완료일**: 2026-01-15

---

## 새로운 기능

### 1. 미리보기 완성

게시글 작성 전 최종 결과물을 미리 확인할 수 있는 모달 기능

- 마크다운 실시간 렌더링
- 제목, 채널명, 태그 표시
- 첨부된 이미지 미리보기
- 참고 링크 표시
- XSS 공격 방지 (DOMPurify)
- 반응형 디자인 (모바일 전체화면)
- 다크 모드 지원

### 2. 이미지 추가

MinIO 스토리지와 연동된 이미지 업로드 기능

- 파일 선택을 통한 업로드
- 드래그앤드롭 지원
- 업로드 진행률 표시
- 썸네일 미리보기
- 최대 10장, 개당 10MB 제한
- 지원 형식: JPG, PNG, GIF, WebP

### 3. 대표 참고 링크

게시글에 외부 참고 자료 링크 추가 기능

- URL 유효성 검사
- http/https 프로토콜만 허용
- 선택 필드 (빈 값 허용)
- 성공/에러 상태 시각화

### 4. 태그 유사 추천

태그 입력 시 자동완성 및 추천 기능

- 입력 시 유사 태그 추천
- 인기 태그 표시
- 키보드 네비게이션 지원
- 최대 5개 태그 제한
- 중복 태그 방지

---

## 기술적 변경사항

### 새로운 컴포넌트

| 컴포넌트 | 파일 위치 |
|---------|----------|
| PreviewModal | `src/components/molecules/PreviewModal.tsx` |
| ReferenceUrlInput | `src/components/molecules/ReferenceUrlInput.tsx` |
| TagAutocomplete | `src/components/molecules/TagAutocomplete.tsx` |
| ImageUploadButton | `src/components/molecules/ImageUploadButton.tsx` |

### 새로운 훅

| 훅 | 파일 위치 |
|---|----------|
| useImageUpload | `src/hooks/useImageUpload.ts` |
| useTagSuggestion | `src/hooks/useTagSuggestion.ts` |

### 새로운 API 클라이언트

| API | 파일 위치 |
|-----|----------|
| upload (이미지) | `src/lib/api/upload.ts` |
| tags (태그) | `src/lib/api/tags.ts` |

### 타입 정의 추가

```typescript
// src/types/index.ts
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

### 수정된 파일

| 파일 | 변경 내용 |
|-----|----------|
| `src/app/write/page.tsx` | 새 컴포넌트 통합 |
| `src/lib/api/posts.ts` | CreatePostInput 타입 사용 |
| `src/components/molecules/index.ts` | 새 컴포넌트 export 추가 |

---

## 의존성 추가

```json
{
  "dependencies": {
    "react-markdown": "^9.x",
    "remark-gfm": "^4.x",
    "dompurify": "^3.x"
  },
  "devDependencies": {
    "@types/dompurify": "^3.x"
  }
}
```

---

## 테스트 커버리지

### 단위 테스트
- **총 테스트**: 201개 (전체 통과)
- **신규 테스트**: 92개

### E2E 테스트
- **총 테스트**: 21개 (전체 통과)
- **테스트 파일**: `e2e/write-page.spec.ts`

---

## 배포 체크리스트

### 사전 확인
- [x] 모든 단위 테스트 통과 (201/201)
- [x] 모든 E2E 테스트 통과 (21/21)
- [x] TypeScript 타입 체크 통과
- [x] ESLint 검사 통과
- [x] 빌드 성공

### 백엔드 요구사항
- [ ] POST /api/upload/images 엔드포인트 준비
- [ ] GET /api/tags/suggest 엔드포인트 준비
- [ ] GET /api/tags/popular 엔드포인트 준비
- [ ] MinIO 스토리지 설정
- [ ] POST /api/posts에 images, referenceUrl 필드 추가

### 환경 설정
- [ ] NEXT_PUBLIC_API_URL 환경 변수 설정
- [ ] MinIO 접근 권한 설정

### 배포 후 확인
- [ ] 미리보기 모달 동작 확인
- [ ] 이미지 업로드 동작 확인
- [ ] 참고 링크 저장 확인
- [ ] 태그 자동완성 동작 확인
- [ ] 모바일 반응형 확인
- [ ] 다크 모드 확인

---

## 알려진 이슈

현재 알려진 이슈 없음

---

## 향후 개선 계획

1. 클립보드 이미지 붙여넣기 (Ctrl+V) 지원
2. 이미지 업로드 취소 기능
3. 이미지 순서 변경 (드래그앤드롭)
4. 마크다운 에디터 툴바 추가
5. 임시저장 기능

---

*작성일: 2026-01-15*
