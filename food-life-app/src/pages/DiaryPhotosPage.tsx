import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import PageTransition from '../components/PageTransition';
import ImageGrid from '../components/ImageGrid';
import { getDiaryEntries } from '../api';
import type { DiaryEntry } from '../types';

export default function DiaryPhotosPage() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    getDiaryEntries().then(setEntries);
  }, []);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <PageTransition>
      <div className="page page-flush px-0">
        <div className="px-5">
          <PageHeader title="仅图片" />
        </div>
        <ImageGrid entries={entries} selected={selected} onToggle={toggle} />

        {selected.size > 0 && (
          <div className="sticky bottom-0 px-5 py-4 bg-cream/95 backdrop-blur border-t border-border z-40">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium">已选择 {selected.size} 张</p>
              <button
                type="button"
                className="btn-primary px-6 py-3"
                onClick={() =>
                  navigate(`/post/create?ids=${Array.from(selected).join(',')}`)
                }
              >
                一键发帖
              </button>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
