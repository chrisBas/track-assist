import { useSupabaseData } from "./useSupabaseData";

export type FitnessSet = {
  id: number;
  created_by: string;
  fitness_log_id: number;
  weight: number | null;
  reps: number;
};

export function useFitnessSet() {
  const data = useSupabaseData<FitnessSet>("fitness-set");
  data.items.sort((a, b) => (a.id < b.id ? -1 : 1));
  return data;
}
