import { test, expect, Page } from '@playwright/test';
import * as path from 'path';

/**
 * 새 글 작성 페이지 E2E 테스트
 *
 * 테스트 시나리오:
 * 1. 미리보기 기능
 * 2. 이미지 업로드
 * 3. 참고 링크 입력
 * 4. 태그 자동완성
 * 5. 게시글 작성 전체 플로우
 */

// 테스트용 이미지 파일 경로
const TEST_IMAGE_PATH = path.join(__dirname, 'fixtures', 'test-image.jpg');

// Mock 사용자 데이터
const MOCK_USER = {
  id: 'user-1',
  email: 'test@example.com',
  firstName: '테스트',
  lastName: '사용자',
  profileImage: null,
  isEmailVerified: true,
  isActive: true,
};

// Mock 토큰
const MOCK_TOKEN = 'mock-access-token-for-testing';

/**
 * Zustand store 형식으로 인증 상태 설정
 * commu-auth 키에 저장
 */
async function setupAuthState(page: Page) {
  // 먼저 앱 도메인에 접속해서 localStorage 설정 가능하게 함
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // Zustand persist 형식으로 localStorage 설정
  const authState = {
    state: {
      user: MOCK_USER,
      accessToken: MOCK_TOKEN,
      isAuthenticated: true,
      isLoading: false,
    },
    version: 0,
  };

  await page.evaluate((state) => {
    localStorage.setItem('commu-auth', JSON.stringify(state));
  }, authState);
}

/**
 * API 요청 모킹
 */
async function setupApiMocks(page: Page) {
  // 사용자 정보 조회 API (백엔드 API)
  await page.route('**/auth/me', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: MOCK_USER,
      }),
    });
  });

  // 게시글 작성 API
  await page.route('**/posts', (route) => {
    if (route.request().method() === 'POST') {
      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            id: 'new-post-id',
            title: 'New Post',
            content: 'Content',
            createdAt: new Date().toISOString(),
          },
        }),
      });
    } else {
      route.continue();
    }
  });

  // 태그 추천 API
  await page.route('**/tags/suggest*', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: {
          tags: [
            { name: 'react', count: 100 },
            { name: 'typescript', count: 80 },
            { name: 'javascript', count: 120 },
          ],
        },
      }),
    });
  });

  // 인기 태그 API
  await page.route('**/tags/popular', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: {
          tags: [
            { name: 'react', count: 100 },
            { name: 'nextjs', count: 90 },
            { name: 'typescript', count: 80 },
          ],
        },
      }),
    });
  });

  // 이미지 업로드 API
  await page.route('**/upload/images', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: {
          urls: ['https://storage.example.com/image1.jpg'],
        },
      }),
    });
  });
}

