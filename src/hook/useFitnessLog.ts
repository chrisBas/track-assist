import { useSupabaseData } from "./useSupabaseData";

export type FitnessLogItem = {
  id: string;
  created_by: string;
  exercise_id: string;
  datetime: string;
};

export function useFitnessLog() {
  const data = useSupabaseData<FitnessLogItem>("fitness-log");
  data.items.sort((a, b) => (a.datetime < b.datetime ? 1 : -1));
  return data;
}
