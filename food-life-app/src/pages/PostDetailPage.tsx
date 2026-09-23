import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Heart, Bookmark, Send } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import PageTransition from '../components/PageTransition';
import SafeImage from '../components/SafeImage';
import { getPost, likePost, savePost, commentPost } from '../api';
import type { Post } from '../types';
import { formatFeedTime } from '../utils/time';

export default function PostDetailPage() {
  const { postId } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    if (!postId) return;
    const p = await getPost(postId);
    setPost(p || null);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, [postId]);

  if (loading) {
    return (
      <PageTransition>
        <div className="page">
          <PageHeader />
          <p className="text-center text-ink-muted py-20">加载中…</p>
        </div>
      </PageTransition>
    );
  }

  if (!post) {
    return (
      <PageTransition>
        <div className="page">
          <PageHeader />
          <p className="text-center text-ink-muted py-20">这条分享找不到了</p>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="page pb-32">
        <PageHeader title="详情" />
        <div className="flex items-center gap-3 mb-4">
          <SafeImage
            src={post.author.avatar}
            className="w-11 h-11 rounded-full"
            alt={post.author.name}
            fallbackEmoji="👤"
          />
          <div>
            <p className="font-semibold">{post.author.name}</p>
            <p className="text-xs text-ink-muted">
              {formatFeedTime(post.createdAt)}
              {post.location ? ` · ${post.location}` : ''}
            </p>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          {post.images.map((img, i) => (
            <SafeImage
              key={i}
              src={img}
              className="w-full rounded-[24px] aspect-[4/3]"
              alt={post.foodName || ''}
            />
          ))}
        </div>

        {post.foodName && (
          <p className="text-tomato text-sm font-semibold mb-1">{post.foodName}</p>
        )}
        <p className="leading-relaxed mb-4">{post.content}</p>

        <div className="flex items-center gap-5 mb-6">
          <button
            type="button"
            className="flex items-center gap-1.5"
            onClick={async () => {
              await likePost(post.id);
              refresh();
            }}
          >
            <Heart
              size={20}
              className={post.liked ? 'fill-tomato text-tomato' : 'text-ink-muted'}
            />
            <span>{post.likes}</span>
          </button>
          <button
            type="button"
            onClick={async () => {
              await savePost(post.id);
              refresh();
            }}
          >
            <Bookmark
              size={20}
              className={post.saved ? 'fill-sun text-sun' : 'text-ink-muted'}
            />
          </button>
        </div>

        <h3 className="font-display font-semibold text-lg mb-3">
          评论 {post.commentList?.length ? `(${post.commentList.length})` : ''}
        </h3>
        <div className="space-y-4 mb-6">
          {(post.commentList || []).length === 0 ? (
            <p className="text-sm text-ink-muted">还没有评论，来说两句？</p>
          ) : (
            post.commentList!.map((c) => (
              <div key={c.id} className="flex gap-3">
                <SafeImage
                  src={c.author.avatar}
                  className="w-8 h-8 rounded-full shrink-0"
                  alt=""
                  fallbackEmoji="👤"
                />
                <div>
                  <p className="text-sm font-semibold">{c.author.name}</p>
                  <p className="text-sm text-ink">{c.content}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-5 py-3 bg-cream/95 backdrop-blur border-t border-border flex gap-2"
          style={{ paddingBottom: 'calc(12px + env(safe-area-inset-bottom))' }}
        >
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="说点什么…"
            className="flex-1 px-4 py-2.5 rounded-full border border-border bg-card outline-none"
          />
          <button
            type="button"
            disabled={!text.trim()}
            className="w-10 h-10 rounded-full bg-tomato text-white flex items-center justify-center disabled:opacity-40"
            onClick={async () => {
              await commentPost(post.id, text.trim());
              setText('');
              refresh();
            }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </PageTransition>
  );
}
