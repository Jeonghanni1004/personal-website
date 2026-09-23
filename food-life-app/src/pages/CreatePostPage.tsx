import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import PageTransition from '../components/PageTransition';
import ImageGrid from '../components/ImageGrid';
import { getDiaryEntries, createPost, MOCK_CAMERA_IMAGES } from '../api';
import type { DiaryEntry } from '../types';
import { cn } from '../utils/meal';

export default function CreatePostPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [step, setStep] = useState<'pick' | 'edit'>('pick');
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [content, setContent] = useState('');
  const [foodName, setFoodName] = useState('');
  const [location, setLocation] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    getDiaryEntries().then((all) => {
      setEntries(all);
      const ids = params.get('ids');
      if (ids) {
        const set = new Set(ids.split(',').filter(Boolean));
        setSelected(set);
        const imgs = all.filter((e) => set.has(e.id)).map((e) => e.image);
        if (imgs.length) {
          setImages(imgs);
          const first = all.find((e) => set.has(e.id));
          if (first) setFoodName(first.foodName);
          setStep('edit');
        }
      }
    });
  }, [params]);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const confirmPick = () => {
    const imgs = entries.filter((e) => selected.has(e.id)).map((e) => e.image);
    if (!imgs.length) return;
    setImages(imgs);
    const first = entries.find((e) => selected.has(e.id));
    if (first && !foodName) setFoodName(first.foodName);
    setStep('edit');
  };

  const useMockPhoto = () => {
    const img = MOCK_CAMERA_IMAGES[Math.floor(Math.random() * MOCK_CAMERA_IMAGES.length)];
    setImages([img]);
    setStep('edit');
  };

  const publish = async () => {
    if (!images.length || !content.trim()) return;
    setPublishing(true);
    await createPost({
      images,
      content: content.trim(),
      foodName: foodName || undefined,
      location: location || undefined,
    });
    setPublishing(false);
    navigate('/community');
  };

  return (
    <PageTransition>
      <div className="page">
        <PageHeader title="发帖" />

        {step === 'pick' && (
          <>
            <p className="text-ink-muted text-sm mb-4">从美食日记选图，或用一张示例图</p>
            <button
              type="button"
              onClick={useMockPhoto}
              className="btn-secondary w-full py-3 mb-4"
            >
              Mock 拍照
            </button>
            <ImageGrid entries={entries} selected={selected} onToggle={toggle} />
            {selected.size > 0 && (
              <div className="sticky bottom-0 -mx-5 mt-4 px-5 py-4 bg-cream/95 backdrop-blur border-t border-border">
                <button type="button" onClick={confirmPick} className="btn-primary w-full py-3.5">
                  已选择 {selected.size} 张，下一步
                </button>
              </div>
            )}
          </>
        )}

        {step === 'edit' && (
          <div className="space-y-4">
            <div className="flex gap-2 overflow-x-auto">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt=""
                  className="w-24 h-24 rounded-2xl object-cover shrink-0"
                />
              ))}
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              placeholder="今天吃了什么，写两句…"
              className="w-full px-4 py-3 rounded-2xl border border-border bg-card outline-none focus:border-tomato resize-none"
            />
            <input
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              placeholder="菜品（可选）"
              className="w-full px-4 py-3 rounded-2xl border border-border bg-card outline-none"
            />
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="地点（可选，手动填写）"
              className="w-full px-4 py-3 rounded-2xl border border-border bg-card outline-none"
            />
            <button
              type="button"
              onClick={publish}
              disabled={publishing || !content.trim()}
              className={cn('btn-primary w-full py-4 disabled:opacity-50')}
            >
              {publishing ? '发布中…' : '发布'}
            </button>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
