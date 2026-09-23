import type { Recipe } from '../types';

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=80`;

export const INGREDIENT_CHIPS = [
  '鸡蛋', '番茄', '土豆', '洋葱', '大蒜', '生姜',
  '猪肉', '鸡肉', '豆腐', '青菜', '米饭', '面条',
  '胡萝卜', '青椒', '白菜', '虾', '牛肉', '香菇',
];

export const SEED_RECIPES: Recipe[] = [
  {
    id: 'r1',
    title: '番茄炒蛋',
    ingredients: ['鸡蛋', '番茄', '葱'],
    seasonings: ['盐', '糖', '生抽'],
    duration: 15,
    difficulty: 'easy',
    steps: [
      '鸡蛋打散，加少许盐搅匀。',
      '番茄切块，葱切段。',
      '热锅凉油，倒入蛋液炒至半熟盛出。',
      '再下番茄煸出汁水，加糖提味。',
      '倒回鸡蛋，翻炒均匀，撒葱花出锅。',
    ],
    image: img('photo-1603133879110-a1d2e0f1c0a1'),
  },
  {
    id: 'r2',
    title: '土豆炖牛肉',
    ingredients: ['牛肉', '土豆', '洋葱', '胡萝卜'],
    seasonings: ['生抽', '老抽', '料酒', '八角', '盐'],
    duration: 60,
    difficulty: 'medium',
    steps: [
      '牛肉切块焯水，沥干备用。',
      '土豆、胡萝卜切滚刀块，洋葱切丝。',
      '热锅煸香洋葱，下牛肉翻炒。',
      '加调味料和热水，小火炖 40 分钟。',
      '下土豆胡萝卜再炖 15 分钟至软烂。',
    ],
    image: img('photo-1546069901-ba9599a7e63c'),
  },
  {
    id: 'r3',
    title: '蒜蓉西兰花',
    ingredients: ['西兰花', '大蒜'],
    seasonings: ['盐', '蚝油', '香油'],
    duration: 10,
    difficulty: 'easy',
    steps: [
      '西兰花掰小朵，焯水一分钟捞出。',
      '蒜切末，热油爆香。',
      '下西兰花翻炒，加盐和蚝油。',
      '淋少许香油即可。',
    ],
    image: img('photo-1512621776951-a57141f2eefd'),
  },
];

/** Mock recipe generator from ingredients */
export function generateRecipeFromIngredients(ingredients: string[]): Recipe {
  const templates: Record<string, Partial<Recipe>> = {
    '番茄+鸡蛋': {
      title: '番茄炒蛋',
      seasonings: ['盐', '糖', '生抽'],
      duration: 15,
      difficulty: 'easy',
      steps: [
        '鸡蛋打散加盐。',
        '番茄切块。',
        '先炒蛋盛出，再炒番茄出汁。',
        '合炒均匀，出锅。',
      ],
    },
    '土豆+猪肉': {
      title: '土豆烧肉',
      seasonings: ['生抽', '老抽', '料酒', '盐'],
      duration: 40,
      difficulty: 'medium',
      steps: [
        '猪肉切块焯水。',
        '土豆切块。',
        '煸香肉块，加调料和水。',
        '下土豆炖至软烂入味。',
      ],
    },
    '豆腐+青菜': {
      title: '青菜豆腐汤',
      seasonings: ['盐', '胡椒', '香油'],
      duration: 12,
      difficulty: 'easy',
      steps: [
        '豆腐切块，青菜洗净切段。',
        '水开下豆腐煮两分钟。',
        '下青菜，加盐和胡椒。',
        '淋香油即可。',
      ],
    },
  };

  for (const [combo, recipe] of Object.entries(templates)) {
    const parts = combo.split('+');
    if (parts.every((p) => ingredients.includes(p))) {
      return {
        id: `gen-${Date.now()}`,
        title: recipe.title!,
        ingredients: [...ingredients],
        seasonings: recipe.seasonings!,
        duration: recipe.duration!,
        difficulty: recipe.difficulty!,
        steps: recipe.steps!,
        image: img('photo-1546069901-ba9599a7e63c'),
      };
    }
  }

  const main = ingredients[0] || '食材';
  const second = ingredients[1];
  const title = second ? `${main}${second}小炒` : `清炒${main}`;
  const difficulty = ingredients.length <= 2 ? 'easy' : ingredients.length <= 4 ? 'medium' : 'hard';

  return {
    id: `gen-${Date.now()}`,
    title,
    ingredients: [...ingredients],
    seasonings: ['盐', '生抽', '料酒', '蒜'],
    duration: 10 + ingredients.length * 5,
    difficulty,
    steps: [
      `准备好${ingredients.join('、')}，洗净切好。`,
      '热锅少油，爆香蒜末。',
      `下入${main}翻炒至变色。`,
      ingredients.length > 1
        ? `依次加入${ingredients.slice(1).join('、')}，继续翻炒。`
        : '继续翻炒至熟。',
      '加生抽和盐调味，炒匀出锅。',
      '装盘，今天也要好好吃饭。',
    ],
    image: img('photo-1512058564366-18510be2db19'),
  };
}
