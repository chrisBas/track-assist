import { Session } from '@supabase/supabase-js';
import { createStore, useStore } from 'zustand';

interface ProfileState {
  session: Session | null;
  setSession: (session: Session | null) => void;
}

const store = createStore<ProfileState>((set) => ({
  session: null,
  setSession: (session) => set({ session }),
}));

export function useSession(): [session: Session | null, setSession: (session: Session | null) => void] {
  const value = useStore(store);
  return [value.session, value.setSession];
}
