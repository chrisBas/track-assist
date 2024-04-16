import { useSupabaseData } from '../../common/hooks/useSupabaseData';

export type Tag = {
  id: number;
  created_by: string;
  task_id: number;
  tag_id: number;
};

export function useTaskTags() {
  const data = useSupabaseData<Tag>('task_tags');
  return data;
}
