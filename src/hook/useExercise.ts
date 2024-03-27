import { useSupabaseData } from "./useSupabaseData";

export type Exercise = {
  id: string;
  created_by: string;
  exercise: string;
  description: string | null;
  muscle_group: string;
  weight_unit: string;
};

export function useExercise() {
  const data = useSupabaseData<Exercise>("exercise");
  data.items.sort((a, b) => {
    const n = a.muscle_group.localeCompare(b.muscle_group);
    if (n !== 0) return n;
    return a.exercise.localeCompare(b.exercise);
  });
  return data;
}
