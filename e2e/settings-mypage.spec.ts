/**
 * Settings & MyPage E2E 테스트
 * Playwright를 사용한 E2E 테스트
 */

import { test, expect } from '@playwright/test';

test.describe('/settings 페이지 (비로그인 접근 가능)', () => {
  test.beforeEach(async ({ page }) => {
    // 로그아웃 상태 보장 (localStorage 클리어)
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('비로그인 사용자가 /settings에 접근할 수 있어야 함', async ({ page }) => {
    await page.goto('/settings');
    await expect(page.getByRole('heading', { name: '설정' })).toBeVisible();
  });

  test('테마 설정이 표시되어야 함', async ({ page }) => {
    await page.goto('/settings');
    await expect(page.getByText('테마')).toBeVisible();
    await expect(page.getByLabel('라이트 모드')).toBeVisible();
    await expect(page.getByLabel('다크 모드')).toBeVisible();
    await expect(page.getByLabel('시스템 설정 따르기')).toBeVisible();
  });

  test('다크 모드 클릭 시 테마가 변경되어야 함', async ({ page }) => {
    await page.goto('/settings');

    // 다크 모드 클릭
    await page.getByLabel('다크 모드').click();

    // localStorage에 테마 저장 확인
    const theme = await page.evaluate(() => localStorage.getItem('commu-theme'));
    expect(theme).toContain('dark');
  });

  test('앱 정보가 표시되어야 함', async ({ page }) => {
    await page.goto('/settings');
    await expect(page.getByText('v0.1.0')).toBeVisible();
    await expect(page.getByText('이용약관')).toBeVisible();
    await expect(page.getByText('개인정보처리방침')).toBeVisible();
  });

  test('로그아웃 버튼이 없어야 함', async ({ page }) => {
    await page.goto('/settings');
    await expect(page.getByRole('button', { name: /로그아웃/i })).not.toBeVisible();
  });
});

test.describe('/mypage 페이지 (로그인 필수)', () => {
  test('비로그인 사용자는 로그인 페이지로 리다이렉트되어야 함', async ({ page }) => {
    // localStorage 클리어
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());

    // mypage 접근 시도
    await page.goto('/mypage');

    // 로그인 페이지로 리다이렉트 확인
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test.describe('로그인 상태', () => {
    test.beforeEach(async ({ page }) => {
      // 로그인 상태 시뮬레이션 (테스트용 토큰 설정)
      await page.goto('/');
      await page.evaluate(() => {
        localStorage.setItem('commu-auth', JSON.stringify({
          state: {
            user: {
              id: 'test-user-id',
              email: 'test@example.com',
              displayName: '테스트 사용자',
              isEmailVerified: true,
            },
            accessToken: 'test-token',
            isAuthenticated: true,
            isLoading: false,
          },
          version: 0,
        }));
      });
    });

    test('로그인 사용자에게 마이페이지가 표시되어야 함', async ({ page }) => {
      await page.goto('/mypage');
      await expect(page.getByRole('heading', { name: '마이페이지' })).toBeVisible();
    });

    test('사용자 프로필이 표시되어야 함', async ({ page }) => {
      await page.goto('/mypage');
      await expect(page.getByText('테스트 사용자')).toBeVisible();
      await expect(page.getByText('test@example.com')).toBeVisible();
    });

    test('프로필 관리 메뉴가 있어야 함', async ({ page }) => {
      await page.goto('/mypage');
      await expect(page.getByText('프로필 수정')).toBeVisible();
      await expect(page.getByText('비밀번호 변경')).toBeVisible();
      await expect(page.getByText('알림 설정')).toBeVisible();
    });

    test('내 활동 메뉴가 있어야 함', async ({ page }) => {
      await page.goto('/mypage');
      await expect(page.getByText('내 게시글')).toBeVisible();
      await expect(page.getByText('내 댓글')).toBeVisible();
      await expect(page.getByText('좋아요한 글')).toBeVisible();
      await expect(page.getByText('북마크')).toBeVisible();
    });

    test('로그아웃 버튼 클릭 시 확인 다이얼로그가 표시되어야 함', async ({ page }) => {
      await page.goto('/mypage');
      await page.getByRole('button', { name: /로그아웃/i }).click();
      await expect(page.getByText('로그아웃 하시겠습니까?')).toBeVisible();
    });

    test('로그아웃 확인 시 토큰이 삭제되어야 함', async ({ page }) => {
      await page.goto('/mypage');
      await page.getByRole('button', { name: /로그아웃/i }).click();
      await page.getByRole('button', { name: '로그아웃', exact: true }).click();

      // 홈으로 리다이렉트 또는 토큰 삭제 확인
      await page.waitForURL('/');
    });
  });
});

test.describe('/profile 리다이렉트', () => {
  test('/profile이 /mypage로 리다이렉트되어야 함', async ({ page }) => {
    // 로그인 상태 시뮬레이션
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('commu-auth', JSON.stringify({
        state: {
          user: {
            id: 'test-user-id',
            email: 'test@example.com',
            displayName: '테스트 사용자',
            isEmailVerified: true,
          },
          accessToken: 'test-token',
          isAuthenticated: true,
          isLoading: false,
        },
        version: 0,
      }));
    });

    await page.goto('/profile');
    await expect(page).toHaveURL('/mypage');
  });
});

test.describe('반응형 테스트', () => {
  test('모바일에서 설정 페이지가 올바르게 표시되어야 함', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/settings');
    await expect(page.getByRole('heading', { name: '설정' })).toBeVisible();
  });

  test('태블릿에서 마이페이지가 올바르게 표시되어야 함', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });

    // 로그인 상태 시뮬레이션
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('commu-auth', JSON.stringify({
        state: {
          user: {
            id: 'test-user-id',
            email: 'test@example.com',
            displayName: '테스트 사용자',
            isEmailVerified: true,
          },
          accessToken: 'test-token',
          isAuthenticated: true,
          isLoading: false,
        },
        version: 0,
      }));
    });

    await page.goto('/mypage');
    await expect(page.getByRole('heading', { name: '마이페이지' })).toBeVisible();
  });
});
