import { useSupabaseData } from "./useSupabaseData";

type DietLineItem = {
  id: number;
  unit_qty: number;
  datetime: string;
  food_id: number;
  created_by: string;
};

export function useDietLog() {
  return useSupabaseData<DietLineItem>("diet-log");
}
