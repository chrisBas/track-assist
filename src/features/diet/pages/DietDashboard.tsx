import { Box, Card, CardContent } from "@mui/material";
import dayjs from "dayjs";
import CommonAreaChart from "../../common/components/CommonLineChart";
import { SpecificRecord } from "../../common/hooks/useSupabaseData";
import { useDietLog } from "../hooks/useDietLog";
import { Food, useFoods } from "../hooks/useFoods";

export default function DietDashboard() {
  // global state
  const { isLoaded: isFoodsLoaded, items: foods } = useFoods();
  const { isLoaded: isDietLogLoaded, items: dietLogItems } = useDietLog();

  // local vars
  const isLoaded = isFoodsLoaded && isDietLogLoaded;
  const foodById = foods.reduce(
    (acc: Record<string, SpecificRecord<Food>>, food) => {
      acc[food.id] = food;
      return acc;
    },
    {}
  );
  const caloriesByDate: Record<number, number> = !isLoaded
    ? []
    : dietLogItems
        .map((item) => {
          const food = foodById[item.food_id];
          return {
            unixTimestampOfDay: dayjs(item.datetime).startOf("day").unix(),
            calories: food.calories * ((item.unit_qty || 0) / food.unit_qty),
          };
        })
        .sort((a, b) => a.unixTimestampOfDay - b.unixTimestampOfDay)
        .reduce((acc: Record<number, number>, item) => {
          if (!acc[item.unixTimestampOfDay]) {
            acc[item.unixTimestampOfDay] = 0;
          }
          acc[item.unixTimestampOfDay] += item.calories;
          return acc;
        }, {});

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Card sx={{ mx: 2, my: 2 }}>
        <CardContent
          sx={{ aspectRatio: "1", maxHeight: "400px", width: "100%" }}
        >
          <CommonAreaChart
            title="Calories Consumed by Date"
            data={Object.entries(caloriesByDate).map(
              ([unixTimestamp, totalCalories]) => ({
                datetime: unixTimestamp as unknown as number,
                value: totalCalories,
              })
            )}
            xAxisDataKey={"datetime"}
          />
        </CardContent>
      </Card>
    </Box>
  );
}
