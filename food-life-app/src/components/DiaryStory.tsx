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

const DURATION = 4500;
const SWIPE_X = 80;

export default function DiaryStory({ entries, date, onClose }: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [tick, setTick] = useState(0); // bump to restart progress animation
  const timerRef = useRef<number | null>(null);
  const y = useMotionValue(0);
  const x = useMotionValue(0);
  const opacity = useTransform(y, [0, 200], [1, 0.45]);

  const current = entries[index];
  const isLast = index >= entries.length - 1;
  const isFirst = index <= 0;

  const clearTimer = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const goNext = useCallback(() => {
    setIndex((i) => {
      if (i < entries.length - 1) {
        setTick((t) => t + 1);
        return i + 1;
      }
      return i;
    });
  }, [entries.length]);

  const goPrev = useCallback(() => {
    setIndex((i) => {
      if (i > 0) {
        setTick((t) => t + 1);
        return i - 1;
      }
      return i;
    });
  }, []);

  // 自动轮播：切页 / 滑动后都会重新计时；最后一张停住
  useEffect(() => {
    clearTimer();
    if (paused || isLast || entries.length === 0) return;
    timerRef.current = window.setTimeout(goNext, DURATION);
    return clearTimer;
  }, [index, goNext, paused, isLast, entries.length, tick]);

  if (!current) {
    return (
      <div className="absolute inset-0 z-[100] bg-ink flex items-center justify-center text-white">
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
      className="absolute inset-0 z-[100] bg-black flex flex-col overflow-hidden"
      style={{ opacity }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="relative flex-1 min-h-0 w-full overflow-hidden"
        style={{ y, x }}
        drag
        dragDirectionLock
        dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
        dragElastic={0.2}
        onDragStart={() => setPaused(true)}
        onDragEnd={(_, info) => {
          setPaused(false);
          const { offset, velocity } = info;

          // 优先识别横向滑动切图
          if (Math.abs(offset.x) > Math.abs(offset.y) && Math.abs(offset.x) > SWIPE_X) {
            if (offset.x < 0 && !isLast) goNext();
            else if (offset.x > 0 && !isFirst) goPrev();
            animate(x, 0, { type: 'spring', stiffness: 420, damping: 32 });
            animate(y, 0, { type: 'spring', stiffness: 420, damping: 32 });
            return;
          }

          // 下滑退出
          if (offset.y > 120 || velocity.y > 500) {
            onClose();
            return;
          }

          animate(x, 0, { type: 'spring', stiffness: 400, damping: 30 });
          animate(y, 0, { type: 'spring', stiffness: 400, damping: 30 });
        }}
      >
        <motion.div
          key={current.id}
          className="absolute inset-0"
          initial={{ opacity: 0.6, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
        >
          <SafeImage
            src={current.image}
            className="absolute inset-0 w-full h-full"
            alt={current.foodName}
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60 pointer-events-none" />

        {/* progress */}
        <div
          className="absolute left-3 right-3 flex gap-1 z-20 pointer-events-none"
          style={{ top: 'calc(12px + env(safe-area-inset-top))' }}
        >
          {entries.map((_, i) => (
            <div key={`${i}-${tick}`} className="h-0.5 flex-1 rounded-full bg-white/30 overflow-hidden">
              <motion.div
                className="h-full bg-white"
                initial={{ scaleX: i < index ? 1 : 0 }}
                animate={{ scaleX: i <= index ? 1 : 0 }}
                transition={
                  i === index && !isLast && !paused
                    ? { duration: DURATION / 1000, ease: 'linear' }
                    : { duration: 0 }
                }
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

        {/* 点击左右切图（不打断自动轮播：切页会重置计时） */}
        <div className="absolute inset-0 z-10 flex">
          <button
            type="button"
            className="w-1/3 h-full"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            aria-label="上一张"
          />
          <button
            type="button"
            className="w-2/3 h-full"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            aria-label="下一张"
          />
        </div>

        <div
          className="absolute left-0 right-0 bottom-0 z-20 p-6 text-white pointer-events-none"
          style={{ paddingBottom: 'calc(28px + env(safe-area-inset-bottom))' }}
        >
          <p className="text-white/70 text-sm mb-1">
            {format(new Date(date + 'T12:00:00'), 'M月d日 EEEE', { locale: zhCN })} · {current.time}
            {entries.length > 1 ? ` · ${index + 1}/${entries.length}` : ''}
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
