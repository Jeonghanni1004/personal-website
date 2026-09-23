import { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import PageTransition from '../components/PageTransition';
import PostCard from '../components/PostCard';
import { getPosts, getCurrentUser, likePost, savePost } from '../api';
import type { Post } from '../types';

export default function ProfilePostsPage() {
  const me = getCurrentUser();
  const [posts, setPosts] = useState<Post[]>([]);

  const refresh = () =>
    getPosts().then((p) => setPosts(p.filter((x) => x.author.id === me.id)));

  useEffect(() => {
    refresh();
  }, []);

  return (
    <PageTransition>
      <div className="page">
        <PageHeader title="我的帖子" />
        {posts.length === 0 ? (
          <p className="text-center text-ink-muted py-16 text-sm">
            还没有发过帖，去饭圈分享一顿吧。
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
