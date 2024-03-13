import { useSupabaseData } from "./useSupabaseData";

export type Exercise = {
  id: number;
  created_by: string;
  exercise: string;
  description?: string;
};

export function useExercise() {
  return useSupabaseData<Exercise>("exercise");
}
