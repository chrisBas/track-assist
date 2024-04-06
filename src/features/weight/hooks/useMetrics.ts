import { useSupabaseData } from "../../common/hooks/useSupabaseData";

export type Metric = {
  id: number;
  value: number;
  metric: string;
  datetime: string;
  created_by: string;
};

export function useMetrics() {
  const data = useSupabaseData<Metric>("metric-log");
  data.items.sort((a, b) => (a.datetime < b.datetime ? 1 : -1));
  return data;
}
