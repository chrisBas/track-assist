export interface TimeLog {
  id: string;
  startTime: string;
  endTime: string;
  notes: string;
}

export interface DateItem {
  year: number;
  month: number;
  day: number;
}

export interface DatedTimeLogs extends DateItem {
  timeLogs: TimeLog[];
}
