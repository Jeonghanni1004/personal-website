import { formatDistanceToNowStrict, format, isToday, isYesterday, differenceInCalendarDays } from 'date-fns';
import { zhCN } from 'date-fns/locale';

/** 相对时间，去掉「大约」前缀 */
export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const raw = formatDistanceToNowStrict(d, { addSuffix: true, locale: zhCN });
  return raw.replace(/^大约/, '');
}

export function formatFeedTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isToday(d)) return formatRelativeTime(d);
  if (isYesterday(d)) return `昨天 ${format(d, 'HH:mm')}`;
  if (differenceInCalendarDays(new Date(), d) < 7) {
    return formatRelativeTime(d);
  }
  return format(d, 'M月d日 HH:mm', { locale: zhCN });
}
