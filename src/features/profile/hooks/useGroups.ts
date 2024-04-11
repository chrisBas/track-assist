import { useSupabaseData } from "../../common/hooks/useSupabaseData";

export type Group = {
  id: number;
  created_by: string;
  group_name: string;
};

export function useGroups() {
  const data = useSupabaseData<Group>("groups");
  return data;
}
