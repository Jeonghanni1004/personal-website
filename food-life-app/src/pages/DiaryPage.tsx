import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Grid3X3 } from 'lucide-react';
import {
  addMonths,
  subMonths,
  format,
  startOfWeek,
  addWeeks,
  subWeeks,
} from 'date-fns';
import { zhCN } from 'date-fns/locale';
import PageTransition from '../components/PageTransition';
import DiaryCalendar, { DiaryWeekView } from '../components/DiaryCalendar';
import { getDiaryEntries } from '../api';
import type { DiaryEntry } from '../types';
import { cn } from '../utils/meal';

type ViewMode = 'month' | 'week';

export default function DiaryPage() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [month, setMonth] = useState(new Date());
  const [weekStart, setWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  );
  const [view, setView] = useState<ViewMode>('month');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDiaryEntries().then((e) => {
      setEntries(e);
      setLoading(false);
    });
  }, []);

  return (
    <PageTransition>
      <div className="page">
        <header className="flex items-center justify-between mb-4 pt-2">
          <div>
            <h1 className="font-display text-3xl font-bold">美食日记</h1>
            <p className="text-ink-muted text-sm mt-0.5">我的吃饭日历</p>
          </div>
          <Link
            to="/diary/photos"
            className="flex items-center gap-1 text-sm font-medium text-tomato px-3 py-2 rounded-full bg-tomato/10"
          >
            <Grid3X3 size={16} /> 仅图片
          </Link>
        </header>

        <div className="flex gap-2 mb-4 p-1 bg-cream-dark rounded-full w-fit">
          {(
            [
              ['month', '月'],
              ['week', '周'],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setView(key)}
              className={cn(
                'px-5 py-2 rounded-full text-sm font-semibold',
                view === key ? 'bg-white shadow-sm' : 'text-ink-muted',
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            className="w-9 h-9 rounded-full bg-cream-dark flex items-center justify-center"
            onClick={() =>
              view === 'month'
                ? setMonth((m) => subMonths(m, 1))
                : setWeekStart((w) => subWeeks(w, 1))
            }
          >
            <ChevronLeft size={18} />
          </button>
          <h2 className="font-display text-lg font-semibold">
            {view === 'month'
              ? format(month, 'yyyy年M月', { locale: zhCN })
              : `${format(weekStart, 'M月d日', { locale: zhCN })} 这周`}
          </h2>
          <button
            type="button"
            className="w-9 h-9 rounded-full bg-cream-dark flex items-center justify-center"
            onClick={() =>
              view === 'month'
                ? setMonth((m) => addMonths(m, 1))
                : setWeekStart((w) => addWeeks(w, 1))
            }
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {loading ? (
          <p className="text-center text-ink-muted py-16">翻开日记本…</p>
        ) : view === 'month' ? (
          <div className="card p-3">
            <DiaryCalendar
              month={month}
              entries={entries}
              onSelectDate={(date) => navigate(`/diary/${date}`)}
            />
          </div>
        ) : (
          <DiaryWeekView
            entries={entries}
            weekStart={weekStart}
            onSelectDate={(date) => navigate(`/diary/${date}`)}
          />
        )}

        {!loading && entries.length === 0 && (
          <p className="text-center text-ink-muted mt-10 text-sm">
            今天还没吃东西？去记录一顿吧。
          </p>
        )}
      </div>
    </PageTransition>
  );
}
