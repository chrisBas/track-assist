import { useSupabaseData } from "./useSupabaseData";

export type FitnessLogItem = {
  id: number;
  created_by: string;
  exercise_id: number;
  datetime: string;
};

export function useFitnessLog() {
  return useSupabaseData<FitnessLogItem>("fitness-log");
}
