import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Props {
  data: any[];
  xAxisDataKey: string;
  title?: string;
}

const COMMON_DATE_FORMAT = "M/DD/YY";

export default function CommonAreaChart({ data, xAxisDataKey, title }: Props) {
  const keys =
    data.length === 0
      ? []
      : Object.keys(data[0]).filter((key) => key !== xAxisDataKey);
  const minMax =
    data.length === 0
      ? { min: 0, max: 0 }
      : data.reduce(
          (acc: { min: number; max: number }, cur) => {
            keys.forEach((key) => {
              if (acc.max < cur[key]) {
                acc.max = cur[key];
              }
              if (acc.min > cur[key]) {
                acc.min = cur[key];
              }
            });
            return acc;
          },
          { max: data[0][keys[0]], min: data[0][keys[0]] }
        );

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <Typography variant="h6" align="center" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ height: "100%", width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
          >
            <XAxis
              dataKey={xAxisDataKey}
              type="number"
              domain={["auto", "auto"]}
              tickFormatter={(unixTime) =>
                dayjs(unixTime * 1000).format(COMMON_DATE_FORMAT)
              }
              angle={-30}
              tickMargin={20}
            />
            <YAxis
              domain={[
                parseFloat((minMax.min * 0.97).toFixed(2)),
                parseFloat((minMax.max * 1.03).toFixed(2)),
              ]}
            />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip
              labelFormatter={(unixTime) =>
                dayjs(unixTime * 1000).format(COMMON_DATE_FORMAT)
              }
            />
            {keys.map((key, idx) => (
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
      </Box>
    </Box>
  );
}
