import dayjs from 'dayjs';

import { useSupabaseData } from '../..//common/hooks/useSupabaseData';

export type Task = {
  id: number;
  created_by: string;
  label: string;
  due_date: string | null;
  is_complete: boolean;
  notes: string | null;
};

export function useTasks() {
  const data = useSupabaseData<Task>('tasks');
  const endOfToday = dayjs().endOf('day').format('YYYY-MM-DDTHH:mm:ss');
  data.items.sort((a, b) => {
    const aDueDate = a.due_date || endOfToday;
    const bDueDate = b.due_date || endOfToday;
    return aDueDate.localeCompare(bDueDate);
  });
  return data;
}
