import { useMemo } from 'react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday,
} from 'date-fns';
import { zhCN } from 'date-fns/locale';
import type { DiaryEntry } from '../types';
import SafeImage from './SafeImage';
import { cn } from '../utils/meal';

interface Props {
  month: Date;
  entries: DiaryEntry[];
  onSelectDate: (date: string) => void;
}

export default function DiaryCalendar({ month, entries, onSelectDate }: Props) {
  const byDate = useMemo(() => {
    const map = new Map<string, DiaryEntry[]>();
    entries.forEach((e) => {
      const list = map.get(e.date) || [];
      list.push(e);
      map.set(e.date, list);
    });
    return map;
  }, [entries]);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [month]);

  const weekLabels = ['一', '二', '三', '四', '五', '六', '日'];

  return (
    <div>
      <div className="grid grid-cols-7 mb-2">
        {weekLabels.map((w) => (
          <div key={w} className="text-center text-xs text-ink-muted py-2 font-medium">
            {w}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-1">
        {days.map((day) => {
          const key = format(day, 'yyyy-MM-dd');
          const dayEntries = byDate.get(key);
          const thumb = dayEntries?.[0]?.image;
          const inMonth = isSameMonth(day, month);

          return (
            <button
              key={key}
              type="button"
              disabled={!dayEntries?.length}
              onClick={() => dayEntries?.length && onSelectDate(key)}
              className={cn(
                'aspect-square flex flex-col items-center justify-start pt-1 rounded-xl relative overflow-hidden',
                !inMonth && 'opacity-30',
                !!dayEntries?.length && 'cursor-pointer',
              )}
            >
              {thumb && (
                <SafeImage
                  src={thumb}
                  className="absolute inset-1 rounded-xl opacity-90"
                  alt=""
                />
              )}
              <span
                className={cn(
                  'relative z-10 text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full',
                  thumb && 'bg-white/85 text-ink shadow-sm',
                  !thumb && 'text-ink-muted',
                  isToday(day) && !thumb && 'bg-tomato text-white',
                  isToday(day) && thumb && 'ring-2 ring-tomato',
                )}
              >
                {format(day, 'd')}
              </span>
            </button>
          );
        })}
      </div>
      <p className="sr-only">{format(month, 'yyyy年M月', { locale: zhCN })}</p>
    </div>
  );
}

export function DiaryWeekView({
  entries,
  weekStart,
  onSelectDate,
}: {
  entries: DiaryEntry[];
  weekStart: Date;
  onSelectDate: (date: string) => void;
}) {
  const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  return (
    <div className="space-y-5">
      {days.map((day) => {
        const key = format(day, 'yyyy-MM-dd');
        const dayEntries = entries
          .filter((e) => e.date === key)
          .sort((a, b) => a.time.localeCompare(b.time));

        return (
          <div key={key}>
            <div className="flex items-baseline gap-2 mb-2">
              <h3 className="font-display font-semibold text-lg">
                {format(day, 'M月d日', { locale: zhCN })}
              </h3>
              <span className="text-ink-muted text-sm">
                {format(day, 'EEEE', { locale: zhCN })}
                {isToday(day) ? ' · 今天' : ''}
              </span>
            </div>
            {dayEntries.length === 0 ? (
              <p className="text-ink-muted text-sm pl-1">这一天还没记录</p>
            ) : (
              <button
                type="button"
                onClick={() => onSelectDate(key)}
                className="w-full text-left space-y-3"
              >
                {dayEntries.map((e) => (
                  <div key={e.id} className="flex gap-3 items-center">
                    <span className="text-ink-muted text-sm w-12 shrink-0 tabular-nums">
                      {e.time}
                    </span>
                    <SafeImage
                      src={e.image}
                      className="w-14 h-14 rounded-2xl shrink-0"
                      alt={e.foodName}
                    />
                    <div className="min-w-0">
                      <p className="text-xs text-ink-muted">{e.mealType}</p>
                      <p className="font-semibold truncate">{e.foodName}</p>
                    </div>
                  </div>
                ))}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
