import { format, subDays, subYears } from 'date-fns';
import type { DiaryEntry } from '../types';

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`;

const today = new Date();
const d = (offset: number) => format(subDays(today, offset), 'yyyy-MM-dd');
const lastYear = (offset = 0) => format(subDays(subYears(today, 1), offset), 'yyyy-MM-dd');

export const SEED_DIARY: DiaryEntry[] = [
  // recent month
  { id: 'd1', date: d(0), time: '08:20', mealType: '早餐', foodName: '小笼包', image: img('photo-1496116218417-1a781b1c416c'), note: '上班前匆匆吃了几口，还是热的。', mood: 'good' },
  { id: 'd2', date: d(0), time: '12:35', mealType: '午餐', foodName: '番茄牛腩饭', image: img('photo-1546069901-ba9599a7e63c'), note: '公司楼下那家，牛腩很烂。', mood: 'amazing' },
  { id: 'd3', date: d(1), time: '08:10', mealType: '早餐', foodName: '豆浆油条', image: img('photo-1585032226651-759b368d7246'), mood: 'good' },
  { id: 'd4', date: d(1), time: '19:20', mealType: '晚餐', foodName: '石锅拌饭', image: img('photo-1498654896293-37aacf113fd9'), note: '锅巴是灵魂。', mood: 'amazing' },
  { id: 'd5', date: d(2), time: '12:00', mealType: '午餐', foodName: '沙拉碗', image: img('photo-1512621776951-a57141f2eefd'), note: '努力吃得健康一点。', mood: 'okay' },
  { id: 'd6', date: d(2), time: '19:45', mealType: '晚餐', foodName: '红烧肉', image: img('photo-1529042410759-befb1204b468'), note: '妈妈做的味道。', mood: 'amazing' },
  { id: 'd7', date: d(3), time: '08:30', mealType: '早餐', foodName: '燕麦牛奶', image: img('photo-1517677208171-4bd2727453af'), mood: 'okay' },
  { id: 'd8', date: d(3), time: '12:40', mealType: '午餐', foodName: '黄焖鸡米饭', image: img('photo-1604908176997-125f25cc6f3d'), mood: 'good' },
  { id: 'd9', date: d(3), time: '22:15', mealType: '夜宵', foodName: '烧烤串', image: img('photo-1555939594-58d7cb561ad1'), note: '加班回来的奖励。', mood: 'good' },
  { id: 'd10', date: d(4), time: '13:00', mealType: '午餐', foodName: '寿司拼盘', image: img('photo-1579584425555-c3ce17fd4351'), mood: 'amazing' },
  { id: 'd11', date: d(5), time: '08:00', mealType: '早餐', foodName: '煎蛋吐司', image: img('photo-1525351484163-7529414344d8'), mood: 'good' },
  { id: 'd12', date: d(5), time: '19:00', mealType: '晚餐', foodName: '火锅', image: img('photo-1569718212165-3a8278d5f624'), note: '和朋友撸了一个晚上。', mood: 'amazing' },
  { id: 'd13', date: d(6), time: '12:20', mealType: '午餐', foodName: '牛肉面', image: img('photo-1585032226651-759b368d7246'), mood: 'good' },
  { id: 'd14', date: d(7), time: '09:00', mealType: '早餐', foodName: '酸奶水果碗', image: img('photo-1488477181946-6428a0291777'), mood: 'good' },
  { id: 'd15', date: d(7), time: '18:50', mealType: '晚餐', foodName: '咖喱饭', image: img('photo-1585937421612-70a008356fbe'), mood: 'good' },
  { id: 'd16', date: d(8), time: '12:30', mealType: '午餐', foodName: '鱼香肉丝', image: img('photo-1512058564366-18510be2db19'), mood: 'amazing' },
  { id: 'd17', date: d(9), time: '19:10', mealType: '晚餐', foodName: '披萨', image: img('photo-1565299624946-b28f40a0ae38'), note: '周末放纵一下。', mood: 'good' },
  { id: 'd18', date: d(10), time: '08:15', mealType: '早餐', foodName: '皮蛋瘦肉粥', image: img('photo-1547592166-23ac45744acd'), mood: 'good' },
  { id: 'd19', date: d(11), time: '12:50', mealType: '午餐', foodName: '宫保鸡丁', image: img('photo-1604908176997-125f25cc6f3d'), mood: 'good' },
  { id: 'd20', date: d(12), time: '20:00', mealType: '晚餐', foodName: '酸菜鱼', image: img('photo-1559339352-11d035aa65de'), mood: 'amazing' },
  { id: 'd21', date: d(13), time: '07:50', mealType: '早餐', foodName: '蛋饼', image: img('photo-1482049016688-2d3e1b311543'), mood: 'okay' },
  { id: 'd22', date: d(14), time: '12:10', mealType: '午餐', foodName: '日式拉面', image: img('photo-1569718212165-3a8278d5f624'), mood: 'amazing' },
  { id: 'd23', date: d(15), time: '19:30', mealType: '晚餐', foodName: '烤鱼', image: img('photo-1519708227418-c8fd9a32b7a2'), mood: 'good' },
  { id: 'd24', date: d(16), time: '08:40', mealType: '早餐', foodName: '三明治', image: img('photo-1528735602780-2552fd46c7af'), mood: 'good' },
  { id: 'd25', date: d(18), time: '12:00', mealType: '午餐', foodName: '番茄炒蛋', image: img('photo-1603133879110-a1d2e0f1c0a1'), note: '自己做的，成就感满满。', mood: 'amazing' },
  { id: 'd26', date: d(20), time: '21:40', mealType: '夜宵', foodName: '炸鸡啤酒', image: img('photo-1562967914-608f82629710'), mood: 'good' },
  { id: 'd27', date: d(22), time: '13:20', mealType: '午餐', foodName: '麻辣香锅', image: img('photo-1569718212165-3a8278d5f624'), mood: 'amazing' },
  { id: 'd28', date: d(25), time: '19:00', mealType: '晚餐', foodName: '馄饨', image: img('photo-1547592166-23ac45744acd'), mood: 'good' },
  { id: 'd29', date: d(28), time: '08:00', mealType: '早餐', foodName: '烧麦', image: img('photo-1534422298391-e4f8c172dddb'), mood: 'good' },

  // 去年今日
  { id: 'dy1', date: lastYear(0), time: '12:30', mealType: '午餐', foodName: '红烧排骨', image: img('photo-1529042410759-befb1204b468'), note: '去年今天也吃得很好。', mood: 'amazing' },
  { id: 'dy2', date: lastYear(0), time: '19:00', mealType: '晚餐', foodName: '小龙虾', image: img('photo-1559339352-11d035aa65de'), note: '夏天的味道。', mood: 'amazing' },
  { id: 'dy3', date: lastYear(1), time: '12:00', mealType: '午餐', foodName: '盖浇饭', image: img('photo-1546069901-ba9599a7e63c'), mood: 'okay' },
];
