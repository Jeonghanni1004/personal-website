import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getFoods, getRandomFood, pushRandomHistory } from '../api';
import { getMealBucket } from '../utils/meal';
import type { Food } from '../types';

const STICK_COLORS = ['#E85D4C', '#F4A261', '#E9C46A', '#2A9D8F', '#F2A7A0', '#D4A574'];
const STICK_RISE_MS = 520;
const TEXT_DELAY_MS = 180;

export default function RandomLottery() {
  const [spinning, setSpinning] = useState(false);
  const [display, setDisplay] = useState<string | null>(null);
  const [result, setResult] = useState<Food | null>(null);
  const [pool, setPool] = useState<Food[]>([]);
  const [shakeKey, setShakeKey] = useState(0);
  const [drawnStick, setDrawnStick] = useState<number | null>(null);
  const [shaking, setShaking] = useState(false);
  const bucket = getMealBucket();

  useEffect(() => {
    getFoods(bucket).then(setPool);
  }, [bucket]);

  const draw = async () => {
    if (spinning || pool.length === 0) return;
    setSpinning(true);
    setResult(null);
    setDrawnStick(null);
    setDisplay(null);
    setShaking(true);
    setShakeKey((k) => k + 1);

    const food = await getRandomFood();
    // 先晃签筒
    await new Promise((r) => setTimeout(r, 700));
    setShaking(false);

    // 再出签
    setDrawnStick(Math.floor(Math.random() * STICK_COLORS.length));
    await new Promise((r) => setTimeout(r, STICK_RISE_MS + TEXT_DELAY_MS));

    // 最后出字
    setDisplay(food.name);
    setResult(food);
    pushRandomHistory(food.name);
    setSpinning(false);
  };

  const stickOut = drawnStick !== null;

  return (
    <section className="lottery-hero relative flex flex-col h-full min-h-0">
      <div className="flex items-baseline justify-between shrink-0 mb-1">
        <h2 className="font-display text-xl font-semibold">随机吃点</h2>
        <p className="text-ink-muted text-xs">今天吃什么？</p>
      </div>

      <div className="h-11 shrink-0 flex items-center justify-center mb-1">
        <AnimatePresence>
          {display && (
            <motion.p
              key={display}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="font-display text-[22px] font-bold text-tomato text-center px-3 leading-tight truncate max-w-full"
            >
              {display}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="lottery-stage relative flex-1 min-h-0 w-full">
        <motion.div
          key={shakeKey}
          className="absolute inset-0 flex flex-col items-center justify-end pb-1"
          animate={
            shaking
              ? {
                  rotate: [0, -5, 5, -4, 4, -2, 2, 0],
                  x: [0, -3, 3, -2, 2, 0],
                }
              : { rotate: 0, x: 0 }
          }
          transition={
            shaking
              ? { duration: 0.5, ease: 'easeInOut', repeat: 1 }
              : { duration: 0.25 }
          }
        >
          <div className="relative w-full max-w-[220px] h-full max-h-[240px]">
            <div className="absolute left-1/2 -translate-x-1/2 bottom-[38%] w-[70%] h-[55%] z-10 overflow-visible">
              {STICK_COLORS.map((color, i) => {
                const isDrawn = drawnStick === i;
                const idleAngle = (i - 2.5) * 6;
                return (
                  <motion.div
                    key={i}
                    className="absolute left-1/2 bottom-0 origin-bottom"
                    style={{ marginLeft: `${(i - 2.5) * 12}px` }}
                    animate={
                      isDrawn
                        ? { y: -48, rotate: idleAngle * 0.25, scale: 1.04 }
                        : shaking
                          ? {
                              rotate: [idleAngle - 3, idleAngle + 3, idleAngle - 2, idleAngle],
                              y: [0, -4, 0, -3, 0],
                            }
                          : {
                              rotate: [idleAngle - 1.2, idleAngle + 1.2, idleAngle - 1.2],
                              y: [0, -1.5, 0],
                            }
                    }
                    transition={
                      isDrawn
                        ? { type: 'spring', stiffness: 260, damping: 18 }
                        : shaking
                          ? { duration: 0.35, repeat: Infinity, ease: 'easeInOut' }
                          : {
                              duration: 2.4 + i * 0.15,
                              repeat: Infinity,
                              ease: 'easeInOut',
                              delay: i * 0.12,
                            }
                    }
                  >
                    <div
                      className="w-[10px] h-[88px] rounded-t-full rounded-b-sm relative shadow-sm"
                      style={{
                        background: `linear-gradient(180deg, ${color} 0%, ${color}dd 70%, #f5e6d3 100%)`,
                      }}
                    >
                      <span className="absolute top-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white/50" />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <svg
              viewBox="0 0 240 220"
              className="absolute inset-0 w-full h-full drop-shadow-[0_10px_22px_rgba(45,42,38,0.1)]"
              aria-hidden
            >
              <defs>
                <linearGradient id="bucketBody" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#F4A261" />
                  <stop offset="45%" stopColor="#E85D4C" />
                  <stop offset="100%" stopColor="#C94A3C" />
                </linearGradient>
                <linearGradient id="bucketRim" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FFE8C8" />
                  <stop offset="100%" stopColor="#E9C46A" />
                </linearGradient>
                <linearGradient id="bucketInner" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#5C3A2E" />
                  <stop offset="100%" stopColor="#3D241C" />
                </linearGradient>
              </defs>
              <ellipse cx="120" cy="78" rx="78" ry="28" fill="url(#bucketRim)" />
              <ellipse cx="120" cy="78" rx="62" ry="20" fill="url(#bucketInner)" />
              <path
                d="M42 78 C42 78 48 190 120 198 C192 190 198 78 198 78 L178 78 C178 78 174 168 120 174 C66 168 62 78 62 78 Z"
                fill="url(#bucketBody)"
              />
              <path
                d="M70 95 C72 150 95 165 110 168"
                fill="none"
                stroke="rgba(255,255,255,0.28)"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <path
                d="M52 130 C80 142 160 142 188 130"
                fill="none"
                stroke="#E9C46A"
                strokeWidth="5"
                strokeLinecap="round"
                opacity="0.85"
              />
              <path
                d="M55 148 C82 158 158 158 185 148"
                fill="none"
                stroke="#FFE8C8"
                strokeWidth="3"
                strokeLinecap="round"
                opacity="0.55"
              />
            </svg>

            <AnimatePresence>
              {stickOut && result && (
                <>
                  {[...Array(5)].map((_, i) => (
                    <motion.span
                      key={i}
                      className="absolute w-1.5 h-1.5 rounded-full z-20 pointer-events-none"
                      style={{
                        left: `${28 + i * 10}%`,
                        top: '28%',
                        background: STICK_COLORS[i % STICK_COLORS.length],
                      }}
                      initial={{ opacity: 0, y: 0, scale: 0 }}
                      animate={{
                        opacity: [0, 1, 0],
                        y: [-4, -22 - i * 3],
                        x: [(i - 2) * 8],
                        scale: [0, 1, 0.3],
                      }}
                      transition={{ duration: 0.7, ease: 'easeOut' }}
                    />
                  ))}
                </>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <button
        type="button"
        onClick={draw}
        disabled={spinning}
        className="btn-primary w-full py-3.5 text-[15px] mt-2 shrink-0 disabled:opacity-60"
      >
        {spinning ? '签筒晃起来了…' : result ? '再抽一次' : '抽一签'}
      </button>
    </section>
  );
}
