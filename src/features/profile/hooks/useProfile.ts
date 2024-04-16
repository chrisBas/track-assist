import { useSupabaseData } from '../../common/hooks/useSupabaseData';

export type Profile = {
  id: number;
  created_by: string;
  username: string;
};

export function useProfile() {
  const data = useSupabaseData<Profile>('profile');
  return data;
}
