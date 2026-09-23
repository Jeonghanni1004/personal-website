export type MealType = 'breakfast' | 'main_meal' | 'late_night' | 'lunch' | 'dinner' | 'snack';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type Mood = 'amazing' | 'good' | 'okay' | 'meh';

export interface Food {
  id: string;
  name: string;
  category: string;
  mealType: 'breakfast' | 'main_meal' | 'late_night';
  image?: string;
}

export interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  seasonings: string[];
  duration: number;
  difficulty: Difficulty;
  steps: string[];
  image?: string;
  saved?: boolean;
}

export interface DiaryEntry {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  mealType: string;
  foodName: string;
  image: string;
  note?: string;
  mood?: Mood;
  location?: string;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  bio?: string;
}

export interface Comment {
  id: string;
  author: User;
  content: string;
  createdAt: string;
}

export interface Post {
  id: string;
  author: User;
  images: string[];
  content: string;
  foodName?: string;
  location?: string;
  likes: number;
  comments: number;
  commentList?: Comment[];
  createdAt: string;
  liked: boolean;
  saved: boolean;
}

export interface AppUser extends User {
  mealCount: number;
  recipeCount: number;
  postCount: number;
}

export const MOOD_OPTIONS: { value: Mood; emoji: string; label: string }[] = [
  { value: 'amazing', emoji: '😍', label: '太好吃了' },
  { value: 'good', emoji: '🙂', label: '挺不错' },
  { value: 'okay', emoji: '😐', label: '还行' },
  { value: 'meh', emoji: '🥲', label: '随便吃的' },
];
