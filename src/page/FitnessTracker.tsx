import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import React, { useState } from "react";
import CommonAutocomplete from "../component/CommonAutocomplete";
import { useExercise } from "../hook/useExercise";
import { useFitnessLog } from "../hook/useFitnessLog";
import { useFitnessSet } from "../hook/useFitnessSet";

const COMMON_DATE_FORMAT = "YYYY-MM-DDTHH:mm:ss";

export default function FitnessTracker() {
  // global state
  const {
    items: exercises,
    add: addExercise,
    isLoaded: isExercisesLoaded,
  } = useExercise();
  const {
    items: fitnessSets,
    add: addFitnessSet,
    delete: deleteFitnessSet,
    isLoaded: isFitnessSetsLoaded,
    update: updateFitnessSet,
  } = useFitnessSet();
  const {
    items: fitnessLogs,
    add: addFitnessLog,
    delete: deleteFitnessLog,
    isLoaded: isFitnessLogsLoaded,
    update: updateFitnessLog,
  } = useFitnessLog();

  // local state
  const [fitnessLogItemId, setFitnessLogItemId] = useState<number | null>(null);
  const [datetime, setDatetime] = useState<Dayjs | null>(null);
  const [exercise, setExercise] = useState<string | null>(null);
  const [sets, setSets] = useState<
    { id?: number; reps: number | null; weight: number | null }[]
  >([{ reps: null, weight: null }]);

  // local vars
  const isLoaded =
    isExercisesLoaded && isFitnessSetsLoaded && isFitnessLogsLoaded;
  const allFitnessLogs = !isLoaded
    ? []
    : fitnessLogs.map((fl) => {
        const exercise = exercises.find((e) => e.id === fl.exercise_id)!;
        const sets = fitnessSets.filter((fs) => fs.fitness_log_id === fl.id);
        return {
          id: fl.id,
          datetime: fl.datetime,
          exercise: exercise.exercise,
          sets,
        };
      });
  const exerciseOptions = exercises.map((exercise) => ({
    label: exercise.exercise,
    value: exercise.exercise,
  }));
  const isExistingExercise = exercises.some((e) => e.exercise === exercise);

  // local fns
  const onReset = () => {
    setFitnessLogItemId(null);
    setDatetime(null);
    setExercise(null);
    setSets([{ reps: null, weight: null }]);
  };
  const onAdd = async () => {
    if (
      exercise != null &&
      sets.length > 0 &&
      !sets.some((set) => set.reps === null)
    ) {
      const exercise_id: number = !isExistingExercise
        ? (await addExercise({ exercise: exercise })).id
        : exercises.find((exer) => exer.exercise === exercise)!.id;
      let currentFitnessLogId = fitnessLogItemId;
      if (fitnessLogItemId == null) {
        currentFitnessLogId = (
          await addFitnessLog({
            exercise_id,
            datetime: (datetime || dayjs()).format(COMMON_DATE_FORMAT),
          })
        ).id;
      } else {
        updateFitnessLog({
          id: fitnessLogItemId,
          exercise_id,
          datetime: (datetime || dayjs()).format(COMMON_DATE_FORMAT),
        });
      }
      sets.forEach(async (set) => {
        if (set.reps !== null) {
          if (set.id === undefined) {
            await addFitnessSet({
              fitness_log_id: currentFitnessLogId!,
              reps: set.reps,
              weight: set.weight === null ? undefined : set.weight,
            });
          } else {
            updateFitnessSet({
              id: set.id,
              reps: set.reps,
              weight: set.weight === null ? undefined : set.weight,
              fitness_log_id: currentFitnessLogId!,
            });
          }
        }
      });
    }
    onReset();
  };
  const onDelete = () => {
    deleteFitnessLog(fitnessLogItemId!);
  };
  const onExerciseSelected = (exercise: string | null, isNew: boolean) => {
    if (isNew) {
      if (exercise == null) {
        setSets([{ reps: null, weight: null }]);
      } else {
        // TODO: set sets based on recent logs
      }
    }
    setExercise(exercise);
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <DateTimePicker
                slotProps={{ textField: { size: "small" } }}
                sx={{ width: "100%", py: 1 }}
                value={datetime}
                onChange={setDatetime}
              />
              <CommonAutocomplete
                size="small"
                label="Select exercise..."
                sx={{ width: "100%", py: 1 }}
                value={exercise}
                onSelect={(value) => {
                  onExerciseSelected(value, false);
                }}
                onCreate={(value) => {
                  onExerciseSelected(value, true);
                }}
                options={exerciseOptions}
              />
              {sets.map(({ reps, weight }, index) => {
                return (
                  <Box key={index} sx={{ pl: 2, py: 0.5 }}>
                    <Typography variant="caption" sx={{ pt: 0.5 }}>{`Set ${
                      index + 1
                    }.`}</Typography>
                    <TextField
                      size="small"
                      sx={{ width: "100%", py: 0.5 }}
                      label="Reps..."
                      type="number"
                      value={reps === null ? "" : reps}
                      onChange={(e) => {
                        const reps =
                          e.target.value === ""
                            ? null
                            : parseFloat(e.target.value);
                        setSets((prev) =>
                          prev.map((val, i) =>
                            i === index ? { ...val, reps } : val
                          )
                        );
                      }}
                    />
                    <TextField
                      size="small"
                      sx={{ width: "100%", py: 0.5 }}
                      label="Weight..."
                      type="number"
                      value={weight === null ? "" : weight}
                      onChange={(e) => {
                        const weight =
                          e.target.value === ""
                            ? null
                            : parseFloat(e.target.value);
                        setSets((prev) =>
                          prev.map((val, i) =>
                            i === index ? { ...val, weight } : val
                          )
                        );
                      }}
                    />
                  </Box>
                );
              })}
              <Stack
                direction="row"
                spacing={1}
                justifyContent="flex-end"
                sx={{ pt: 0.5 }}
              >
                <Button variant="contained" color="success" onClick={onAdd}>
                  {fitnessLogItemId == null ? "Add" : "Edit"}
                </Button>
                <Button
                  variant="contained"
                  color="warning"
                  onClick={onReset}
                  disabled={
                    exercise == null &&
                    !sets.some(
                      (set) => set.reps === null || set.weight === null
                    ) &&
                    datetime == null
                  }
                >
                  Reset
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  disabled={fitnessLogItemId == null}
                  onClick={onDelete}
                >
                  Delete
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="body2" fontWeight="bold">
                    Datetime
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" fontWeight="bold">
                    Exercise
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" fontWeight="bold">
                    Sets
                  </Typography>
                </Grid>
                {allFitnessLogs.map((fitLog) => {
                  return (
                    <Grid
                      container
                      key={fitLog.id}
                      sx={{
                        "&:hover": {
                          backgroundColor: "#eaeaea",
                        },
                      }}
                    >
                      <Grid item xs={4}>
                        <Typography variant="body2">
                          {dayjs(fitLog.datetime).format(COMMON_DATE_FORMAT)}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2">
                          {fitLog.exercise}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        {fitLog.sets.map((set, index) => {
                          return (
                            <React.Fragment key={index}>
                              <Typography variant="body2">
                                {`${set.reps} reps${
                                  set.weight === null
                                    ? ""
                                    : `, ${set.weight} lbs`
                                }`}
                              </Typography>
                            </React.Fragment>
                          );
                        })}
                      </Grid>
                    </Grid>
                  );
                })}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
