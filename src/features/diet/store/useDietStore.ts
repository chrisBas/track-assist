import dayjs, { Dayjs } from 'dayjs';
import { create } from 'zustand';

export const useDietStore = create<{
  datetime: Dayjs;
  setDatetime: (datetime: Dayjs) => void;
  food: string;
  setFood: (food: string) => void;
}>((set) => ({
  datetime: dayjs(),
  setDatetime: (datetime) => set({ datetime }),
  food: '',
  setFood: (food) => set({ food }),
}));
