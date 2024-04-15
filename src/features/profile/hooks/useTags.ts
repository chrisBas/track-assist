import { useSupabaseData } from "../../common/hooks/useSupabaseData";

export type Tag = {
  id: number;
  created_by: string;
  name: string;
  group_name: string;
};

export function useTags() {
  const data = useSupabaseData<Tag>("tags");
  return data;
}
