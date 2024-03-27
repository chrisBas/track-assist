import { useSupabaseData } from "./useSupabaseData";

type UOM = {
  id: string;
  name: string;
  abbreviation: string;
  created_by: string;
};

export function useUnits() {
  return useSupabaseData<UOM>("units-of-measurement");
}
