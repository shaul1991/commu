# Modal 스타일 가이드

## 개요

모달(Modal)은 사용자의 주의를 집중시키고 중요한 작업을 수행하기 위한 오버레이 대화 상자입니다. 배경을 어둡게 하여 모달 콘텐츠에 집중하도록 합니다.

## 기본 구조

```tsx
<Modal isOpen={isOpen} onClose={handleClose}>
  <ModalHeader>
    <ModalTitle>모달 제목</ModalTitle>
    <ModalCloseButton />
  </ModalHeader>
  <ModalBody>
    모달 내용
  </ModalBody>
  <ModalFooter>
    <Button variant="ghost" onClick={handleClose}>취소</Button>
    <Button variant="primary" onClick={handleConfirm}>확인</Button>
  </ModalFooter>
</Modal>
```

## 오버레이 (Backdrop)

| 속성 | 라이트 모드 | 다크 모드 |
|------|------------|----------|
| 배경색 | `rgba(0, 0, 0, 0.5)` | `rgba(0, 0, 0, 0.7)` |
| 블러 효과 | `backdrop-blur-sm` (선택) | `backdrop-blur-sm` |
| z-index | 400 (`z-modal-backdrop`) | 400 |

**Tailwind 클래스:**
```css
fixed inset-0 bg-black/50 backdrop-blur-sm z-[400]
dark:bg-black/70
```

## 모달 컨테이너

### 기본 스타일

| 속성 | 값 |
|------|-----|
| 배경색 | `white` / `gray-800` |
| 테두리 반경 | 16px (1rem) |
| 그림자 | `shadow-xl` |
| z-index | 500 (`z-modal`) |
| 최대 높이 | `90vh` |
| 오버플로우 | `hidden` (컨테이너), `auto` (내용) |

**Tailwind 클래스:**
```css
fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
bg-white rounded-2xl shadow-xl z-[500]
max-h-[90vh] overflow-hidden
dark:bg-gray-800
```

### 모바일 스타일 (Bottom Sheet)

모바일에서는 하단에서 올라오는 시트 형태로 표시할 수 있습니다.

**Tailwind 클래스 (모바일):**
```css
/* 모바일: 하단 시트 */
fixed bottom-0 left-0 right-0 top-auto translate-x-0 translate-y-0
rounded-t-2xl rounded-b-none max-h-[85vh]

/* 데스크톱: 중앙 모달 */
sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2
sm:bottom-auto sm:rounded-2xl sm:max-h-[90vh]
```

## 모달 크기 (Sizes)

| 크기 | 너비 | 사용 용도 |
|------|------|----------|
| `sm` | 400px (25rem) | 간단한 확인, 알림 |
| `md` | 500px (31.25rem) | 기본 폼, 내용 |
| `lg` | 640px (40rem) | 복잡한 폼, 상세 내용 |
| `xl` | 800px (50rem) | 대형 콘텐츠, 이미지 |
| `full` | 100% - 2rem | 전체 화면 |

**Tailwind 클래스:**
```css
/* Small */
w-full max-w-[400px]

/* Medium (기본) */
w-full max-w-[500px]

/* Large */
w-full max-w-[640px]

/* Extra Large */
w-full max-w-[800px]

/* Full */
w-[calc(100%-2rem)] max-w-none
```

## 모달 구성 요소

### ModalHeader

```tsx
<ModalHeader>
  <ModalTitle>제목</ModalTitle>
  <ModalCloseButton onClick={onClose} />
</ModalHeader>
```

| 속성 | 값 |
|------|-----|
| 패딩 | 20px 24px (1.25rem 1.5rem) |
| 하단 테두리 | `border-b border-gray-200` |
| 배경 | `bg-gray-50` (선택) |

**Tailwind 클래스:**
```css
flex items-center justify-between px-6 py-5
border-b border-gray-200 dark:border-gray-700
```

### ModalTitle

| 속성 | 값 |
|------|-----|
| 폰트 크기 | 18px (1.125rem) |
| 폰트 두께 | semibold (600) |
| 텍스트 색상 | `gray-900` / `gray-100` |

**Tailwind 클래스:**
```css
text-lg font-semibold text-gray-900 dark:text-gray-100
```

### ModalCloseButton

```tsx
<button
  onClick={onClose}
  className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
  aria-label="닫기"
>
  <XIcon className="w-5 h-5" />
</button>
```

| 속성 | 값 |
|------|-----|
| 크기 | 36px x 36px |
| 패딩 | 8px |
| 아이콘 크기 | 20px |
| 호버 배경 | `gray-100` / `gray-700` |

**Tailwind 클래스:**
```css
p-2 rounded-lg text-gray-400
hover:text-gray-600 hover:bg-gray-100
dark:hover:text-gray-300 dark:hover:bg-gray-700
transition-colors
```

### ModalBody

```tsx
<ModalBody>
  <p>모달 본문 내용입니다.</p>
</ModalBody>
```

| 속성 | 값 |
|------|-----|
| 패딩 | 24px (1.5rem) |
| 오버플로우 | `auto` (스크롤 가능) |
| 최대 높이 | `calc(90vh - 140px)` |

**Tailwind 클래스:**
```css
p-6 overflow-y-auto max-h-[calc(90vh-140px)]
scrollbar-thin
```

### ModalFooter

