import { useSupabaseData } from "./useSupabaseData";

export type FitnessSet = {
  id: string;
  created_by: string;
  fitness_log_id: string;
  weight: number | null;
  reps: number | null;
};

export function useFitnessSet() {
  return useSupabaseData<FitnessSet>("fitness-set");
}
