import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { X } from 'lucide-react';
import type { DiaryEntry } from '../types';
import SafeImage from './SafeImage';
import { MOOD_OPTIONS } from '../types';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface Props {
  entries: DiaryEntry[];
  date: string;
  onClose: () => void;
}

export default function DiaryStory({ entries, date, onClose }: Props) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<number | null>(null);
  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, 200], [1, 0.4]);

  const current = entries[index];
  const duration = 4500;

  const goNext = useCallback(() => {
    if (index < entries.length - 1) setIndex((i) => i + 1);
    // 最后一张停留，不自动关闭
  }, [index, entries.length]);

  const goPrev = useCallback(() => {
    if (index > 0) setIndex((i) => i - 1);
  }, [index]);

  useEffect(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    // 最后一张不再自动跳转/关闭
    if (index >= entries.length - 1) return;
    timerRef.current = window.setTimeout(goNext, duration);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [index, goNext, entries.length]);

  if (!current) {
    return (
      <div className="fixed inset-0 z-[100] bg-ink flex items-center justify-center text-white">
        <p>这一天还没吃东西？去记录一顿吧。</p>
        <button type="button" onClick={onClose} className="absolute top-12 right-6">
          <X />
        </button>
      </div>
    );
  }

  const mood = MOOD_OPTIONS.find((m) => m.value === current.mood);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-black flex justify-center"
      style={{ opacity }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="relative w-full max-w-[430px] h-full overflow-hidden"
        style={{ y }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={(_, info) => {
          if (info.offset.y > 120 || info.velocity.y > 500) {
            onClose();
          } else {
            animate(y, 0, { type: 'spring', stiffness: 400, damping: 30 });
          }
        }}
      >
        <SafeImage
          src={current.image}
          className="absolute inset-0 w-full h-full"
          alt={current.foodName}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60" />

        {/* progress */}
        <div
          className="absolute left-3 right-3 flex gap-1 z-20"
          style={{ top: 'calc(12px + env(safe-area-inset-top))' }}
        >
          {entries.map((_, i) => (
            <div key={i} className="h-0.5 flex-1 rounded-full bg-white/30 overflow-hidden">
              <motion.div
                className="h-full bg-white origin-left"
                initial={{ scaleX: i < index ? 1 : 0 }}
                animate={{ scaleX: i < index ? 1 : i === index ? 1 : 0 }}
                transition={i === index ? { duration: duration / 1000, ease: 'linear' } : { duration: 0 }}
                style={{ transformOrigin: 'left' }}
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 z-20 w-9 h-9 rounded-full bg-black/30 text-white flex items-center justify-center"
          style={{ top: 'calc(28px + env(safe-area-inset-top))' }}
          aria-label="关闭"
        >
          <X size={18} />
        </button>

        <div className="absolute inset-0 z-10 flex">
          <button type="button" className="w-1/3 h-full" onClick={goPrev} aria-label="上一张" />
          <button type="button" className="w-2/3 h-full" onClick={goNext} aria-label="下一张" />
        </div>

        <div
          className="absolute left-0 right-0 bottom-0 z-20 p-6 text-white"
          style={{ paddingBottom: 'calc(28px + env(safe-area-inset-bottom))' }}
        >
          <p className="text-white/70 text-sm mb-1">
            {format(new Date(date), 'M月d日 EEEE', { locale: zhCN })} · {current.time}
          </p>
          <h2 className="font-display text-3xl font-semibold mb-1">{current.foodName}</h2>
          <p className="text-white/80 text-sm mb-2">{current.mealType}</p>
          {mood && (
            <p className="text-sm mb-2">
              {mood.emoji} {mood.label}
            </p>
          )}
          {current.note && <p className="text-sm text-white/90 leading-relaxed">{current.note}</p>}
        </div>
      </motion.div>
    </motion.div>
  );
}
