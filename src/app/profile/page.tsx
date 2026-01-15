import { redirect } from 'next/navigation';

/**
 * /profile 페이지는 /mypage로 리다이렉트됩니다.
 * 이전 URL 호환성을 위해 유지됩니다.
 */
export default function ProfilePage() {
  redirect('/mypage');
}
