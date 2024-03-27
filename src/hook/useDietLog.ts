import { useSupabaseData } from "./useSupabaseData";

type DietLineItem = {
  id: string;
  unit_qty: number;
  datetime: string;
  food_id: string;
  created_by: string;
};

export function useDietLog() {
  const data = useSupabaseData<DietLineItem>("diet-log");
  data.items.sort((a, b) => (a.datetime < b.datetime ? 1 : -1));
  return data;
}
