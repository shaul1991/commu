import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.describe('Login Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/auth/login');
    });

    test('should display login form', async ({ page }) => {
      await expect(page.getByRole('heading', { name: '로그인' })).toBeVisible();
      await expect(page.getByLabel('이메일')).toBeVisible();
      await expect(page.getByLabel('비밀번호')).toBeVisible();
      await expect(page.getByRole('button', { name: '로그인' })).toBeVisible();
    });

    test('should show validation error for empty fields', async ({ page }) => {
      await page.getByRole('button', { name: '로그인' }).click();
      // HTML5 validation should prevent submission
      await expect(page.getByLabel('이메일')).toBeFocused();
    });

    test('should show error for invalid credentials', async ({ page }) => {
      await page.getByLabel('이메일').fill('invalid@example.com');
      await page.getByLabel('비밀번호').fill('wrongpassword');
      await page.getByRole('button', { name: '로그인' }).click();

      await expect(page.getByText('로그인에 실패했습니다')).toBeVisible({ timeout: 5000 });
    });

    test('should login successfully with valid credentials', async ({ page }) => {
      await page.getByLabel('이메일').fill('test@example.com');
      await page.getByLabel('비밀번호').fill('Password123!');
      await page.getByRole('button', { name: '로그인' }).click();

      // Should redirect to home
      await expect(page).toHaveURL('/', { timeout: 5000 });
    });

    test('should navigate to register page', async ({ page }) => {
      await page.getByRole('link', { name: '회원가입' }).click();
      await expect(page).toHaveURL('/auth/register');
    });

    test('should navigate to forgot password page', async ({ page }) => {
      await page.getByRole('link', { name: '비밀번호를 잊으셨나요?' }).click();
      await expect(page).toHaveURL('/auth/forgot-password');
    });

    test('should have social login buttons', async ({ page }) => {
      await expect(page.getByText('Google로 계속하기')).toBeVisible();
      await expect(page.getByText('카카오로 계속하기')).toBeVisible();
    });
  });

  test.describe('Register Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/auth/register');
    });

    test('should display registration form', async ({ page }) => {
      await expect(page.getByRole('heading', { name: '회원가입' })).toBeVisible();
      await expect(page.getByLabel('성')).toBeVisible();
      await expect(page.getByLabel('이름')).toBeVisible();
      await expect(page.getByLabel('이메일')).toBeVisible();
      await expect(page.getByLabel('비밀번호', { exact: true })).toBeVisible();
      await expect(page.getByLabel('비밀번호 확인')).toBeVisible();
    });

    test('should validate password requirements', async ({ page }) => {
      await page.getByLabel('이메일').fill('newuser@example.com');
      await page.getByLabel('비밀번호', { exact: true }).fill('weak');
      await page.getByLabel('비밀번호 확인').fill('weak');
      await page.getByRole('checkbox').check();
      await page.getByRole('button', { name: '회원가입' }).click();

      await expect(page.getByText('비밀번호는 8자 이상')).toBeVisible();
    });

    test('should validate password confirmation', async ({ page }) => {
      await page.getByLabel('이메일').fill('newuser@example.com');
      await page.getByLabel('비밀번호', { exact: true }).fill('Password123!');
      await page.getByLabel('비밀번호 확인').fill('DifferentPassword123!');
      await page.getByRole('checkbox').check();
      await page.getByRole('button', { name: '회원가입' }).click();

      await expect(page.getByText('비밀번호가 일치하지 않습니다')).toBeVisible();
    });

    test('should require terms agreement', async ({ page }) => {
      await page.getByLabel('이메일').fill('newuser@example.com');
      await page.getByLabel('비밀번호', { exact: true }).fill('Password123!');
      await page.getByLabel('비밀번호 확인').fill('Password123!');
      // Don't check the terms checkbox
      await page.getByRole('button', { name: '회원가입' }).click();

      // HTML5 validation should prevent submission
      await expect(page.getByRole('checkbox')).toBeFocused();
    });

    test('should register successfully', async ({ page }) => {
      const uniqueEmail = `test${Date.now()}@example.com`;

      await page.getByLabel('성').fill('홍');
      await page.getByLabel('이름').fill('길동');
      await page.getByLabel('이메일').fill(uniqueEmail);
      await page.getByLabel('비밀번호', { exact: true }).fill('Password123!');
      await page.getByLabel('비밀번호 확인').fill('Password123!');
      await page.getByRole('checkbox').check();
      await page.getByRole('button', { name: '회원가입' }).click();

      await expect(page.getByText('회원가입 완료')).toBeVisible({ timeout: 5000 });
      await expect(page.getByText('인증 메일을 발송했습니다')).toBeVisible();
    });
  });

  test.describe('Forgot Password Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/auth/forgot-password');
    });

    test('should display forgot password form', async ({ page }) => {
      await expect(page.getByRole('heading', { name: '비밀번호 찾기' })).toBeVisible();
      await expect(page.getByLabel('이메일')).toBeVisible();
      await expect(page.getByRole('button', { name: '재설정 링크 받기' })).toBeVisible();
    });

    test('should validate email format', async ({ page }) => {
      await page.getByLabel('이메일').fill('invalid-email');
      await page.getByRole('button', { name: '재설정 링크 받기' }).click();

      await expect(page.getByText('올바른 이메일 형식이 아닙니다')).toBeVisible();
    });

    test('should show success message after submission', async ({ page }) => {
      await page.getByLabel('이메일').fill('test@example.com');
      await page.getByRole('button', { name: '재설정 링크 받기' }).click();

      await expect(page.getByText('이메일을 확인해주세요')).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Reset Password Page', () => {
    test('should show error for invalid token', async ({ page }) => {
      await page.goto('/auth/reset-password');
      await expect(page.getByText('유효하지 않은 링크')).toBeVisible();
    });

    test('should display reset form with valid token', async ({ page }) => {
      await page.goto('/auth/reset-password?token=test-token');
      await expect(page.getByRole('heading', { name: '새 비밀번호 설정' })).toBeVisible();
      await expect(page.getByLabel('새 비밀번호', { exact: true })).toBeVisible();
      await expect(page.getByLabel('새 비밀번호 확인')).toBeVisible();
    });

    test('should validate password requirements', async ({ page }) => {
      await page.goto('/auth/reset-password?token=test-token');

      await page.getByLabel('새 비밀번호', { exact: true }).fill('weak');
      await page.getByLabel('새 비밀번호 확인').fill('weak');
      await page.getByRole('button', { name: '비밀번호 변경' }).click();

      await expect(page.getByText('비밀번호는 8자 이상')).toBeVisible();
    });
  });

  test.describe('Email Verification', () => {
    test('should show error for missing token', async ({ page }) => {
      await page.goto('/auth/verify-email');
      await expect(page.getByText('유효하지 않은 인증 링크')).toBeVisible({ timeout: 5000 });
    });

    test('should show loading state', async ({ page }) => {
      await page.goto('/auth/verify-email?token=test-token');
      await expect(page.getByText('이메일 인증 중')).toBeVisible();
    });
  });

  test.describe('OAuth Callback', () => {
    test('should show error on callback error', async ({ page }) => {
      await page.goto('/auth/callback?error=access_denied');
      await expect(page.getByText('소셜 로그인에 실패했습니다')).toBeVisible({ timeout: 5000 });
    });

    test('should show error for missing token', async ({ page }) => {
      await page.goto('/auth/callback');
      await expect(page.getByText('인증 정보가 없습니다')).toBeVisible({ timeout: 5000 });
    });

    test('should show loading state with valid token', async ({ page }) => {
      await page.goto('/auth/callback?accessToken=test-token');
      await expect(page.getByText('로그인 처리 중')).toBeVisible();
    });
  });

  test.describe('Dark Mode Support', () => {
    test('should render correctly in dark mode', async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.goto('/auth/login');

      const body = page.locator('body');
      // Check dark mode styles are applied
      await expect(body).toBeVisible();
    });
  });

  test.describe('Mobile Responsiveness', () => {
    test('should be responsive on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/auth/login');

      await expect(page.getByRole('heading', { name: '로그인' })).toBeVisible();
      await expect(page.getByLabel('이메일')).toBeVisible();
    });
  });
});
