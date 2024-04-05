import {
  Add,
  Delete,
  DirectionsRun,
  FitnessCenter,
  FolderOff,
  InfoOutlined,
  Remove,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Collapse,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import FabAdd from "../../../component/FabAdd";
import VirtualizedDateList from "../../../component/VirtualizedDateList";
import useActiveApp from "../../../hook/useActiveApp";
import { Exercise, useExercise } from "../../../hook/useExercise";
import { useFitnessLog } from "../../../hook/useFitnessLog";
import { FitnessSet, useFitnessSet } from "../../../hook/useFitnessSet";
import { SpecificRecord } from "../../../hook/useSupabaseData";
import { useFitnessStore } from "../../../store/useFitnessStore";
import { toDateString } from "../../../util/date-utils";
import TopAppBar from "../../component/TopAppBar";

type ExerciseItem = {
  fitnessLogId: number;
  name: string;
  description?: string;
  muscleGroup: string;
};

export default function WorkoutTracker() {
  // global state
  const { setActiveApp } = useActiveApp();
  const { datetime, setDatetime } = useFitnessStore();
  const { items: fitnessLogItems, isLoaded: areFitnessLogsLoaded } =
    useFitnessLog();
  const { items: exercises, isLoaded: areExercisesLoaded } = useExercise();
  // TODO: breakup exercises into Weighted Exercises and Distance Exercises to allow for simple, different data models

  // local vars
  const isLoaded = areFitnessLogsLoaded && areExercisesLoaded;
  const exercisesById = exercises.reduce(
    (acc: Record<string, SpecificRecord<Exercise>>, exercise) => {
      acc[exercise.id] = exercise;
      return acc;
    },
    {}
  );
  const myExercises: ExerciseItem[] = !isLoaded
    ? []
    : fitnessLogItems
        .filter((item) => {
          return toDateString(dayjs(item.datetime)) === toDateString(datetime);
        })
        .map((item) => {
          const exercise = exercisesById[item.exercise_id];

          return {
            fitnessLogId: item.id,
            name: exercise.exercise,
            description:
              exercise.description === null ? undefined : exercise.description,
            muscleGroup: exercise.muscle_group,
          };
        });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <TopAppBar
        title={datetime.format("MMM YYYY")}
        showProfile
        row2={
          <VirtualizedDateList
            date={datetime}
            onDateChange={(date) => {
              setDatetime(date);
            }}
          />
        }
      />
      <Box sx={{ flexGrow: 1, overflow: "scroll" }}>
        <List
          sx={{ height: "100%", width: "100%", bgcolor: "background.paper" }}
        >
          {myExercises.length === 0 ? (
            <Stack
              direction="column"
              justifyContent="center"
              alignItems="center"
              spacing={2}
              sx={{ height: "calc(100%)" }}
            >
              <FolderOff fontSize="large" color="disabled" />
              <Typography color="dimgray">
                No exercises have been logged today
              </Typography>
            </Stack>
          ) : (
            <Box sx={{ pb: "80px" }}>
              {myExercises.map((exercise) => (
                <ExerciseListItem
                  key={exercise.fitnessLogId}
                  exercise={exercise}
                />
              ))}
            </Box>
          )}
        </List>
      </Box>
      <FabAdd
        onClick={() => {
          setActiveApp((prev) => ({ ...prev, page: "New Workout" }));
        }}
      />
    </Box>
  );
}

function ExerciseListItem({ exercise }: { exercise: ExerciseItem }) {
  // global state
  const { delete: deleteFitnessLog } = useFitnessLog();

  // local state
  const [open, setOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <>
      <ListItemButton onClick={() => setOpen((prev) => !prev)}>
        <ListItemIcon>
          <Tooltip
            title={exercise.description}
            onClose={() => setShowTooltip(false)}
            open={showTooltip}
          >
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                setShowTooltip((prev) => !prev);
              }}
            >
              <InfoOutlined />
            </IconButton>
          </Tooltip>
        </ListItemIcon>
        <ListItemText primary={`${exercise.muscleGroup} | ${exercise.name}`} />
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            deleteFitnessLog(exercise.fitnessLogId);
          }}
        >
          <Delete />
        </IconButton>
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List disablePadding>
          <ListItem>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Grid
                  container
                  alignItems="center"
                  justifyContent="start"
                  spacing={1}
                >
                  <Grid item xs={1}>
                    Set
                  </Grid>
                  <Grid item xs={4}>
                    Weight/Cardio
                  </Grid>
                  <Grid item xs={2}>
                    Reps
                  </Grid>
                  <Grid item xs={2}>
                    lbs
                  </Grid>
                  <Grid item xs={3} />
                </Grid>
              </Grid>
              <SetListItems fitnessLogId={exercise.fitnessLogId} />
            </Grid>
          </ListItem>
        </List>
      </Collapse>
    </>
  );
}

