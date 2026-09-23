import { FOODS } from '../data/foods';
import { SEED_DIARY } from '../data/diary';
import { SEED_POSTS } from '../data/posts';
import { SEED_RECIPES, generateRecipeFromIngredients } from '../data/recipes';
import { CURRENT_USER } from '../data/users';
import type { DiaryEntry, Food, Post, Recipe, Comment } from '../types';
import { getMealBucket } from '../utils/meal';
import { loadJSON, saveJSON, StorageKeys } from '../utils/storage';
import { formatISO } from 'date-fns';

function delay(ms = 400) {
  return new Promise((r) => setTimeout(r, ms));
}

/* ---- Foods ---- */
export async function getFoods(mealType?: Food['mealType']): Promise<Food[]> {
  await delay(120);
  if (!mealType) return [...FOODS];
  return FOODS.filter((f) => f.mealType === mealType);
}

export async function getRandomFood(): Promise<Food> {
  const bucket = getMealBucket();
  const pool = FOODS.filter((f) => f.mealType === bucket);
  return pool[Math.floor(Math.random() * pool.length)];
}

export function getRandomHistory(): string[] {
  return loadJSON<string[]>(StorageKeys.randomHistory, []);
}

export function pushRandomHistory(name: string) {
  const hist = getRandomHistory().filter((n) => n !== name);
  hist.unshift(name);
  saveJSON(StorageKeys.randomHistory, hist.slice(0, 20));
}

/* ---- Recipes ---- */
export async function getRecipes(): Promise<Recipe[]> {
  await delay(150);
  const saved = new Set(loadJSON<string[]>(StorageKeys.savedRecipes, []));
  const custom = loadJSON<Recipe[]>('customRecipes', []);
  return [...custom, ...SEED_RECIPES].map((r) => ({
    ...r,
    saved: saved.has(r.id),
  }));
}

export async function generateRecipe(ingredients: string[]): Promise<Recipe> {
  await delay(900);
  return generateRecipeFromIngredients(ingredients);
}

export async function saveRecipe(recipe: Recipe): Promise<void> {
  const ids = loadJSON<string[]>(StorageKeys.savedRecipes, []);
  if (!ids.includes(recipe.id)) {
    ids.push(recipe.id);
    saveJSON(StorageKeys.savedRecipes, ids);
  }
  const custom = loadJSON<Recipe[]>('customRecipes', []);
  if (!SEED_RECIPES.find((r) => r.id === recipe.id) && !custom.find((r) => r.id === recipe.id)) {
    custom.unshift(recipe);
    saveJSON('customRecipes', custom);
  }
}

export async function unsaveRecipe(id: string): Promise<void> {
  const ids = loadJSON<string[]>(StorageKeys.savedRecipes, []).filter((x) => x !== id);
  saveJSON(StorageKeys.savedRecipes, ids);
}

/* ---- Diary ---- */
function mergeDiary(): DiaryEntry[] {
  const user = loadJSON<DiaryEntry[]>(StorageKeys.diaryEntries, []);
  const map = new Map<string, DiaryEntry>();
  [...SEED_DIARY, ...user].forEach((e) => map.set(e.id, e));
  return Array.from(map.values()).sort((a, b) =>
    `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`),
  );
}

export async function getDiaryEntries(): Promise<DiaryEntry[]> {
  await delay(100);
  return mergeDiary();
}

export async function getDiaryByDate(date: string): Promise<DiaryEntry[]> {
  const all = await getDiaryEntries();
  return all
    .filter((e) => e.date === date)
    .sort((a, b) => a.time.localeCompare(b.time));
}

export async function createDiaryEntry(
  entry: Omit<DiaryEntry, 'id'>,
): Promise<DiaryEntry> {
  const full: DiaryEntry = { ...entry, id: `d-user-${Date.now()}` };
  const user = loadJSON<DiaryEntry[]>(StorageKeys.diaryEntries, []);
  user.unshift(full);
  saveJSON(StorageKeys.diaryEntries, user);
  return full;
}

