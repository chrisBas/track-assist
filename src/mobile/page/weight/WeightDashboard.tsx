import { Box, Card, CardContent } from "@mui/material";
import dayjs from "dayjs";
import CommonAreaChart from "../../../component/CommonAreaChart";
import { useMetrics } from "../../../hook/useMetrics";

export default function WeightDashboard() {
  // global state
  const { items: allMetrics } = useMetrics();

  // local vars
  const weights = allMetrics.filter(
    (metric) => metric.metric === "weight (lbs)"
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Card sx={{ mx: 2, my: 2 }}>
        <CardContent
          sx={{ aspectRatio: "4 / 3", maxHeight: "400px", width: "100%" }}
        >
          <CommonAreaChart
            title="Weight (lbs)"
            data={weights.map((weight) => ({
              datetime: dayjs(weight.datetime).unix(),
              value: weight.value,
            }))}
            xAxisDataKey={"datetime"}
          />
        </CardContent>
      </Card>
    </Box>
  );
}
