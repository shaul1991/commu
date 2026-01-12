import { MainLayout } from '@/components/templates';
import { Button, Badge } from '@/components/atoms';
import { Compass, Search, Users, Hash, TrendingUp } from 'lucide-react';
import Link from 'next/link';

// Sample channels data
const popularChannels = [
  { slug: 'tech', name: '기술', members: 12453, posts: 8923, color: 'primary' },
  { slug: 'career', name: '커리어', members: 8721, posts: 5432, color: 'success' },
  { slug: 'daily', name: '일상', members: 15234, posts: 12543, color: 'warning' },
  { slug: 'question', name: '질문', members: 9876, posts: 7654, color: 'info' },
  { slug: 'news', name: '뉴스', members: 6543, posts: 4321, color: 'error' },
  { slug: 'review', name: '리뷰', members: 4532, posts: 2345, color: 'secondary' },
];

// Sample trending tags
const trendingTags = [
  { name: 'Next.js', count: 234 },
  { name: 'React', count: 189 },
  { name: 'TypeScript', count: 156 },
  { name: '취업', count: 143 },
  { name: 'AI', count: 128 },
  { name: '이직', count: 98 },
  { name: 'ChatGPT', count: 87 },
  { name: '연봉', count: 76 },
];

// Sample recommended users
const recommendedUsers = [
  { name: '개발자김', username: 'devkim', followers: 1234, bio: '풀스택 개발자 | Next.js 애호가' },
  { name: 'AI연구자', username: 'airesearcher', followers: 2345, bio: 'ML/DL 연구 | 논문 리뷰' },
  { name: '커리어코치', username: 'careercoach', followers: 3456, bio: 'IT 채용 담당자 | 커리어 조언' },
];

const colorMap: Record<string, string> = {
  primary: 'bg-[var(--color-primary-100)] text-[var(--color-primary-600)]',
  success: 'bg-[var(--color-success-50)] text-[var(--color-success-600)]',
  warning: 'bg-[var(--color-warning-50)] text-[var(--color-warning-600)]',
  info: 'bg-[var(--color-info-50)] text-[var(--color-info-600)]',
  error: 'bg-[var(--color-error-50)] text-[var(--color-error-600)]',
  secondary: 'bg-[var(--bg-muted)] text-[var(--text-secondary)]',
};

export default function ExplorePage() {
  return (
    <MainLayout>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Compass className="w-6 h-6 text-[var(--color-primary-500)]" />
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">탐색</h1>
        </div>
        <p className="mt-1 text-[var(--text-secondary)]">
          관심사에 맞는 채널과 사용자를 찾아보세요
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)]" />
        <input
          type="text"
          placeholder="채널, 태그, 사용자 검색..."
          className="w-full pl-12 pr-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-lg)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent"
        />
      </div>

      {/* Popular Channels Section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
            <Hash className="w-5 h-5" />
            인기 채널
          </h2>
          <Link href="/channels" className="text-sm text-[var(--color-primary-500)] hover:underline">
            전체 보기
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {popularChannels.map((channel) => (
            <Link
              key={channel.slug}
              href={`/channel/${channel.slug}`}
              className="bg-[var(--bg-surface)] rounded-[var(--radius-lg)] border border-[var(--border-default)] p-4 hover:border-[var(--border-strong)] transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className={`w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center text-lg font-bold ${colorMap[channel.color]}`}>
                  {channel.name[0]}
                </span>
                <div className="flex-1">
                  <h3 className="font-medium text-[var(--text-primary)]">{channel.name}</h3>
                  <p className="text-sm text-[var(--text-tertiary)]">
                    {channel.members.toLocaleString()}명 · 게시글 {channel.posts.toLocaleString()}개
                  </p>
                </div>
                <Button variant="secondary" size="sm">구독</Button>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Tags Section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            트렌딩 태그
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {trendingTags.map((tag) => (
            <Link
              key={tag.name}
              href={`/tag/${tag.name}`}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-full text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:border-[var(--border-strong)] transition-colors"
            >
              <span>#</span>
              <span>{tag.name}</span>
              <span className="text-[var(--text-tertiary)]">({tag.count})</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Recommended Users Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
            <Users className="w-5 h-5" />
            추천 사용자
          </h2>
          <Link href="/users" className="text-sm text-[var(--color-primary-500)] hover:underline">
            전체 보기
          </Link>
        </div>
        <div className="space-y-4">
          {recommendedUsers.map((user) => (
            <div
              key={user.username}
              className="bg-[var(--bg-surface)] rounded-[var(--radius-lg)] border border-[var(--border-default)] p-4 hover:border-[var(--border-strong)] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[var(--color-primary-100)] flex items-center justify-center text-lg font-bold text-[var(--color-primary-600)]">
                  {user.name[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-[var(--text-primary)]">{user.name}</h3>
                    <span className="text-sm text-[var(--text-tertiary)]">@{user.username}</span>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] mt-0.5">{user.bio}</p>
                  <p className="text-xs text-[var(--text-tertiary)] mt-1">
                    팔로워 {user.followers.toLocaleString()}명
                  </p>
                </div>
                <Button variant="primary" size="sm">팔로우</Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </MainLayout>
  );
}
