import type { Food } from '../types';

/** Unsplash food photos — warm editorial look */
const img = (id: string, w = 600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const FOODS: Food[] = [
  // breakfast ≥ 10
  { id: 'f1', name: '小笼包', category: '面点', mealType: 'breakfast', image: img('photo-1496116218417-1a781b1c416c') },
  { id: 'f2', name: '豆浆油条', category: '中式早餐', mealType: 'breakfast', image: img('photo-1585032226651-759b368d7246') },
  { id: 'f3', name: '皮蛋瘦肉粥', category: '粥', mealType: 'breakfast', image: img('photo-1547592166-23ac45744acd') },
  { id: 'f4', name: '煎蛋吐司', category: '西式', mealType: 'breakfast', image: img('photo-1525351484163-7529414344d8') },
  { id: 'f5', name: '燕麦牛奶', category: '轻食', mealType: 'breakfast', image: img('photo-1517677208171-4bd2727453af') },
  { id: 'f6', name: '蛋饼', category: '面点', mealType: 'breakfast', image: img('photo-1482049016688-2d3e1b311543') },
  { id: 'f7', name: '烧麦', category: '面点', mealType: 'breakfast', image: img('photo-1534422298391-e4f8c172dddb') },
  { id: 'f8', name: '三明治', category: '西式', mealType: 'breakfast', image: img('photo-1528735602780-2552fd46c7af') },
  { id: 'f9', name: '煎饼果子', category: '街头', mealType: 'breakfast', image: img('photo-1565299624946-b28f40a0ae38') },
  { id: 'f10', name: '酸奶水果碗', category: '轻食', mealType: 'breakfast', image: img('photo-1488477181946-6428a0291777') },
  { id: 'f11', name: '包子豆浆', category: '中式早餐', mealType: 'breakfast', image: img('photo-1569718212165-3a8278d5f624') },

  // main_meal ≥ 15
  { id: 'f12', name: '番茄牛腩饭', category: '盖饭', mealType: 'main_meal', image: img('photo-1546069901-ba9599a7e63c') },
  { id: 'f13', name: '石锅拌饭', category: '韩式', mealType: 'main_meal', image: img('photo-1498654896293-37aacf113fd9') },
  { id: 'f14', name: '番茄炒蛋', category: '家常', mealType: 'main_meal', image: img('photo-1603133879110-a1d2e0f1c0a1') },
  { id: 'f15', name: '红烧肉', category: '家常', mealType: 'main_meal', image: img('photo-1529042410759-befb1204b468') },
  { id: 'f16', name: '麻辣香锅', category: '川味', mealType: 'main_meal', image: img('photo-1569718212165-3a8278d5f624') },
  { id: 'f17', name: '黄焖鸡米饭', category: '盖饭', mealType: 'main_meal', image: img('photo-1604908176997-125f25cc6f3d') },
  { id: 'f18', name: '鱼香肉丝', category: '川菜', mealType: 'main_meal', image: img('photo-1512058564366-18510be2db19') },
  { id: 'f19', name: '酸菜鱼', category: '川菜', mealType: 'main_meal', image: img('photo-1559339352-11d035aa65de') },
  { id: 'f20', name: '日式拉面', category: '面食', mealType: 'main_meal', image: img('photo-1569718212165-3a8278d5f624') },
  { id: 'f21', name: '牛肉面', category: '面食', mealType: 'main_meal', image: img('photo-1585032226651-759b368d7246') },
  { id: 'f22', name: '宫保鸡丁', category: '川菜', mealType: 'main_meal', image: img('photo-1604908176997-125f25cc6f3d') },
  { id: 'f23', name: '沙拉碗', category: '轻食', mealType: 'main_meal', image: img('photo-1512621776951-a57141f2eefd') },
  { id: 'f24', name: '披萨', category: '西餐', mealType: 'main_meal', image: img('photo-1565299624946-b28f40a0ae38') },
  { id: 'f25', name: '寿司拼盘', category: '日料', mealType: 'main_meal', image: img('photo-1579584425555-c3ce17fd4351') },
  { id: 'f26', name: '火锅', category: '聚餐', mealType: 'main_meal', image: img('photo-1569718212165-3a8278d5f624') },
  { id: 'f27', name: '咖喱饭', category: '盖饭', mealType: 'main_meal', image: img('photo-1585937421612-70a008356fbe') },
  { id: 'f28', name: '烤鱼', category: '烧烤', mealType: 'main_meal', image: img('photo-1519708227418-c8fd9a32b7a2') },

  // late_night ≥ 10
  { id: 'f29', name: '烧烤串', category: '夜宵', mealType: 'late_night', image: img('photo-1555939594-58d7cb561ad1') },
  { id: 'f30', name: '关东煮', category: '汤品', mealType: 'late_night', image: img('photo-1547592166-23ac45744acd') },
  { id: 'f31', name: '泡面加蛋', category: '速食', mealType: 'late_night', image: img('photo-1569718212165-3a8278d5f624') },
  { id: 'f32', name: '炸鸡啤酒', category: '宵夜', mealType: 'late_night', image: img('photo-1562967914-608f82629710') },
  { id: 'f33', name: '炒河粉', category: '面食', mealType: 'late_night', image: img('photo-1585032226651-759b368d7246') },
  { id: 'f34', name: '生煎包', category: '面点', mealType: 'late_night', image: img('photo-1496116218417-1a781b1c416c') },
  { id: 'f35', name: '麻辣烫', category: '街头', mealType: 'late_night', image: img('photo-1559339352-11d035aa65de') },
  { id: 'f36', name: '煎饼', category: '街头', mealType: 'late_night', image: img('photo-1565299624946-b28f40a0ae38') },
  { id: 'f37', name: '馄饨', category: '汤品', mealType: 'late_night', image: img('photo-1547592166-23ac45744acd') },
  { id: 'f38', name: '烤冷面', category: '街头', mealType: 'late_night', image: img('photo-1569718212165-3a8278d5f624') },
  { id: 'f39', name: '螺蛳粉', category: '面食', mealType: 'late_night', image: img('photo-1585032226651-759b368d7246') },
];