```tsx
<ModalFooter>
  <Button variant="ghost">취소</Button>
  <Button variant="primary">확인</Button>
</ModalFooter>
```

| 속성 | 값 |
|------|-----|
| 패딩 | 16px 24px (1rem 1.5rem) |
| 상단 테두리 | `border-t border-gray-200` |
| 정렬 | `flex justify-end gap-3` |
| 배경 | `bg-gray-50` (선택) |

**Tailwind 클래스:**
```css
flex items-center justify-end gap-3 px-6 py-4
border-t border-gray-200 dark:border-gray-700
```

## 애니메이션

### 오버레이 애니메이션

```css
/* 열기 */
animate-fade-in duration-normal

/* 닫기 */
animate-fade-out duration-fast
```

### 모달 애니메이션

```css
/* 열기 */
animate-scale-in duration-normal

/* 또는 슬라이드 */
animate-slide-in-up duration-normal
```

**Framer Motion 예시:**

```tsx
// 오버레이
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.2 }}
/>

// 모달
<motion.div
  initial={{ opacity: 0, scale: 0.95, y: 10 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  exit={{ opacity: 0, scale: 0.95, y: 10 }}
  transition={{ duration: 0.2, ease: 'easeOut' }}
/>
```

## 모달 유형

### Alert Modal (알림)

```tsx
<Modal size="sm">
  <ModalBody className="text-center py-8">
    <AlertIcon className="w-12 h-12 text-warning-500 mx-auto mb-4" />
    <ModalTitle>정말 삭제하시겠습니까?</ModalTitle>
    <p className="text-gray-500 mt-2">이 작업은 되돌릴 수 없습니다.</p>
  </ModalBody>
  <ModalFooter className="justify-center">
    <Button variant="ghost">취소</Button>
    <Button variant="danger">삭제</Button>
  </ModalFooter>
</Modal>
```

### Form Modal (폼)

```tsx
<Modal size="md">
  <ModalHeader>
    <ModalTitle>새 게시글 작성</ModalTitle>
    <ModalCloseButton />
  </ModalHeader>
  <ModalBody>
    <form>
      <Input label="제목" />
      <Textarea label="내용" rows={5} />
    </form>
  </ModalBody>
  <ModalFooter>
    <Button variant="ghost">취소</Button>
    <Button variant="primary">게시</Button>
  </ModalFooter>
</Modal>
```

### Image Modal (이미지)

```tsx
<Modal size="xl" className="bg-black">
  <ModalCloseButton className="absolute top-4 right-4 text-white" />
  <img
    src="/image.jpg"
    alt="이미지"
    className="w-full h-auto max-h-[85vh] object-contain"
  />
</Modal>
```

## 접근성 (Accessibility)

1. **포커스 트랩**: 모달이 열릴 때 포커스가 모달 내부에 갇히도록 설정
2. **ESC 키**: ESC 키로 모달 닫기
3. **배경 클릭**: 오버레이 클릭으로 모달 닫기 (옵션)
4. **ARIA 속성**: 적절한 role과 aria 속성 사용
5. **스크린 리더**: 모달 제목을 aria-labelledby로 연결

```tsx
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <h2 id="modal-title">모달 제목</h2>
  <p id="modal-description">모달 설명</p>
</div>
```

### 포커스 관리

```tsx
// 모달 열릴 때
useEffect(() => {
  if (isOpen) {
    // 이전 포커스 저장
    previousFocusRef.current = document.activeElement;
    // 모달 첫 번째 포커스 가능 요소로 이동
    modalRef.current?.querySelector('button, input, [tabindex="0"]')?.focus();
  }
  return () => {
    // 모달 닫힐 때 이전 포커스로 복귀
    previousFocusRef.current?.focus();
  };
}, [isOpen]);
```

### 스크롤 잠금

```tsx
useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = 'hidden';
  }
  return () => {
    document.body.style.overflow = '';
  };
}, [isOpen]);
```

## 사용 예시

```tsx
// 기본 모달
const [isOpen, setIsOpen] = useState(false);

<Button onClick={() => setIsOpen(true)}>모달 열기</Button>

<Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
  <ModalHeader>
    <ModalTitle>모달 제목</ModalTitle>
    <ModalCloseButton onClick={() => setIsOpen(false)} />
  </ModalHeader>
  <ModalBody>
    <p>모달 내용입니다.</p>
  </ModalBody>
  <ModalFooter>
    <Button variant="ghost" onClick={() => setIsOpen(false)}>취소</Button>
    <Button variant="primary">확인</Button>
  </ModalFooter>
</Modal>

// 확인 대화 상자
<Modal isOpen={isOpen} onClose={onClose} size="sm">
  <ModalBody className="text-center py-8">
    <TrashIcon className="w-12 h-12 text-error-500 mx-auto mb-4" />
    <h3 className="text-lg font-semibold">게시글 삭제</h3>
    <p className="text-gray-500 mt-2">정말 이 게시글을 삭제하시겠습니까?</p>
  </ModalBody>
  <ModalFooter className="justify-center">
    <Button variant="ghost" onClick={onClose}>취소</Button>
    <Button variant="danger" onClick={handleDelete}>삭제</Button>
  </ModalFooter>
</Modal>
```

## 컴포넌트 구현 참조

모달 컴포넌트는 `src/components/molecules/Modal/` 또는 `src/components/organisms/Modal/`에 구현됩니다.
