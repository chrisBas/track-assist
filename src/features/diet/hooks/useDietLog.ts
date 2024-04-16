import { useSupabaseData } from '../../common/hooks/useSupabaseData';

export type DietLineItem = {
  id: number;
  servings: number;
  datetime: string;
  food_id: number;
  created_by: string;
};

export function useDietLog() {
  const data = useSupabaseData<DietLineItem>('diet-log');
  data.items.sort((a, b) => (a.datetime < b.datetime ? 1 : -1));
  return data;
}
