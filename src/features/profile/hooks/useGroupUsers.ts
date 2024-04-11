import { useSupabaseData } from "../../common/hooks/useSupabaseData";

export type GroupUsers = {
  id: number;
  created_by: string;
  group_name: string;
  username: string;
};

export function useGroupUsers() {
  const data = useSupabaseData<GroupUsers>("group_users");
  return data;
}
