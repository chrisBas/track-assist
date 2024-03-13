import { useSupabaseData } from "./useSupabaseData";

export type FitnessSet = {
  id: number;
  created_by: string;
  fitness_log_id: number;
  weight?: number;
  reps: number;
};

export function useFitnessSet() {
  return useSupabaseData<FitnessSet>("fitness-set");
}
