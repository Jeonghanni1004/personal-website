import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import DiaryStory from '../components/DiaryStory';
import { getDiaryByDate } from '../api';
import type { DiaryEntry } from '../types';

export default function DiaryStoryPage() {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!date) return;
    getDiaryByDate(date).then((e) => {
      setEntries(e);
      setReady(true);
    });
  }, [date]);

  if (!date || !ready) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center text-white/70">
        打开这一天…
      </div>
    );
  }

  return (
    <AnimatePresence>
      <DiaryStory
        entries={entries}
        date={date}
        onClose={() => navigate('/diary')}
      />
    </AnimatePresence>
  );
}
