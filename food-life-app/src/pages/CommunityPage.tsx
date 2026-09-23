import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import PostCard from '../components/PostCard';
import { getPosts, likePost, savePost } from '../api';
import type { Post } from '../types';

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = () =>
    getPosts().then((p) => {
      setPosts(p);
      setLoading(false);
    });

  useEffect(() => {
    refresh();
  }, []);

  const onLike = async (id: string) => {
    await likePost(id);
    refresh();
  };

  const onSave = async (id: string) => {
    await savePost(id);
    refresh();
  };

  return (
    <PageTransition>
      <div className="page">
        <header className="flex items-center justify-between mb-5 pt-2">
          <p className="text-ink-muted text-sm">今天大家都吃了什么</p>
          <Link
            to="/post/create"
            className="w-11 h-11 rounded-full bg-tomato text-white flex items-center justify-center shadow-card"
            aria-label="发帖"
          >
            <Plus size={22} />
          </Link>
        </header>

        {loading ? (
          <p className="text-center text-ink-muted py-16">饭圈正在开饭…</p>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 text-ink-muted">
            <p className="font-display text-lg mb-1">还没有人分享</p>
            <p className="text-sm">去做第一道菜的见证者吧。</p>
          </div>
        ) : (
          posts.map((p) => (
            <PostCard key={p.id} post={p} onLike={onLike} onSave={onSave} />
          ))
        )}
      </div>
    </PageTransition>
  );
}
