import { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import PageTransition from '../components/PageTransition';
import PostCard from '../components/PostCard';
import { getPosts, likePost, savePost } from '../api';
import type { Post } from '../types';

export default function ProfileSavedPage() {
  const [posts, setPosts] = useState<Post[]>([]);

  const refresh = () => getPosts().then((p) => setPosts(p.filter((x) => x.saved)));

  useEffect(() => {
    refresh();
  }, []);

  return (
    <PageTransition>
      <div className="page">
        <PageHeader title="我的收藏" />
        {posts.length === 0 ? (
          <p className="text-center text-ink-muted py-16 text-sm">
            收藏的分享会出现在这里。
          </p>
        ) : (
          posts.map((p) => (
            <PostCard
              key={p.id}
              post={p}
              onLike={async (id) => {
                await likePost(id);
                refresh();
              }}
              onSave={async (id) => {
                await savePost(id);
                refresh();
              }}
            />
          ))
        )}
      </div>
    </PageTransition>
  );
}
