import dayjs, { Dayjs } from "dayjs";
import { create } from "zustand";

export const useDietStore = create<{
  datetime: Dayjs;
  setDatetime: (datetime: Dayjs) => void;
}>((set) => ({
  datetime: dayjs(),
  setDatetime: (datetime: Dayjs) => set({ datetime }),
}));
