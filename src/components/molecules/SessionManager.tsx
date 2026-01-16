'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './Card';
import { Modal } from './Modal';
import { authApi } from '@/lib/api/auth';
import { cn } from '@/lib/utils';

interface SessionManagerProps {
  className?: string;
}

export function SessionManager({ className }: SessionManagerProps) {
  const [sessions, setSessions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLogoutAllLoading, setIsLogoutAllLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const fetchSessions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.getActiveSessions();
      if (response.data) {
        setSessions(response.data.sessions);
      }
    } catch (err) {
      setError('세션 목록을 불러오는데 실패했습니다.');
      console.error('Failed to fetch sessions:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleLogoutAll = async () => {
    setIsLogoutAllLoading(true);
    try {
      await authApi.logoutAll();
      // 현재 세션도 로그아웃되므로 페이지 새로고침
      window.location.href = '/auth/login';
    } catch (err) {
      setError('전체 로그아웃에 실패했습니다.');
      console.error('Failed to logout all:', err);
      setIsLogoutAllLoading(false);
    }
  };

  const formatSessionId = (sessionId: string) => {
    // UUID의 처음 8자리만 표시
    return sessionId.substring(0, 8);
  };

  return (
    <>
      <Card variant="default" className={cn('w-full', className)}>
        <CardHeader>
          <CardTitle>연결된 기기</CardTitle>
          <CardDescription>
            현재 로그인된 모든 기기를 확인하고 관리할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-[var(--color-primary-500)] border-t-transparent" />
            </div>
          ) : error ? (
            <div className="text-center py-4">
              <p className="text-[var(--color-error-500)] mb-2">{error}</p>
              <Button variant="secondary" size="sm" onClick={fetchSessions}>
                다시 시도
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-3 mb-4">
                {sessions.length === 0 ? (
                  <p className="text-[var(--text-secondary)] text-center py-4">
                    활성 세션이 없습니다.
                  </p>
                ) : (
                  sessions.map((sessionId, index) => (
                    <div
                      key={sessionId}
                      className={cn(
                        'flex items-center justify-between p-3 rounded-lg',
                        'bg-[var(--bg-hover)] border border-[var(--border-default)]'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[var(--color-primary-100)] flex items-center justify-center">
                          <DeviceIcon />
                        </div>
                        <div>
                          <p className="font-medium text-[var(--text-primary)]">
                            기기 {index + 1}
                          </p>
                          <p className="text-sm text-[var(--text-secondary)]">
                            세션 ID: {formatSessionId(sessionId)}
                          </p>
                        </div>
                      </div>
                      {index === 0 && (
                        <span className="text-xs px-2 py-1 rounded-full bg-[var(--color-primary-100)] text-[var(--color-primary-700)]">
                          현재 기기
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>

              {sessions.length > 0 && (
                <div className="pt-4 border-t border-[var(--border-default)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-[var(--text-primary)]">
                        모든 기기에서 로그아웃
                      </p>
                      <p className="text-sm text-[var(--text-secondary)]">
                        {sessions.length}개의 기기에서 로그아웃됩니다.
                      </p>
                    </div>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setShowConfirmModal(true)}
                      disabled={isLogoutAllLoading}
                    >
                      전체 로그아웃
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* 전체 로그아웃 확인 모달 */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="전체 로그아웃"
      >
        <div className="space-y-4">
          <p className="text-[var(--text-secondary)]">
            모든 기기에서 로그아웃하시겠습니까?
            <br />
            현재 기기를 포함한 {sessions.length}개의 기기에서 로그아웃됩니다.
          </p>
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => setShowConfirmModal(false)}
            >
              취소
            </Button>
            <Button
              variant="danger"
              onClick={handleLogoutAll}
              isLoading={isLogoutAllLoading}
            >
              전체 로그아웃
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

function DeviceIcon() {
  return (
    <svg
      className="w-5 h-5 text-[var(--color-primary-600)]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}

export default SessionManager;
