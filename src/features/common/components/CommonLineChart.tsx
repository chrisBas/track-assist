import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useRef } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
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
  // local state
  const chartRef = useRef<any>();

  // local vars
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobile = /iphone|ipad|ipod|android|windows phone/g.test(userAgent);
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
  const lowerDomain = parseFloat((minMax.min * 0.97).toFixed(2));
  const upperDomain = parseFloat((minMax.max * 1.03).toFixed(2));
  const step = Math.ceil((upperDomain - lowerDomain) / 4);
  const ticks =
    step === 0
      ? undefined
      : Array.from({ length: 5 }, (_, idx) =>
          parseFloat((lowerDomain + idx * step).toFixed(2))
        );

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <Typography
        variant="body1"
        fontWeight={500}
        color="dimgray"
        align="center"
        gutterBottom
      >
        {title}
      </Typography>
      <Box sx={{ height: "100%", width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 12, right: 28, left: 0, bottom: 48 }}
            ref={chartRef}
          >
            <XAxis
              dataKey={xAxisDataKey}
              type="number"
              domain={["auto", "auto"]}
              tickFormatter={(unixTime) =>
                dayjs(unixTime * 1000).format(COMMON_DATE_FORMAT)
              }
              angle={-45}
              tickMargin={20}
              fontSize={12}
            />
            <YAxis
              domain={[lowerDomain, upperDomain]}
              ticks={ticks}
              fontSize={12}
            />
            <CartesianGrid vertical={false} />
            <Tooltip
              isAnimationActive
              animationEasing="ease-in-out"
              labelFormatter={(unixTime) => {
                if (isMobile && chartRef.current.state.isTooltipActive) {
                  setTimeout(() => {
                    chartRef.current?.setState({ isTooltipActive: false });
                  }, 3000);
                }
                return dayjs(unixTime * 1000).format(COMMON_DATE_FORMAT);
              }}
            />
            {keys.map((key, idx) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
