import { useSupabaseData } from "./useSupabaseData";

export type Food = {
  id: string;
  name: string;
  unit_id: string;
  unit_qty: number;
  calories: number;
  created_by: string;
};

export function useFoods() {
  return useSupabaseData<Food>("foods");
}
