import { Box, Card, CardContent } from "@mui/material";
import dayjs from "dayjs";
import CommonAreaChart from "../../../component/CommonAreaChart";
import { useFitnessLog } from "../../../hook/useFitnessLog";
import { FitnessSet, useFitnessSet } from "../../../hook/useFitnessSet";
import { SpecificRecord } from "../../../hook/useSupabaseData";

export default function WorkoutDashboard() {
  // global state
  const { items: fitnessLogItems, isLoaded: areFitnessLogsLoaded } =
    useFitnessLog();
  const { items: sets, isLoaded: areFitnessSetsLoaded } = useFitnessSet();

  // local vars
  const isLoaded = areFitnessLogsLoaded && areFitnessSetsLoaded;
  const setsByFitnessLogId = !isLoaded
    ? {}
    : sets.reduce((acc: Record<string, SpecificRecord<FitnessSet>[]>, set) => {
        if (!acc[set.fitness_log_id]) {
          acc[set.fitness_log_id] = [];
        }
        acc[set.fitness_log_id]!.push(set);
        return acc;
      }, {});
  let totalDistanceAggregate = 0;
  let totalRepsAggregate = 0;
  const sortedFitnessLogItems = fitnessLogItems.sort(
    (a, b) => dayjs(a.datetime).unix() - dayjs(b.datetime).unix()
  );
  const totalDistanceAndSetsByUnixTimestamp = !isLoaded
    ? {}
    : sortedFitnessLogItems.reduce(
        (
          acc: Record<number, { totalDistance: number; totalReps: number }>,
          item
        ) => {
          const sets = setsByFitnessLogId[item.id] || [];
          const unixTimestamp = dayjs(item.datetime).unix();
          if (!acc[unixTimestamp]) {
            acc[unixTimestamp] = {
              totalDistance: totalDistanceAggregate,
              totalReps: totalRepsAggregate,
            };
          }
          sets.forEach((set) => {
            if (set.distance) {
              acc[unixTimestamp].totalDistance += set.distance;
              totalDistanceAggregate += set.distance;
            } else if (set.reps) {
              acc[unixTimestamp].totalReps += set.reps;
              totalRepsAggregate += set.reps;
            }
          });
          return acc;
        },
        {}
      );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Card sx={{ mx: 2, my: 2 }}>
        <CardContent
          sx={{ aspectRatio: "4 / 3", maxHeight: "400px", width: "100%" }}
        >
          <CommonAreaChart
            title="Distance Traveled (miles)"
            data={Object.entries(totalDistanceAndSetsByUnixTimestamp).map(
              ([unixTimestamp, aggregates]) => ({
                datetime: unixTimestamp as unknown as number,
                value: aggregates.totalDistance,
              })
            )}
            xAxisDataKey={"datetime"}
          />
        </CardContent>
      </Card>
      <Card sx={{ mx: 2, my: 2 }}>
        <CardContent
          sx={{ aspectRatio: "4 / 3", maxHeight: "400px", width: "100%" }}
        >
          <CommonAreaChart
            title="Total Reps"
            data={Object.entries(totalDistanceAndSetsByUnixTimestamp).map(
              ([unixTimestamp, aggregates]) => ({
                datetime: unixTimestamp as unknown as number,
                value: aggregates.totalReps,
              })
            )}
            xAxisDataKey={"datetime"}
          />
        </CardContent>
      </Card>
    </Box>
  );
}
