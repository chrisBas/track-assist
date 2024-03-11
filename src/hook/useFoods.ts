import { useSupabaseData } from "./useSupabaseData";

type Food = {
  id: number;
  name: string;
  unit_id: number;
  unit_qty: number;
  calories: number;
  created_by: string;
};

export function useFoods() {
  return useSupabaseData<Food>("foods");
}
