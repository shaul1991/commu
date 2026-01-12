import { MainLayout } from '@/components/templates';
import { Button, Badge, Avatar } from '@/components/atoms';
import { ThumbsUp, ThumbsDown, MessageCircle, Bookmark, Share2, Flag, MoreHorizontal, ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';

// Sample post data
const postData = {
  id: 1,
  title: 'Next.js 16 새로운 기능 총정리',
  content: `안녕하세요, 오늘은 Next.js 16에서 새롭게 추가된 기능들을 정리해보려고 합니다.

## 1. Turbopack 정식 지원

드디어 Turbopack이 정식으로 지원됩니다. 개발 서버 시작 시간이 기존 대비 최대 10배 빨라졌습니다.

\`\`\`bash
next dev --turbo
\`\`\`

## 2. 개선된 캐싱 전략

새로운 캐싱 시스템으로 더 효율적인 데이터 관리가 가능해졌습니다.

## 3. 새로운 API 라우트

기존 API Routes보다 더 간결하고 타입 안전한 새로운 방식이 도입되었습니다.

더 자세한 내용은 공식 문서를 참고해주세요!`,
  author: {
    name: '개발자김',
    username: 'devkim',
    avatar: null,
  },
  channel: '기술',
  upvotes: 523,
  downvotes: 12,
  views: 3421,
  createdAt: '2024년 1월 15일 오후 3:24',
  updatedAt: null,
};

// Sample comments
const comments = [
  {
    id: 1,
    author: {
      name: 'AI연구자',
      username: 'airesearcher',
    },
    content: '정말 유용한 글이네요! Turbopack 성능이 기대됩니다.',
    upvotes: 45,
    createdAt: '1시간 전',
    replies: [
      {
        id: 2,
        author: {
          name: '개발자김',
          username: 'devkim',
        },
        content: '감사합니다! 실제로 사용해보니 체감 성능 차이가 크더라고요.',
        upvotes: 12,
        createdAt: '30분 전',
      },
    ],
  },
  {
    id: 3,
    author: {
      name: '프론트엔드마스터',
      username: 'femaster',
    },
    content: '캐싱 전략 부분이 특히 좋았습니다. 실무에서 바로 적용해봐야겠어요.',
    upvotes: 23,
    createdAt: '2시간 전',
    replies: [],
  },
  {
    id: 4,
    author: {
      name: '신입개발자',
      username: 'newbie',
    },
    content: '초보자도 이해하기 쉽게 설명해주셨네요. 감사합니다!',
    upvotes: 8,
    createdAt: '3시간 전',
    replies: [],
  },
];

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PostPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <MainLayout>
      {/* Back Button */}
      <Link href="/" className="inline-flex items-center gap-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-4">
        <ArrowLeft className="w-4 h-4" />
        <span>뒤로가기</span>
      </Link>

      {/* Post Article */}
      <article className="bg-[var(--bg-surface)] rounded-[var(--radius-lg)] border border-[var(--border-default)] p-6 mb-6">
        {/* Post Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar name={postData.author.name} size="md" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-[var(--text-primary)]">{postData.author.name}</span>
                <span className="text-sm text-[var(--text-tertiary)]">@{postData.author.username}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[var(--text-tertiary)]">
                <Badge variant="primary">{postData.channel}</Badge>
                <span>·</span>
                <span>{postData.createdAt}</span>
              </div>
            </div>
          </div>
          <button className="p-2 hover:bg-[var(--bg-hover)] rounded-[var(--radius-md)]">
            <MoreHorizontal className="w-5 h-5 text-[var(--text-tertiary)]" />
          </button>
        </div>

        {/* Post Title */}
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
          {postData.title}
        </h1>

        {/* Post Content */}
        <div className="prose prose-neutral dark:prose-invert max-w-none text-[var(--text-primary)]">
          {postData.content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4 whitespace-pre-wrap">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Post Stats */}
        <div className="flex items-center gap-4 mt-6 pt-4 border-t border-[var(--border-default)] text-sm text-[var(--text-tertiary)]">
          <span>조회 {postData.views.toLocaleString()}</span>
        </div>

        {/* Post Actions */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--border-default)]">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-[var(--bg-muted)] rounded-full px-3 py-1.5">
              <button className="p-1 hover:bg-[var(--bg-hover)] rounded-full">
                <ThumbsUp className="w-5 h-5" />
              </button>
              <span className="font-medium text-[var(--text-primary)] min-w-[2rem] text-center">
                {postData.upvotes}
              </span>
              <button className="p-1 hover:bg-[var(--bg-hover)] rounded-full">
                <ThumbsDown className="w-5 h-5" />
              </button>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-[var(--bg-hover)] rounded-full">
              <MessageCircle className="w-5 h-5" />
              <span>{comments.length}</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-[var(--bg-hover)] rounded-full">
              <Bookmark className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-[var(--bg-hover)] rounded-full">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-[var(--bg-hover)] rounded-full text-[var(--text-tertiary)]">
              <Flag className="w-5 h-5" />
            </button>
          </div>
        </div>
      </article>

      {/* Comments Section */}
      <section>
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          댓글 {comments.length}개
        </h2>

        {/* Comment Input */}
        <div className="bg-[var(--bg-surface)] rounded-[var(--radius-lg)] border border-[var(--border-default)] p-4 mb-6">
          <div className="flex gap-3">
            <Avatar name="나" size="sm" />
            <div className="flex-1">
              <textarea
                placeholder="댓글을 작성하세요..."
                rows={3}
                className="w-full px-3 py-2 bg-[var(--bg-page)] border border-[var(--border-default)] rounded-[var(--radius-md)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
              />
              <div className="flex justify-end mt-2">
                <Button variant="primary" size="sm">
                  <Send className="w-4 h-4 mr-1" />
                  댓글 작성
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-[var(--bg-surface)] rounded-[var(--radius-lg)] border border-[var(--border-default)] p-4">
              {/* Comment */}
              <div className="flex gap-3">
                <Avatar name={comment.author.name} size="sm" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-[var(--text-primary)]">{comment.author.name}</span>
                    <span className="text-sm text-[var(--text-tertiary)]">@{comment.author.username}</span>
                    <span className="text-sm text-[var(--text-tertiary)]">· {comment.createdAt}</span>
                  </div>
                  <p className="text-[var(--text-secondary)] mb-2">{comment.content}</p>
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1 text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{comment.upvotes}</span>
                    </button>
                    <button className="text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
                      답글
                    </button>
                  </div>
                </div>
              </div>

              {/* Replies */}
              {comment.replies.length > 0 && (
                <div className="ml-10 mt-4 space-y-4 pl-4 border-l-2 border-[var(--border-default)]">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="flex gap-3">
                      <Avatar name={reply.author.name} size="xs" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-[var(--text-primary)]">{reply.author.name}</span>
                          <span className="text-sm text-[var(--text-tertiary)]">@{reply.author.username}</span>
                          <span className="text-sm text-[var(--text-tertiary)]">· {reply.createdAt}</span>
                        </div>
                        <p className="text-[var(--text-secondary)] mb-2">{reply.content}</p>
                        <div className="flex items-center gap-4">
                          <button className="flex items-center gap-1 text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
                            <ThumbsUp className="w-4 h-4" />
                            <span>{reply.upvotes}</span>
                          </button>
                          <button className="text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
                            답글
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </MainLayout>
  );
}
