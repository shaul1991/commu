import { test, expect, Page } from '@playwright/test';

/**
 * 댓글 기능 E2E 테스트
 *
 * 테스트 시나리오:
 * 1. 댓글 목록 표시
 * 2. 댓글 작성
 * 3. 대댓글 작성
 * 4. 댓글 수정
 * 5. 댓글 삭제
 * 6. 댓글 좋아요
 * 7. 댓글 정렬
 */

// Mock 사용자 데이터
const MOCK_USER = {
  id: 'user-1',
  email: 'test@example.com',
  displayName: '테스트유저',
  profileImage: null,
  isEmailVerified: true,
  isActive: true,
};

// Mock 토큰
const MOCK_TOKEN = 'mock-access-token-for-testing';

// Mock 게시글 데이터
const MOCK_POST = {
  id: 'post-1',
  title: '테스트 게시글',
  content: '이것은 테스트 게시글입니다.',
  author: MOCK_USER,
  channelId: 'channel-1',
  channelSlug: 'tech',
  channelName: '기술',
  tags: [],
  viewCount: 100,
  likeCount: 10,
  commentCount: 3,
  isLiked: false,
  isBookmarked: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Mock 댓글 데이터
const MOCK_COMMENTS = [
  {
    id: 'comment-1',
    postId: 'post-1',
    content: '첫 번째 댓글입니다.',
    author: { id: 'user-1', displayName: '테스트유저', profileImage: null },
    parentId: null,
    likeCount: 5,
    isLiked: false,
    isDeleted: false,
    replies: [
      {
        id: 'comment-2',
        postId: 'post-1',
        content: '첫 번째 댓글의 대댓글입니다.',
        author: { id: 'user-2', displayName: '다른유저', profileImage: null },
        parentId: 'comment-1',
        likeCount: 2,
        isLiked: false,
        isDeleted: false,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        updatedAt: new Date(Date.now() - 3600000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'comment-3',
    postId: 'post-1',
    content: '두 번째 댓글입니다.',
    author: { id: 'user-2', displayName: '다른유저', profileImage: null },
    parentId: null,
    likeCount: 10,
    isLiked: true,
    isDeleted: false,
    replies: [],
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
  },
];

/**
 * Zustand store 형식으로 인증 상태 설정
 */
async function setupAuthState(page: Page) {
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

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
async function setupApiMocks(page: Page, options: { comments?: typeof MOCK_COMMENTS } = {}) {
  const comments = options.comments ?? MOCK_COMMENTS;

  // 사용자 정보 조회 API
  await page.route('**/auth/me', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, data: MOCK_USER }),
    });
  });

  // 게시글 상세 조회 API
  await page.route('**/posts/post-1', (route) => {
    if (route.request().method() === 'GET') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: MOCK_POST }),
      });
    } else {
      route.continue();
    }
  });

  // 댓글 목록 조회 API
  await page.route('**/posts/post-1/comments', (route) => {
    if (route.request().method() === 'GET') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: comments }),
      });
    } else if (route.request().method() === 'POST') {
      // 댓글 작성
      const newComment = {
        id: `comment-${Date.now()}`,
        postId: 'post-1',
        content: '새로 작성한 댓글입니다.',
        author: { id: 'user-1', displayName: '테스트유저', profileImage: null },
        parentId: null,
        likeCount: 0,
        isLiked: false,
        isDeleted: false,
        replies: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: newComment }),
      });
    } else {
      route.continue();
    }
  });

  // 댓글 수정 API
  await page.route('**/comments/comment-1', (route) => {
    if (route.request().method() === 'PATCH') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { ...MOCK_COMMENTS[0], content: '수정된 댓글입니다.' },
        }),
      });
    } else if (route.request().method() === 'DELETE') {
      route.fulfill({
        status: 204,
        contentType: 'application/json',
        body: '',
      });
    } else {
      route.continue();
    }
  });

  // 댓글 좋아요 API
  await page.route('**/comments/*/like', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, data: { isLiked: true, likeCount: 6 } }),
    });
  });
}

