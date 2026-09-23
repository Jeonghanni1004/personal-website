export type RandomMealBucket = 'breakfast' | 'main_meal' | 'late_night';

export function getMealBucket(date = new Date()): RandomMealBucket {
  const h = date.getHours();
  if (h >= 5 && h < 11) return 'breakfast';
  if (h >= 11 && h < 22) return 'main_meal';
  return 'late_night';
}

export function mealBucketLabel(bucket: RandomMealBucket): string {
  switch (bucket) {
    case 'breakfast':
      return '早餐时段';
    case 'main_meal':
      return '正餐时段';
    case 'late_night':
      return '夜宵时段';
  }
}

export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