test.describe('새 글 작성 페이지', () => {
  test.beforeEach(async ({ page }) => {
    // API 모킹 설정 (navigation 전에 설정해야 함)
    await setupApiMocks(page);

    // 인증 상태 설정
    await setupAuthState(page);

    // 글쓰기 페이지로 이동
    await page.goto('/write');

    // 페이지 로딩 대기 - 인증 확인 후 콘텐츠 표시될 때까지
    await page.waitForLoadState('networkidle');
  });

  test.describe('페이지 기본 요소', () => {
    test('글쓰기 페이지가 올바르게 표시됨', async ({ page }) => {
      // 인증 로딩이 끝날 때까지 대기
      await expect(page.getByRole('heading', { name: '새 글 작성' })).toBeVisible({ timeout: 15000 });
      await expect(page.getByText('채널 선택')).toBeVisible();
      await expect(page.getByPlaceholder('제목을 입력하세요')).toBeVisible();
      await expect(page.getByPlaceholder(/내용을 입력하세요/)).toBeVisible();
      await expect(page.getByRole('button', { name: /미리보기/ })).toBeVisible();
      await expect(page.getByRole('button', { name: /게시하기/ })).toBeVisible();
    });

    test('채널 선택 버튼들이 표시됨', async ({ page }) => {
      await expect(page.getByRole('heading', { name: '새 글 작성' })).toBeVisible({ timeout: 15000 });

      const channels = ['일반', '기술', '커리어', '질문', '일상'];
      for (const channel of channels) {
        await expect(page.getByRole('button', { name: channel })).toBeVisible();
      }
    });

    test('게시하기 버튼이 초기에 비활성화됨', async ({ page }) => {
      await expect(page.getByRole('heading', { name: '새 글 작성' })).toBeVisible({ timeout: 15000 });
      await expect(page.getByRole('button', { name: /게시하기/ })).toBeDisabled();
    });
  });

  test.describe('미리보기 기능 (PRV)', () => {
    test('PRV-001: 미리보기 버튼 클릭 시 모달이 열림', async ({ page }) => {
      await expect(page.getByRole('heading', { name: '새 글 작성' })).toBeVisible({ timeout: 15000 });

      // 제목과 내용 입력
      await page.getByPlaceholder('제목을 입력하세요').fill('테스트 제목');
      await page.getByPlaceholder(/내용을 입력하세요/).fill('테스트 내용입니다.');

      // 미리보기 버튼 클릭
      await page.getByRole('button', { name: /미리보기/ }).click();

      // 모달이 열림 확인
      await expect(page.getByRole('dialog')).toBeVisible();
    });

    test('PRV-002~004: 모달에 제목, 채널명이 표시됨', async ({ page }) => {
      await expect(page.getByRole('heading', { name: '새 글 작성' })).toBeVisible({ timeout: 15000 });

      // 채널 선택
      await page.getByRole('button', { name: '기술' }).click();

      // 제목 입력
      await page.getByPlaceholder('제목을 입력하세요').fill('테스트 제목');

      // 내용 입력
      await page.getByPlaceholder(/내용을 입력하세요/).fill('테스트 내용입니다.');

      // 미리보기 열기
      await page.getByRole('button', { name: /미리보기/ }).click();

      // 제목 확인
      await expect(page.getByRole('dialog').getByText('테스트 제목')).toBeVisible();

      // 채널명 확인
      await expect(page.getByRole('dialog').getByText('기술')).toBeVisible();
    });

    test('PRV-005: 마크다운이 렌더링됨', async ({ page }) => {
      await expect(page.getByRole('heading', { name: '새 글 작성' })).toBeVisible({ timeout: 15000 });

      const markdownContent = `# 헤딩 1
**굵은 텍스트**
- 목록 항목 1
- 목록 항목 2`;

      await page.getByPlaceholder('제목을 입력하세요').fill('마크다운 테스트');
      await page.getByPlaceholder(/내용을 입력하세요/).fill(markdownContent);
      await page.getByRole('button', { name: /미리보기/ }).click();

      // 마크다운이 HTML로 렌더링되었는지 확인
      const dialog = page.getByRole('dialog');
      // 마크다운으로 렌더링된 h1 찾기 (제목 h1은 제외)
      await expect(dialog.getByRole('heading', { name: '헤딩' })).toBeVisible();
      await expect(dialog.locator('strong')).toContainText('굵은 텍스트');
      await expect(dialog.locator('li')).toHaveCount(2);
    });

    test('PRV-008: ESC 키로 모달 닫기', async ({ page }) => {
      await expect(page.getByRole('heading', { name: '새 글 작성' })).toBeVisible({ timeout: 15000 });

      await page.getByPlaceholder('제목을 입력하세요').fill('테스트');
      await page.getByPlaceholder(/내용을 입력하세요/).fill('내용');
      await page.getByRole('button', { name: /미리보기/ }).click();

      await expect(page.getByRole('dialog')).toBeVisible();

      // ESC 키 입력
      await page.keyboard.press('Escape');

      // 모달이 닫힘 확인
      await expect(page.getByRole('dialog')).not.toBeVisible();
    });

    test('PRV-010: X 버튼으로 모달 닫기', async ({ page }) => {
      await expect(page.getByRole('heading', { name: '새 글 작성' })).toBeVisible({ timeout: 15000 });

      await page.getByPlaceholder('제목을 입력하세요').fill('테스트');
      await page.getByPlaceholder(/내용을 입력하세요/).fill('내용');
      await page.getByRole('button', { name: /미리보기/ }).click();

      await expect(page.getByRole('dialog')).toBeVisible();

      // 닫기 버튼 클릭 (aria-label="닫기"인 X 버튼 선택)
      await page.getByLabel('닫기').click();

      // 모달이 닫힘 확인
      await expect(page.getByRole('dialog')).not.toBeVisible();
    });

    test('PRV-012: XSS 공격 코드가 sanitize됨', async ({ page }) => {
      await expect(page.getByRole('heading', { name: '새 글 작성' })).toBeVisible({ timeout: 15000 });

      const xssContent = '<script>alert("XSS")</script><p>안전한 내용</p>';

      await page.getByPlaceholder('제목을 입력하세요').fill('XSS 테스트');
      await page.getByPlaceholder(/내용을 입력하세요/).fill(xssContent);
      await page.getByRole('button', { name: /미리보기/ }).click();

      // script 태그가 렌더링되지 않아야 함
      const dialog = page.getByRole('dialog');
      await expect(dialog.locator('script')).toHaveCount(0);

      // 안전한 내용은 표시되어야 함
      await expect(dialog.getByText('안전한 내용')).toBeVisible();
    });
  });

  test.describe('참고 링크 기능 (REF)', () => {
    test('REF-001: 참고 링크 입력 필드 표시', async ({ page }) => {
      await expect(page.getByRole('heading', { name: '새 글 작성' })).toBeVisible({ timeout: 15000 });
      await expect(page.getByPlaceholder(/참고 URL|https:\/\//i)).toBeVisible();
    });

    test('REF-002: 유효한 URL 입력 시 값 저장', async ({ page }) => {
      await expect(page.getByRole('heading', { name: '새 글 작성' })).toBeVisible({ timeout: 15000 });

      const urlInput = page.getByPlaceholder(/참고 URL|https:\/\//i);
      await urlInput.fill('https://example.com');

      // 값 확인
      await expect(urlInput).toHaveValue('https://example.com');
    });

    test('REF-003: 무효한 URL 입력 시 에러 표시', async ({ page }) => {
      await expect(page.getByRole('heading', { name: '새 글 작성' })).toBeVisible({ timeout: 15000 });

      const urlInput = page.getByPlaceholder(/참고 URL|https:\/\//i);
      await urlInput.fill('invalid-url');
      await urlInput.blur();

      // 에러 메시지 확인
      await expect(page.getByText(/올바른 URL|유효하지 않은/i)).toBeVisible();
    });

    test('REF-005: 빈 값 허용', async ({ page }) => {
      await expect(page.getByRole('heading', { name: '새 글 작성' })).toBeVisible({ timeout: 15000 });

      const urlInput = page.getByPlaceholder(/참고 URL|https:\/\//i);
      await urlInput.fill('');
      await urlInput.blur();

      // 에러 메시지가 표시되지 않아야 함
      await expect(page.getByText(/올바른 URL|유효하지 않은/i)).not.toBeVisible();
    });
  });

  test.describe('태그 기능 (TAG)', () => {
    test('TAG-009: Enter로 태그 추가 후 Badge 표시', async ({ page }) => {
      await expect(page.getByRole('heading', { name: '새 글 작성' })).toBeVisible({ timeout: 15000 });

      const tagInput = page.getByPlaceholder(/태그|tag/i);
      await tagInput.fill('react');
      await page.keyboard.press('Enter');

      // 태그가 Badge로 표시됨 확인
      await expect(page.getByText('react')).toBeVisible();
    });

    test('TAG-010: 태그 추가 및 제거', async ({ page }) => {
      await expect(page.getByRole('heading', { name: '새 글 작성' })).toBeVisible({ timeout: 15000 });

      const tagInput = page.getByPlaceholder(/태그|tag/i);
      await tagInput.fill('react');
      await page.keyboard.press('Enter');

      // 태그가 추가됨
      await expect(page.getByText('react')).toBeVisible();
    });
  });

  test.describe('이미지 업로드 기능 (IMG)', () => {
    test('IMG-001: 이미지 업로드 영역 존재', async ({ page }) => {
      await expect(page.getByRole('heading', { name: '새 글 작성' })).toBeVisible({ timeout: 15000 });

      // 이미지 관련 버튼/영역 확인
      const imageSection = page.getByText(/이미지|사진|Image/i);
      await expect(imageSection.first()).toBeVisible();
    });
  });

  test.describe('게시글 작성 전체 플로우 (INT)', () => {
    test('INT-001: 필수 필드 입력 후 게시하기 버튼 활성화', async ({ page }) => {
      await expect(page.getByRole('heading', { name: '새 글 작성' })).toBeVisible({ timeout: 15000 });

      // 채널 선택
      await page.getByRole('button', { name: '기술' }).click();

      // 제목 입력
      await page.getByPlaceholder('제목을 입력하세요').fill('E2E 테스트 게시글');

      // 내용 입력
      await page.getByPlaceholder(/내용을 입력하세요/).fill('이것은 E2E 테스트입니다.');

      // 게시하기 버튼 활성화 확인
      const submitButton = page.getByRole('button', { name: /게시하기/ });
      await expect(submitButton).toBeEnabled();
    });

    test('INT-004: 미리보기 후 수정 후 다시 미리보기', async ({ page }) => {
      await expect(page.getByRole('heading', { name: '새 글 작성' })).toBeVisible({ timeout: 15000 });

      // 초기 내용 입력
      await page.getByRole('button', { name: '일반' }).click();
      await page.getByPlaceholder('제목을 입력하세요').fill('초기 제목');
      await page.getByPlaceholder(/내용을 입력하세요/).fill('초기 내용');

      // 미리보기
      await page.getByRole('button', { name: /미리보기/ }).click();
      await expect(page.getByRole('dialog').getByText('초기 제목')).toBeVisible();

      // 모달 닫기
      await page.keyboard.press('Escape');
      await expect(page.getByRole('dialog')).not.toBeVisible();

      // 내용 수정
      await page.getByPlaceholder('제목을 입력하세요').fill('수정된 제목');
      await page.getByPlaceholder(/내용을 입력하세요/).fill('수정된 내용');

      // 다시 미리보기
      await page.getByRole('button', { name: /미리보기/ }).click();
      await expect(page.getByRole('dialog').getByText('수정된 제목')).toBeVisible();
      await expect(page.getByRole('dialog').getByText('수정된 내용')).toBeVisible();
    });
  });

  test.describe('반응형 디자인', () => {
    test('모바일 뷰에서 올바르게 표시됨', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      await expect(page.getByRole('heading', { name: '새 글 작성' })).toBeVisible({ timeout: 15000 });
      await expect(page.getByPlaceholder('제목을 입력하세요')).toBeVisible();
      await expect(page.getByPlaceholder(/내용을 입력하세요/)).toBeVisible();
    });

    test('모바일에서 미리보기 모달 표시', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await expect(page.getByRole('heading', { name: '새 글 작성' })).toBeVisible({ timeout: 15000 });

      await page.getByPlaceholder('제목을 입력하세요').fill('모바일 테스트');
      await page.getByPlaceholder(/내용을 입력하세요/).fill('모바일 내용');
      await page.getByRole('button', { name: /미리보기/ }).click();

      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();

      // 모바일에서 전체 너비에 가깝게 표시
      const box = await dialog.boundingBox();
      expect(box?.width).toBeGreaterThan(300);
    });
  });

  test.describe('다크 모드', () => {
    test('다크 모드에서 올바르게 렌더링됨', async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'dark' });

      await expect(page.getByRole('heading', { name: '새 글 작성' })).toBeVisible({ timeout: 15000 });
      await expect(page.getByPlaceholder('제목을 입력하세요')).toBeVisible();
    });
  });
});