function SetListItems({ fitnessLogId }: { fitnessLogId: number }) {
  const { items: allSets, add: addSet, delete: deleteSet } = useFitnessSet();
  const sets = allSets.filter((set) => set.fitness_log_id === fitnessLogId);

  return (
    <>
      {sets.map((set, idx) => (
        <SetListItem key={set.id} set={set} num={idx + 1} />
      ))}
      <Grid item xs={12}>
        <Grid container alignItems="center" justifyContent="center">
          <Grid item xs={6} px={3}>
            <Button
              size="small"
              startIcon={<Remove />}
              variant="outlined"
              fullWidth
              disabled={sets.length === 0}
              onClick={() => {
                deleteSet(sets[sets.length - 1].id);
              }}
            >
              Delete Set
            </Button>
          </Grid>
          <Grid item xs={6} px={3}>
            <Button
              size="small"
              startIcon={<Add />}
              variant="outlined"
              fullWidth
              onClick={() => {
                addSet({
                  fitness_log_id: fitnessLogId,
                  reps: 0,
                  weight: null,
                  distance: null,
                });
              }}
            >
              Add Set
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

function SetListItem({
  set: initSet,
  num,
}: {
  set: SpecificRecord<FitnessSet>;
  num: number;
}) {
  // global state
  const { update: updateSet } = useFitnessSet();

  // local state
  const [set, setSet] = useState({
    reps: initSet.reps === null ? "" : initSet.reps.toString(),
    weight: initSet.weight === null ? "" : initSet.weight.toString(),
    distance: initSet.distance === null ? "" : initSet.distance.toString(),
    isCardio: initSet.reps == null,
  });

  // effects
  useEffect(() => {
    setSet({
      reps: initSet.reps === null ? "" : initSet.reps.toString(),
      weight: initSet.weight === null ? "" : initSet.weight.toString(),
      distance: initSet.distance === null ? "" : initSet.distance.toString(),
      isCardio: initSet.reps == null,
    });
  }, [initSet]);

  return (
    <Grid item xs={12}>
      <Grid container alignItems="center" justifyContent="start" spacing={1}>
        <Grid item xs={1}>
          {num}
        </Grid>
        <Grid item xs={4}>
          <ToggleButtonGroup
            size="small"
            value={set.isCardio ? "cardio" : "weight"}
            exclusive
            onChange={() => {
              if (set.isCardio) {
                setSet({
                  reps: initSet.reps === null ? "0" : initSet.reps.toString(),
                  weight:
                    initSet.weight === null ? "" : initSet.weight.toString(),
                  distance: "",
                  isCardio: false,
                });
              } else {
                setSet({
                  reps: "",
                  weight: "",
                  distance:
                    initSet.distance === null
                      ? "0"
                      : initSet.distance.toString(),
                  isCardio: true,
                });
              }
            }}
          >
            <ToggleButton value="cardio">
              <DirectionsRun />
            </ToggleButton>
            <ToggleButton value="weight">
              <FitnessCenter />
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
        {set.isCardio ? (
          <Grid item xs={4}>
            <TextField
              size="small"
              type="number"
              value={set.distance}
              onChange={(e) => {
                setSet((prev) => ({ ...prev, distance: e.target.value }));
              }}
            />
          </Grid>
        ) : (
          <>
            <Grid item xs={2}>
              <TextField
                size="small"
                type="number"
                value={set.reps}
                onChange={(e) => {
                  setSet((prev) => ({ ...prev, reps: e.target.value }));
                }}
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                size="small"
                type="number"
                value={set.weight}
                onChange={(e) => {
                  setSet((prev) => ({ ...prev, weight: e.target.value }));
                }}
              />
            </Grid>
          </>
        )}
        <Grid item xs={3}>
          <Button
            size="small"
            variant="outlined"
            color="success"
            onClick={() => {
              updateSet({
                ...initSet,
                reps: set.reps === "" ? null : parseFloat(set.reps),
                weight: set.weight === "" ? null : parseFloat(set.weight),
                distance: set.distance === "" ? null : parseFloat(set.distance),
              });
            }}
            disabled={
              set.isCardio
                ? (initSet.distance === null
                    ? ""
                    : initSet.distance.toString()) === set.distance ||
                  set.distance === ""
                : ((initSet.weight === null
                    ? ""
                    : initSet.weight.toString()) === set.weight &&
                    (initSet.reps === null ? "" : initSet.reps.toString()) ===
                      set.reps) ||
                  set.reps === ""
            }
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}
