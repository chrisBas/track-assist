import dayjs from "dayjs";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Props {
  data: any[];
  xAxisDataKey: string;
}

const COMMON_DATE_FORMAT = "M/DD/YY";

export default function CommonAreaChart({ data, xAxisDataKey }: Props) {
  const keys =
    data.length === 0
      ? []
      : Object.keys(data[0]).filter((key) => key !== xAxisDataKey);

  return (
    <ResponsiveContainer width={700} height="80%">
      <AreaChart
        data={data}
        margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
      >
        <XAxis
          dataKey={xAxisDataKey}
          type="number"
          domain={["auto", "auto"]}
          tickFormatter={(unixTime) =>
            dayjs(unixTime * 1000).format(COMMON_DATE_FORMAT)
          }
        />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <ReferenceLine x="Page C" stroke="green" label="Min PAGE" />
        <ReferenceLine
          y={4000}
          label="Max"
          stroke="red"
          strokeDasharray="3 3"
        />
        {keys.map((key) => (
          <Area
            key={key}
            type="monotone"
            dataKey={key}
            stroke="#8884d8"
            fill="#8884d8"
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}
