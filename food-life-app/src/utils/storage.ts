const PREFIX = 'foodlife:';

export function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveJSON<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // ignore quota errors in demo
  }
}

export const StorageKeys = {
  randomHistory: 'randomHistory',
  savedRecipes: 'savedRecipes',
  likedPosts: 'likedPosts',
  savedPosts: 'savedPosts',
  diaryEntries: 'diaryEntries',
  userPosts: 'userPosts',
  postComments: 'postComments',
  postOverrides: 'postOverrides',
} as const;
