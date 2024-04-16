import { create } from 'zustand';

export const useGroupUserStore = create<{
  groupName: string;
  setGroupName: (groupName: string) => void;
}>((set) => ({
  groupName: '',
  setGroupName: (groupName) => set({ groupName }),
}));
