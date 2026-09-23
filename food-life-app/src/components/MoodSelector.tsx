import type { Mood } from '../types';
import { MOOD_OPTIONS } from '../types';
import { cn } from '../utils/meal';

interface Props {
  value?: Mood;
  onChange: (mood: Mood) => void;
}

export default function MoodSelector({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {MOOD_OPTIONS.map((m) => (
        <button
          key={m.value}
          type="button"
          onClick={() => onChange(m.value)}
          className={cn(
            'flex flex-col items-center gap-1 py-3 rounded-2xl border transition-all',
            value === m.value
              ? 'bg-tomato/10 border-tomato text-tomato'
              : 'bg-card border-border text-ink-muted',
          )}
        >
          <span className="text-2xl">{m.emoji}</span>
          <span className="text-[11px] font-medium">{m.label}</span>
        </button>
      ))}
    </div>
  );
}