/* ---- Posts ---- */
function mergePosts(): Post[] {
  const userPosts = loadJSON<Post[]>(StorageKeys.userPosts, []);
  const liked = new Set(loadJSON<string[]>(StorageKeys.likedPosts, []));
  const saved = new Set(loadJSON<string[]>(StorageKeys.savedPosts, []));
  const overrides = loadJSON<Record<string, Partial<Post>>>(StorageKeys.postOverrides, {});
  const comments = loadJSON<Record<string, Comment[]>>(StorageKeys.postComments, {});

  const base = [...userPosts, ...SEED_POSTS];
  return base.map((p) => {
    const over = overrides[p.id] || {};
    const extraComments = comments[p.id] || [];
    const commentList = [...(p.commentList || []), ...extraComments];
    const wasSeedLiked = p.liked;
    let likes = over.likes ?? p.likes;
    if (liked.has(p.id) && !wasSeedLiked) likes = Math.max(likes, p.likes + 1);
    if (!liked.has(p.id) && wasSeedLiked && over.liked === false) likes = Math.max(0, p.likes - 1);

    return {
      ...p,
      ...over,
      liked: liked.has(p.id) ? true : over.liked === false ? false : p.liked,
      saved: saved.has(p.id) ? true : over.saved === false ? false : p.saved,
      likes,
      comments: commentList.length || p.comments,
      commentList,
    };
  });
}

export async function getPosts(): Promise<Post[]> {
  await delay(200);
  return mergePosts();
}

export async function getPost(id: string): Promise<Post | undefined> {
  const posts = await getPosts();
  return posts.find((p) => p.id === id);
}

export async function likePost(id: string): Promise<void> {
  const liked = loadJSON<string[]>(StorageKeys.likedPosts, []);
  const overrides = loadJSON<Record<string, Partial<Post>>>(StorageKeys.postOverrides, {});
  if (liked.includes(id)) {
    saveJSON(
      StorageKeys.likedPosts,
      liked.filter((x) => x !== id),
    );
    overrides[id] = { ...overrides[id], liked: false };
  } else {
    liked.push(id);
    saveJSON(StorageKeys.likedPosts, liked);
    overrides[id] = { ...overrides[id], liked: true };
  }
  saveJSON(StorageKeys.postOverrides, overrides);
}

export async function savePost(id: string): Promise<void> {
  const saved = loadJSON<string[]>(StorageKeys.savedPosts, []);
  const overrides = loadJSON<Record<string, Partial<Post>>>(StorageKeys.postOverrides, {});
  if (saved.includes(id)) {
    saveJSON(
      StorageKeys.savedPosts,
      saved.filter((x) => x !== id),
    );
    overrides[id] = { ...overrides[id], saved: false };
  } else {
    saved.push(id);
    saveJSON(StorageKeys.savedPosts, saved);
    overrides[id] = { ...overrides[id], saved: true };
  }
  saveJSON(StorageKeys.postOverrides, overrides);
}

export async function commentPost(id: string, content: string): Promise<Comment> {
  const comment: Comment = {
    id: `c-${Date.now()}`,
    author: CURRENT_USER,
    content,
    createdAt: formatISO(new Date()),
  };
  const all = loadJSON<Record<string, Comment[]>>(StorageKeys.postComments, {});
  all[id] = [...(all[id] || []), comment];
  saveJSON(StorageKeys.postComments, all);
  return comment;
}

export async function createPost(
  data: Omit<Post, 'id' | 'author' | 'likes' | 'comments' | 'liked' | 'saved' | 'createdAt'>,
): Promise<Post> {
  const post: Post = {
    ...data,
    id: `p-user-${Date.now()}`,
    author: CURRENT_USER,
    likes: 0,
    comments: 0,
    commentList: [],
    liked: false,
    saved: false,
    createdAt: formatISO(new Date()),
  };
  const userPosts = loadJSON<Post[]>(StorageKeys.userPosts, []);
  userPosts.unshift(post);
  saveJSON(StorageKeys.userPosts, userPosts);
  return post;
}

export function getCurrentUser() {
  return CURRENT_USER;
}

/** Mock dish recognition */
export async function mockRecognizeDish(): Promise<string> {
  await delay(800);
  const names = ['番茄炒蛋', '红烧肉', '麻辣香锅', '牛肉面', '沙拉碗', '小笼包', '石锅拌饭'];
  return names[Math.floor(Math.random() * names.length)];
}

export { MOCK_CAMERA_IMAGES } from '../data/mockImages';
