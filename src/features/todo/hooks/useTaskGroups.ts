import { useSupabaseData } from '../..//common/hooks/useSupabaseData';

export type TaskGroup = {
  id: number;
  created_by: string;
  task_id: number;
  group_id: number;
};

export function useTaskGroups() {
  const data = useSupabaseData<TaskGroup>('task_groups');
  return data;
}
