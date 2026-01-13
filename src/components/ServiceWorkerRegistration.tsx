'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // 페이지 로드 후 Service Worker 등록
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('[SW] 등록 성공:', registration.scope);

            // 업데이트 체크
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    // 새 버전 사용 가능 알림
                    console.log('[SW] 새 버전 사용 가능');
                    // 여기에 업데이트 알림 UI 표시 로직 추가 가능
                  }
                });
              }
            });
          })
          .catch((error) => {
            console.error('[SW] 등록 실패:', error);
          });
      });

      // 온라인/오프라인 상태 감지
      const handleOnline = () => {
        console.log('[네트워크] 온라인 복구');
      };

      const handleOffline = () => {
        console.log('[네트워크] 오프라인 전환');
      };

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  return null;
}

export default ServiceWorkerRegistration;
