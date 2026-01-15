/**
 * 환경 설정 유틸리티
 */

export const env = {
  /** 로컬 개발 환경 여부 */
  isLocal: process.env.NEXT_PUBLIC_ENV === 'local',
  /** 프로덕션 환경 여부 */
  isProduction: process.env.NEXT_PUBLIC_ENV === 'production',
  /** API 서버 URL */
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  /** 현재 환경 */
  current: process.env.NEXT_PUBLIC_ENV || 'local',
};

/**
 * Mock 데이터 사용 여부 판단
 * local 환경에서만 Mock 데이터 사용
 */
export function shouldUseMock(): boolean {
  return env.isLocal || env.current === 'local';
}
