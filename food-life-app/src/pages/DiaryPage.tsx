import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Grid3X3, CalendarDays } from 'lucide-react';
import {
  addMonths,
  subMonths,
  addYears,
  subYears,
  addDays,
  subDays,
  format,
  parseISO,
} from 'date-fns';
import { zhCN } from 'date-fns/locale';
import PageTransition from '../components/PageTransition';
import DiaryCalendar, {
  DiaryYearView,
  DiaryDayView,
} from '../components/DiaryCalendar';
import { getDiaryEntries } from '../api';
import type { DiaryEntry } from '../types';
import { cn } from '../utils/meal';

type ViewMode = 'year' | 'month' | 'day';

export default function DiaryPage() {
  const navigate = useNavigate();
  const dateInputRef = useRef<HTMLInputElement>(null);
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [cursor, setCursor] = useState(new Date());
  const [view, setView] = useState<ViewMode>('month');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDiaryEntries().then((e) => {
      setEntries(e);
      setLoading(false);
    });
  }, []);

  const goPrev = () => {
    if (view === 'year') setCursor((d) => subYears(d, 1));
    else if (view === 'month') setCursor((d) => subMonths(d, 1));
    else setCursor((d) => subDays(d, 1));
  };

  const goNext = () => {
    if (view === 'year') setCursor((d) => addYears(d, 1));
    else if (view === 'month') setCursor((d) => addMonths(d, 1));
    else setCursor((d) => addDays(d, 1));
  };

  const title =
    view === 'year'
      ? format(cursor, 'yyyy年', { locale: zhCN })
      : view === 'month'
        ? format(cursor, 'yyyy年M月', { locale: zhCN })
        : format(cursor, 'yyyy年M月d日', { locale: zhCN });

  const onPickDate = (value: string) => {
    if (!value) return;
    const d = parseISO(value);
    setCursor(d);
    setView('day');
  };

  return (
    <PageTransition>
      <div className="page">
        <header className="flex items-center justify-between mb-4 pt-2">
          <div>
            <h1 className="font-display text-3xl font-bold">美食日记</h1>
            <p className="text-ink-muted text-sm mt-0.5">我的吃饭日历</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => dateInputRef.current?.showPicker?.() ?? dateInputRef.current?.click()}
              className="w-10 h-10 rounded-full bg-cream-dark flex items-center justify-center text-ink"
              aria-label="选择日期"
            >
              <CalendarDays size={18} />
            </button>
            <input
              ref={dateInputRef}
              type="date"
              className="sr-only"
              value={format(cursor, 'yyyy-MM-dd')}
              onChange={(e) => onPickDate(e.target.value)}
            />
            <Link
              to="/diary/photos"
              className="flex items-center gap-1 text-sm font-medium text-tomato px-3 py-2 rounded-full bg-tomato/10"
            >
              <Grid3X3 size={16} /> 仅图片
            </Link>
          </div>
        </header>

        <div className="flex gap-2 mb-4 p-1 bg-cream-dark rounded-full w-fit">
          {(
            [
              ['year', '年'],
              ['month', '月'],
              ['day', '日'],
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
            onClick={goPrev}
            aria-label="上一段"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => dateInputRef.current?.showPicker?.() ?? dateInputRef.current?.click()}
            className="font-display text-lg font-semibold"
          >
            {title}
          </button>
          <button
            type="button"
            className="w-9 h-9 rounded-full bg-cream-dark flex items-center justify-center"
            onClick={goNext}
            aria-label="下一段"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {loading ? (
          <p className="text-center text-ink-muted py-16">翻开日记本…</p>
        ) : view === 'year' ? (
          <DiaryYearView
            year={cursor}
            entries={entries}
            onSelectMonth={(m) => {
              setCursor(m);
              setView('month');
            }}
          />
        ) : view === 'month' ? (
          <div className="card p-3">
            <DiaryCalendar
              month={cursor}
              entries={entries}
              onSelectDate={(date) => {
                setCursor(parseISO(date));
                setView('day');
                navigate(`/diary/${date}`);
              }}
            />
          </div>
        ) : (
          <DiaryDayView
            day={cursor}
            entries={entries}
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
