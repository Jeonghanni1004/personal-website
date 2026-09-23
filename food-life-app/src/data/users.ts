import type { User } from '../types';

const av = (seed: string) =>
  `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(seed)}&backgroundColor=f4a261,e9c46a,2a9d8f,e85d4c`;

export const CURRENT_USER: User & {
  bio: string;
  mealCount: number;
  recipeCount: number;
  postCount: number;
} = {
  id: 'u-me',
  name: '小满',
  avatar: av('xiaoman'),
  bio: '今天也要好好吃饭',
  mealCount: 47,
  recipeCount: 8,
  postCount: 6,
};

export const USERS: User[] = [
  CURRENT_USER,
  { id: 'u1', name: '阿枣', avatar: av('zao'), bio: '周末只想吃火锅' },
  { id: 'u2', name: '糯米', avatar: av('nuomi'), bio: '甜食治愈一切' },
  { id: 'u3', name: '老陈', avatar: av('chen'), bio: '家常菜爱好者' },
  { id: 'u4', name: '米米', avatar: av('mimi'), bio: '今天吃什么呢' },
  { id: 'u5', name: '北北', avatar: av('beibei'), bio: '探店日记' },
  { id: 'u6', name: '橙子', avatar: av('chengzi'), bio: '午餐决定一天心情' },
  { id: 'u7', name: '阿鱼', avatar: av('ayu'), bio: '深夜食堂常客' },
];
