import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Bookmark } from 'lucide-react';
import type { Post } from '../types';
import SafeImage from './SafeImage';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface Props {
  post: Post;
  onLike?: (id: string) => void;
  onSave?: (id: string) => void;
}

export default function PostCard({ post, onLike, onSave }: Props) {
  const time = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
    locale: zhCN,
  });

  return (
    <article className="card overflow-hidden mb-4">
      <Link to={`/community/${post.id}`} className="block">
        <div className="flex items-center gap-3 p-4 pb-3">
          <SafeImage
            src={post.author.avatar}
            alt={post.author.name}
            className="w-10 h-10 rounded-full"
            fallbackEmoji="👤"
          />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">{post.author.name}</p>
            <p className="text-ink-muted text-xs">
              {time}
              {post.location ? ` · ${post.location}` : ''}
            </p>
          </div>
        </div>
        <SafeImage
          src={post.images[0]}
          alt={post.foodName || '美食'}
          className="w-full aspect-[4/3]"
        />
        <div className="p-4 pt-3">
          {post.foodName && (
            <p className="text-tomato text-xs font-semibold mb-1">{post.foodName}</p>
          )}
          <p className="text-sm leading-relaxed line-clamp-2">{post.content}</p>
        </div>
      </Link>
      <div className="flex items-center gap-5 px-4 pb-4">
        <button
          type="button"
          className="flex items-center gap-1.5 text-sm"
          onClick={() => onLike?.(post.id)}
        >
          <Heart
            size={18}
            className={post.liked ? 'fill-tomato text-tomato' : 'text-ink-muted'}
          />
          <span className={post.liked ? 'text-tomato' : 'text-ink-muted'}>{post.likes}</span>
        </button>
        <Link
          to={`/community/${post.id}`}
          className="flex items-center gap-1.5 text-sm text-ink-muted"
        >
          <MessageCircle size={18} />
          <span>{post.comments}</span>
        </Link>
        <button
          type="button"
          className="ml-auto"
          onClick={() => onSave?.(post.id)}
          aria-label="收藏"
        >
          <Bookmark
            size={18}
            className={post.saved ? 'fill-sun text-sun' : 'text-ink-muted'}
          />
        </button>
      </div>
    </article>
  );
}
