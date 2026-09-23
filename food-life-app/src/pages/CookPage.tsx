import { useEffect, useState } from 'react';
import { Mic, Plus, X, Loader2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import PageTransition from '../components/PageTransition';
import RecipeCard from '../components/RecipeCard';
import { INGREDIENT_CHIPS } from '../data/recipes';
import { generateRecipe, saveRecipe, unsaveRecipe, getRecipes } from '../api';
import type { Recipe } from '../types';
import { cn } from '../utils/meal';

export default function CookPage() {
  const [tab, setTab] = useState<'generate' | 'mine'>('generate');
  const [ingredients, setIngredients] = useState<string[]>(['鸡蛋', '番茄']);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [voiceHint, setVoiceHint] = useState(false);
  const [myRecipes, setMyRecipes] = useState<Recipe[]>([]);

  const refreshMine = () => getRecipes().then((r) => setMyRecipes(r.filter((x) => x.saved)));

  useEffect(() => {
    if (tab === 'mine') refreshMine();
  }, [tab]);

  const addIngredient = (name: string) => {
    const n = name.trim();
    if (!n || ingredients.includes(n)) return;
    setIngredients((prev) => [...prev, n]);
    setInput('');
  };

  const remove = (name: string) => {
    setIngredients((prev) => prev.filter((i) => i !== name));
  };

  const onGenerate = async () => {
    if (ingredients.length === 0) return;
    setLoading(true);
    setRecipe(null);
    try {
      const r = await generateRecipe(ingredients);
      setRecipe(r);
    } finally {
      setLoading(false);
    }
  };

  const onVoice = () => {
    setVoiceHint(true);
    setTimeout(() => {
      addIngredient('土豆');
      setVoiceHint(false);
    }, 1000);
  };

  const onToggleSave = async () => {
    if (!recipe) return;
    if (recipe.saved) {
      await unsaveRecipe(recipe.id);
      setRecipe({ ...recipe, saved: false });
      refreshMine();
    } else {
      await saveRecipe(recipe);
      setRecipe({ ...recipe, saved: true });
      refreshMine();
    }
  };

  return (
    <PageTransition>
      <div className="page">
        <PageHeader title="自己做点" />

        <div className="flex gap-2 mb-6 p-1 bg-cream-dark rounded-full">
          {(
            [
              ['generate', '生成菜谱'],
              ['mine', '我的菜谱'],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={cn(
                'flex-1 py-2.5 rounded-full text-sm font-semibold transition-colors',
                tab === key ? 'bg-white text-ink shadow-sm' : 'text-ink-muted',
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'generate' ? (
          <>
            <h2 className="font-display text-2xl font-semibold mb-4">家里有什么？</h2>

            <div className="flex flex-wrap gap-2 mb-4">
              {INGREDIENT_CHIPS.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => addIngredient(chip)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-sm border transition-colors',
                    ingredients.includes(chip)
                      ? 'bg-leaf/15 border-leaf text-leaf'
                      : 'bg-card border-border text-ink-muted',
                  )}
                >
                  {chip}
                </button>
              ))}
            </div>

            <div className="flex gap-2 mb-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addIngredient(input)}
                placeholder="手动输入食材"
                className="flex-1 px-4 py-3 rounded-2xl border border-border bg-card outline-none focus:border-tomato"
              />
              <button
                type="button"
                onClick={() => addIngredient(input)}
                className="w-12 h-12 rounded-2xl bg-cream-dark flex items-center justify-center"
                aria-label="添加"
              >
                <Plus size={20} />
              </button>
              <button
                type="button"
                onClick={onVoice}
                className="w-12 h-12 rounded-2xl bg-orange/15 text-orange flex items-center justify-center"
                aria-label="语音输入"
              >
                <Mic size={20} />
              </button>
            </div>
            {voiceHint && (
              <p className="text-xs text-orange mb-3">听懂了：土豆（Mock 语音）</p>
            )}

            <div className="flex flex-wrap gap-2 mb-6 min-h-[40px]">
              {ingredients.map((i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-tomato/10 text-tomato text-sm font-medium"
                >
                  {i}
                  <button type="button" onClick={() => remove(i)} aria-label={`删除${i}`}>
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>

            <button
              type="button"
              onClick={onGenerate}
              disabled={loading || ingredients.length === 0}
              className="btn-primary w-full py-4 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {loading ? '正在想想怎么做…' : '生成菜谱'}
            </button>

            {recipe && <RecipeCard recipe={recipe} onSave={onToggleSave} />}
          </>
        ) : (
          <div>
            {myRecipes.length === 0 ? (
              <div className="py-16 text-center text-ink-muted">
                <p className="font-display text-lg mb-1">还没有收藏的菜谱</p>
                <p className="text-sm">生成一个喜欢的，点一下收藏吧。</p>
              </div>
            ) : (
              myRecipes.map((r) => (
                <RecipeCard
                  key={r.id}
                  recipe={r}
                  onSave={async () => {
                    await unsaveRecipe(r.id);
                    refreshMine();
                    if (recipe?.id === r.id) setRecipe({ ...recipe, saved: false });
                  }}
                />
              ))
            )}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
