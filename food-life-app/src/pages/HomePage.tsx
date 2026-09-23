import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ChefHat, Camera, ChevronRight } from 'lucide-react';
import { format, subYears } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import PageTransition from '../components/PageTransition';
import SafeImage from '../components/SafeImage';
import RandomLottery from '../components/RandomLottery';
import { getDiaryEntries } from '../api';
import type { DiaryEntry } from '../types';

const modules = [
  {
    to: '/cook',
    title: '自己做点',
    icon: ChefHat,
    gradient: 'from-[#2A9D8F] to-[#E9C46A]',
    emoji: '🍳',
  },
  {
    to: '/phone-eat',
    title: '手机先吃',
    icon: Camera,
    gradient: 'from-[#E85D4C] to-[#F2A7A0]',
    emoji: '📱',
  },
];

export default function HomePage() {
  const [recent, setRecent] = useState<DiaryEntry[]>([]);
  const [lastYear, setLastYear] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    getDiaryEntries().then((entries) => {
      setRecent(entries.slice(0, 6));
      const key = format(subYears(new Date(), 1), 'yyyy-MM-dd');
      setLastYear(entries.filter((e) => e.date === key).slice(0, 3));
    });
  }, []);

  const hour = new Date().getHours();
  const greeting =
    hour < 11 ? '早上好' : hour < 14 ? '中午好' : hour < 18 ? '下午好' : '晚上好';

  return (
    <PageTransition>
      <div className="page !pt-[calc(12px+env(safe-area-inset-top))]">
        <header className="mb-3 pt-1">
          <p className="text-ink-muted text-sm mb-0.5">{greeting}，今天也要好好吃饭</p>
          <h1 className="font-display text-2xl font-bold tracking-tight">吃什么？</h1>
        </header>

        {/* ~半屏抽签桶 */}
        <div className="lottery-hero-wrap card mb-5 px-4 pt-3 pb-4">
          <RandomLottery />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-8">
          {modules.map((m) => (
            <Link
              key={m.to}
              to={m.to}
              className={`relative block overflow-hidden rounded-[24px] bg-gradient-to-br ${m.gradient} text-white p-4 min-h-[100px] shadow-card`}
            >
              <div className="relative z-10">
                <m.icon size={20} className="mb-2 opacity-90" strokeWidth={2} />
                <h2 className="font-display text-lg font-semibold leading-tight">{m.title}</h2>
              </div>
              <span className="absolute right-2 bottom-2 text-3xl opacity-90">{m.emoji}</span>
              <div className="absolute -right-4 -bottom-6 w-20 h-20 rounded-full bg-white/10" />
            </Link>
          ))}
        </div>

        {recent.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-lg font-semibold">最近吃过</h3>
              <Link to="/diary" className="text-ink-muted text-sm flex items-center gap-0.5">
                全部 <ChevronRight size={14} />
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto -mx-5 px-5 pb-1">
              {recent.map((e) => (
                <Link key={e.id} to={`/diary/${e.date}`} className="shrink-0 w-[100px]">
                  <SafeImage
                    src={e.image}
                    alt={e.foodName}
                    className="w-[100px] h-[100px] rounded-2xl mb-1.5"
                  />
                  <p className="text-xs font-medium truncate">{e.foodName}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {lastYear.length > 0 && (
          <section>
            <h3 className="font-display text-lg font-semibold mb-1">去年今日</h3>
            <p className="text-ink-muted text-xs mb-3">
              {format(subYears(new Date(), 1), 'yyyy年M月d日', { locale: zhCN })}
            </p>
            <div className="card p-3 space-y-3">
              {lastYear.map((e) => (
                <Link key={e.id} to={`/diary/${e.date}`} className="flex items-center gap-3">
                  <SafeImage
                    src={e.image}
                    className="w-14 h-14 rounded-2xl"
                    alt={e.foodName}
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">{e.foodName}</p>
                    <p className="text-xs text-ink-muted">
                      {e.time} · {e.mealType}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </PageTransition>
  );
}
