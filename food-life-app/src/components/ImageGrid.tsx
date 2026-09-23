import { Check } from 'lucide-react';
import type { DiaryEntry } from '../types';
import SafeImage from './SafeImage';
import { cn } from '../utils/meal';

interface Props {
  entries: DiaryEntry[];
  selected: Set<string>;
  onToggle: (id: string) => void;
  selecting?: boolean;
}

export default function ImageGrid({ entries, selected, onToggle, selecting = true }: Props) {
  if (entries.length === 0) {
    return (
      <div className="py-20 text-center text-ink-muted">
        <p className="font-display text-lg mb-1">还没有照片</p>
        <p className="text-sm">今天也要好好吃饭，去记录一顿吧。</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-1">
      {entries.map((e) => {
        const isSelected = selected.has(e.id);
        return (
          <button
            key={e.id}
            type="button"
            onClick={() => selecting && onToggle(e.id)}
            className="relative aspect-square overflow-hidden"
          >
            <SafeImage src={e.image} alt={e.foodName} className="w-full h-full" />
            {selecting && (
              <span
                className={cn(
                  'absolute top-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center',
                  isSelected
                    ? 'bg-tomato border-tomato text-white'
                    : 'border-white bg-black/20',
                )}
              >
                {isSelected && <Check size={14} strokeWidth={3} />}
              </span>
            )}
            {isSelected && <div className="absolute inset-0 bg-tomato/20" />}
          </button>
        );
      })}
    </div>
  );
}
