/**
 * Profile Page 테스트
 * /profile은 /mypage로 리다이렉트됩니다.
 */

import { redirect } from 'next/navigation';
import { vi } from 'vitest';
import ProfilePage from '../page';

// Mock Next.js redirect
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

describe('Profile Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('/mypage로 리다이렉트되어야 함', () => {
    ProfilePage();
    expect(redirect).toHaveBeenCalledWith('/mypage');
  });
});
