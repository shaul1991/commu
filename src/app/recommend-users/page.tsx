'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/templates';
import { UserCard } from '@/components/molecules';
import { Skeleton } from '@/components/atoms';
import { Users } from 'lucide-react';
import { getRecommendedUsers, toggleUserFollow, type RecommendedUser } from '@/lib/api/users';

export default function RecommendUsersPage() {
  const [users, setUsers] = useState<RecommendedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [followingId, setFollowingId] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      try {
        const data = await getRecommendedUsers();
        setUsers(data);
      } catch (error) {
        console.error('추천 사용자 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleFollowToggle = async (user: RecommendedUser) => {
    setFollowingId(user.id);
    try {
      const updated = await toggleUserFollow(user.id);
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? updated : u))
      );
    } catch (error) {
      console.error('팔로우 상태 변경 실패:', error);
    } finally {
      setFollowingId(null);
    }
  };

  return (
    <MainLayout>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Users className="w-6 h-6 text-[var(--color-primary-500)]" />
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">추천 사용자</h1>
        </div>
        <p className="mt-1 text-[var(--text-secondary)]">
          관심사가 비슷한 사용자들을 팔로우하고 소통해보세요
        </p>
      </div>

      {/* User List */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-[var(--bg-surface)] rounded-[var(--radius-lg)] border border-[var(--border-default)] p-4"
            >
              <div className="flex items-start gap-3">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-12 h-12 mx-auto text-[var(--text-tertiary)] mb-4" />
          <p className="text-[var(--text-secondary)]">추천할 사용자가 없습니다</p>
        </div>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onFollowToggle={handleFollowToggle}
              isFollowing={followingId === user.id}
            />
          ))}
        </div>
      )}
    </MainLayout>
  );
}