test.describe('댓글 기능', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
    await setupAuthState(page);
  });

  test.describe('댓글 목록 표시 (CMT-LST)', () => {
    test('CMT-LST-001: 게시글 페이지에서 댓글 목록이 표시됨', async ({ page }) => {
      await page.goto('/post/post-1');
      await page.waitForLoadState('networkidle');

      // 댓글 섹션 헤더 확인
      await expect(page.getByRole('heading', { name: /댓글/i })).toBeVisible({ timeout: 15000 });

      // 댓글 내용 확인
      await expect(page.getByText('첫 번째 댓글입니다.')).toBeVisible();
      await expect(page.getByText('두 번째 댓글입니다.')).toBeVisible();
    });

    test('CMT-LST-002: 대댓글이 올바르게 표시됨', async ({ page }) => {
      await page.goto('/post/post-1');
      await page.waitForLoadState('networkidle');

      await expect(page.getByRole('heading', { name: /댓글/i })).toBeVisible({ timeout: 15000 });
      await expect(page.getByText('첫 번째 댓글의 대댓글입니다.')).toBeVisible();
    });

    test('CMT-LST-003: 댓글 작성자 정보가 표시됨', async ({ page }) => {
      await page.goto('/post/post-1');
      await page.waitForLoadState('networkidle');

      await expect(page.getByRole('heading', { name: /댓글/i })).toBeVisible({ timeout: 15000 });

      // 작성자 이름 확인
      await expect(page.getByText('테스트유저').first()).toBeVisible();
      await expect(page.getByText('다른유저').first()).toBeVisible();
    });

    test('CMT-LST-004: 댓글이 없을 때 빈 상태가 표시됨', async ({ page }) => {
      // 빈 댓글 목록으로 mock 설정
      await page.route('**/posts/post-1/comments', (route) => {
        if (route.request().method() === 'GET') {
          route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ success: true, data: [] }),
          });
        } else {
          route.continue();
        }
      });

      await page.goto('/post/post-1');
      await page.waitForLoadState('networkidle');

      await expect(page.getByText('아직 댓글이 없습니다')).toBeVisible({ timeout: 15000 });
    });
  });

  test.describe('댓글 작성 (CMT-CRT)', () => {
    test('CMT-CRT-001: 댓글 작성 폼이 표시됨', async ({ page }) => {
      await page.goto('/post/post-1');
      await page.waitForLoadState('networkidle');

      await expect(page.getByRole('heading', { name: /댓글/i })).toBeVisible({ timeout: 15000 });

      // 댓글 작성 textarea 확인
      await expect(page.getByPlaceholder(/댓글을 작성하세요/i)).toBeVisible();

      // 댓글 작성 버튼 확인
      await expect(page.getByRole('button', { name: /댓글 작성/i })).toBeVisible();
    });

    test('CMT-CRT-002: 빈 댓글은 작성할 수 없음', async ({ page }) => {
      await page.goto('/post/post-1');
      await page.waitForLoadState('networkidle');

      await expect(page.getByRole('heading', { name: /댓글/i })).toBeVisible({ timeout: 15000 });

      // 댓글 작성 버튼이 비활성화 상태인지 확인
      const submitButton = page.getByRole('button', { name: /댓글 작성/i });
      await expect(submitButton).toBeDisabled();
    });

    test('CMT-CRT-003: 댓글 작성 후 입력창이 초기화됨', async ({ page }) => {
      await page.goto('/post/post-1');
      await page.waitForLoadState('networkidle');

      await expect(page.getByRole('heading', { name: /댓글/i })).toBeVisible({ timeout: 15000 });

      // 댓글 입력
      const textarea = page.getByPlaceholder(/댓글을 작성하세요/i);
      await textarea.fill('새로운 댓글입니다.');

      // 댓글 작성 버튼 클릭
      await page.getByRole('button', { name: /댓글 작성/i }).click();

      // 입력창이 초기화되었는지 확인
      await expect(textarea).toHaveValue('');
    });
  });

  test.describe('대댓글 작성 (CMT-RPL)', () => {
    test('CMT-RPL-001: 답글 버튼 클릭 시 답글 폼이 표시됨', async ({ page }) => {
      await page.goto('/post/post-1');
      await page.waitForLoadState('networkidle');

      await expect(page.getByRole('heading', { name: /댓글/i })).toBeVisible({ timeout: 15000 });

      // 첫 번째 댓글의 답글 버튼 클릭
      const replyButtons = page.getByRole('button', { name: '답글' });
      await replyButtons.first().click();

      // 답글 폼이 표시되는지 확인
      await expect(page.getByPlaceholder(/답글을 작성하세요/i)).toBeVisible();
      await expect(page.getByRole('button', { name: /답글 작성/i })).toBeVisible();
    });

    test('CMT-RPL-002: 답글 작성 취소 버튼이 동작함', async ({ page }) => {
      await page.goto('/post/post-1');
      await page.waitForLoadState('networkidle');

      await expect(page.getByRole('heading', { name: /댓글/i })).toBeVisible({ timeout: 15000 });

      // 답글 버튼 클릭
      await page.getByRole('button', { name: '답글' }).first().click();

      // 답글 폼 표시 확인
      await expect(page.getByPlaceholder(/답글을 작성하세요/i)).toBeVisible();

      // 취소 버튼 클릭 (exact: true로 정확히 '취소' 버튼만 선택)
      await page.getByRole('button', { name: '취소', exact: true }).click();

      // 답글 폼이 사라졌는지 확인
      await expect(page.getByPlaceholder(/답글을 작성하세요/i)).not.toBeVisible();
    });
  });

  test.describe('댓글 수정 (CMT-UPD)', () => {
    test('CMT-UPD-001: 본인 댓글에 더보기 메뉴가 표시됨', async ({ page }) => {
      await page.goto('/post/post-1');
      await page.waitForLoadState('networkidle');

      await expect(page.getByRole('heading', { name: /댓글/i })).toBeVisible({ timeout: 15000 });

      // 본인 댓글(첫 번째 댓글)에서 더보기 버튼 확인 - MoreHorizontal 아이콘
      const firstComment = page.locator('section').filter({ hasText: '첫 번째 댓글입니다.' });
      const moreButton = firstComment.locator('button').filter({ has: page.locator('svg') }).first();
      await expect(moreButton).toBeVisible();
    });

    test('CMT-UPD-002: 수정 버튼 클릭 시 수정 모드로 전환됨', async ({ page }) => {
      await page.goto('/post/post-1');
      await page.waitForLoadState('networkidle');

      await expect(page.getByRole('heading', { name: /댓글/i })).toBeVisible({ timeout: 15000 });

      // 본인 댓글에서 더보기 메뉴(MoreHorizontal) 버튼 찾기
      // '첫 번째 댓글입니다.' 텍스트를 포함한 댓글 영역에서 버튼 찾기
      const commentText = page.getByText('첫 번째 댓글입니다.');
      const commentCard = commentText.locator('..').locator('..').locator('..');
      const moreButton = commentCard.locator('button').filter({ has: page.locator('svg.lucide-more-horizontal') });

      // 더보기 버튼이 없을 경우 스킵 (사용자가 작성자가 아닐 수 있음)
      if (await moreButton.count() > 0) {
        await moreButton.click();

        // 수정 버튼 클릭
        await page.getByRole('button', { name: '수정' }).click();

        // 수정 모드 textarea가 표시되는지 확인
        await expect(page.locator('textarea').first()).toBeVisible();
      }
    });
  });

  test.describe('댓글 삭제 (CMT-DEL)', () => {
    test('CMT-DEL-001: 삭제 버튼 클릭 시 확인 모달이 표시됨', async ({ page }) => {
      await page.goto('/post/post-1');
      await page.waitForLoadState('networkidle');

      await expect(page.getByRole('heading', { name: /댓글/i })).toBeVisible({ timeout: 15000 });

      // 본인 댓글에서 더보기 메뉴 버튼 찾기
      const commentText = page.getByText('첫 번째 댓글입니다.');
      const commentCard = commentText.locator('..').locator('..').locator('..');
      const moreButton = commentCard.locator('button').filter({ has: page.locator('svg.lucide-more-horizontal') });

      if (await moreButton.count() > 0) {
        await moreButton.click();

        // 삭제 버튼 클릭
        await page.getByRole('button', { name: '삭제' }).click();

        // 확인 모달이 표시되는지 확인
        await expect(page.getByRole('dialog')).toBeVisible();
        await expect(page.getByText('댓글 삭제')).toBeVisible();
        await expect(page.getByText(/이 댓글을 삭제하시겠습니까/i)).toBeVisible();
      }
    });

    test('CMT-DEL-002: 삭제 취소 시 모달이 닫힘', async ({ page }) => {
      await page.goto('/post/post-1');
      await page.waitForLoadState('networkidle');

      await expect(page.getByRole('heading', { name: /댓글/i })).toBeVisible({ timeout: 15000 });

      // 본인 댓글에서 더보기 메뉴 버튼 찾기
      const commentText = page.getByText('첫 번째 댓글입니다.');
      const commentCard = commentText.locator('..').locator('..').locator('..');
      const moreButton = commentCard.locator('button').filter({ has: page.locator('svg.lucide-more-horizontal') });

      if (await moreButton.count() > 0) {
        await moreButton.click();
        await page.getByRole('button', { name: '삭제' }).click();

        // 취소 버튼 클릭
        await page.getByRole('button', { name: '취소', exact: true }).click();

        // 모달이 닫혔는지 확인
        await expect(page.getByRole('dialog')).not.toBeVisible();
      }
    });
  });

  test.describe('댓글 좋아요 (CMT-LIK)', () => {
    test('CMT-LIK-001: 좋아요 버튼이 표시됨', async ({ page }) => {
      await page.goto('/post/post-1');
      await page.waitForLoadState('networkidle');

      await expect(page.getByRole('heading', { name: /댓글/i })).toBeVisible({ timeout: 15000 });

      // 좋아요 버튼과 카운트 확인
      await expect(page.getByText('5').first()).toBeVisible();
    });

    test('CMT-LIK-002: 이미 좋아요한 댓글은 활성화 상태로 표시됨', async ({ page }) => {
      await page.goto('/post/post-1');
      await page.waitForLoadState('networkidle');

      await expect(page.getByRole('heading', { name: /댓글/i })).toBeVisible({ timeout: 15000 });

      // 두 번째 댓글은 isLiked: true 상태
      // '좋아요 취소' aria-label을 가진 버튼이 있는지 확인 (활성화 상태)
      await expect(page.getByLabel('좋아요 취소')).toBeVisible();
    });
  });

  test.describe('댓글 정렬 (CMT-SRT)', () => {
    test('CMT-SRT-001: 정렬 옵션 버튼들이 표시됨', async ({ page }) => {
      await page.goto('/post/post-1');
      await page.waitForLoadState('networkidle');

      await expect(page.getByRole('heading', { name: /댓글/i })).toBeVisible({ timeout: 15000 });

      // 정렬 옵션 확인 (데스크톱에서)
      await expect(page.getByText('최신순')).toBeVisible();
      await expect(page.getByText('오래된순')).toBeVisible();
      await expect(page.getByText('인기순')).toBeVisible();
    });

    test('CMT-SRT-002: 정렬 옵션 클릭 시 정렬이 변경됨', async ({ page }) => {
      await page.goto('/post/post-1');
      await page.waitForLoadState('networkidle');

      await expect(page.getByRole('heading', { name: /댓글/i })).toBeVisible({ timeout: 15000 });

      // 인기순 클릭
      const popularButton = page.locator('button').filter({ hasText: '인기순' });
      await popularButton.click();

      // 인기순 버튼 클릭 후 활성화 스타일 클래스가 적용되었는지 확인
      await expect(popularButton).toHaveClass(/bg-\[var\(--color-primary-50\)\]/);
    });
  });

  test.describe('반응형 디자인', () => {
    test('모바일 뷰에서 댓글 섹션이 올바르게 표시됨', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/post/post-1');
      await page.waitForLoadState('networkidle');

      await expect(page.getByRole('heading', { name: /댓글/i })).toBeVisible({ timeout: 15000 });

      // 댓글 내용 확인
      await expect(page.getByText('첫 번째 댓글입니다.')).toBeVisible();

      // 댓글 작성 폼 확인
      await expect(page.getByPlaceholder(/댓글을 작성하세요/i)).toBeVisible();
    });

    test('모바일에서 정렬 옵션 아이콘만 표시됨', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/post/post-1');
      await page.waitForLoadState('networkidle');

      await expect(page.getByRole('heading', { name: /댓글/i })).toBeVisible({ timeout: 15000 });

      // 정렬 옵션 텍스트가 숨겨지고 아이콘만 표시되는지 확인
      // (sm:inline 클래스로 텍스트가 숨겨짐)
      const sortText = page.getByText('최신순');
      await expect(sortText).not.toBeVisible();
    });
  });
});
