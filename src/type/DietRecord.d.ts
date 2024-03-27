import { Dayjs } from "dayjs";

export interface DietRecord {
  id: string;
  datetime: Dayjs;
  food: string;
  unit: string;
  unitQty: number;
  calories: number;
}
