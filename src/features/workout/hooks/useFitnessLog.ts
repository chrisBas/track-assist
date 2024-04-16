import { useSupabaseData } from '../../common/hooks/useSupabaseData';

export type FitnessLogItem = {
  id: number;
  created_by: string;
  exercise_id: number;
  datetime: string;
};

export function useFitnessLog() {
  const data = useSupabaseData<FitnessLogItem>('fitness-log');
  data.items.sort((a, b) => (a.datetime < b.datetime ? 1 : -1));
  return data;
}
