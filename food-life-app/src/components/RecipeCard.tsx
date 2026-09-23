import { Bookmark, Clock } from 'lucide-react';
import type { Recipe } from '../types';
import { cn } from '../utils/meal';

const difficultyLabel = { easy: '简单', medium: '中等', hard: '稍难' };

interface Props {
  recipe: Recipe;
  onSave?: () => void;
}

export default function RecipeCard({ recipe, onSave }: Props) {
  return (
    <div className="card p-5 mt-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-display text-2xl font-semibold">{recipe.title}</h3>
        {onSave && (
          <button
            type="button"
            onClick={onSave}
            className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
              recipe.saved ? 'bg-sun/30 text-orange' : 'bg-cream-dark text-ink-muted',
            )}
            aria-label={recipe.saved ? '取消收藏' : '收藏'}
          >
            <Bookmark size={18} className={recipe.saved ? 'fill-current' : ''} />
          </button>
        )}
      </div>
      <div className="flex items-center gap-3 text-sm text-ink-muted mb-4">
        <span className="flex items-center gap-1">
          <Clock size={14} /> {recipe.duration} 分钟
        </span>
        <span>·</span>
        <span>{difficultyLabel[recipe.difficulty]}</span>
      </div>

      <Section title="食材">
        <div className="flex flex-wrap gap-2">
          {recipe.ingredients.map((i) => (
            <span key={i} className="px-3 py-1 rounded-full bg-cream-dark text-sm">
              {i}
            </span>
          ))}
        </div>
      </Section>

      <Section title="调味料">
        <div className="flex flex-wrap gap-2">
          {recipe.seasonings.map((i) => (
            <span key={i} className="px-3 py-1 rounded-full bg-orange/15 text-sm text-orange">
              {i}
            </span>
          ))}
        </div>
      </Section>

      <Section title="步骤">
        <ol className="space-y-3">
          {recipe.steps.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm leading-relaxed">
              <span className="w-6 h-6 rounded-full bg-tomato text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <h4 className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-2">
        {title}
      </h4>
      {children}
    </div>
  );
}
