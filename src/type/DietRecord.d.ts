import { Dayjs } from "dayjs";

export interface DietRecord {
  id: number;
  datetime: Dayjs;
  food: string;
  unit: string;
  unitQty: number;
  calories: number;
}
