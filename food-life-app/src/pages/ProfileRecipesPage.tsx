import { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import PageTransition from '../components/PageTransition';
import RecipeCard from '../components/RecipeCard';
import { getRecipes, unsaveRecipe } from '../api';
import type { Recipe } from '../types';

export default function ProfileRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const refresh = () => getRecipes().then((r) => setRecipes(r.filter((x) => x.saved)));

  useEffect(() => {
    refresh();
  }, []);

  return (
    <PageTransition>
      <div className="page">
        <PageHeader title="我的菜谱" />
        {recipes.length === 0 ? (
          <p className="text-center text-ink-muted py-16 text-sm">
            还没有收藏的菜谱，去做点好吃的吧。
          </p>
        ) : (
          recipes.map((r) => (
            <RecipeCard
              key={r.id}
              recipe={r}
              onSave={async () => {
                await unsaveRecipe(r.id);
                refresh();
              }}
            />
          ))
        )}
      </div>
    </PageTransition>
  );
}
