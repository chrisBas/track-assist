import { useSupabaseData } from "../../common/hooks/useSupabaseData";

export type UOM = {
  id: number;
  name: string;
  abbreviation: string;
  created_by: string;
};

export function useUnits() {
  return useSupabaseData<UOM>("units-of-measurement");
}
