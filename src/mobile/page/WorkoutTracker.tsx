import {
  Add,
  Delete,
  FolderOff,
  InfoOutlined,
  Remove,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
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
  Tooltip,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";
import FabAdd from "../../component/FabAdd";
import VirtualizedDateList from "../../component/VirtualizedDateList";
import useActiveApp from "../../hook/useActiveApp";
import { Exercise, useExercise } from "../../hook/useExercise";
import { useFitnessLog } from "../../hook/useFitnessLog";
import { FitnessSet, useFitnessSet } from "../../hook/useFitnessSet";
import { SpecificRecord } from "../../hook/useSupabaseData";
import { useFitnessStore } from "../../store/useFitnessStore";
import { toDateString } from "../../util/date-utils";
import TopAppBar from "../component/TopAppBar";

type ExerciseItem = {
  fitnessLogId: string;
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
      <TopAppBar title="Workouts" showProfile />
      <VirtualizedDateList
        date={datetime}
        onDateChange={(date) => {
          setDatetime(date);
        }}
      />
      <Box sx={{ flexGrow: 1 }}>
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
            <Box sx={{ pb: "88px" }}>
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
                <Grid container alignItems="center" justifyContent="center">
                  <Grid item xs={3}>
                    Set
                  </Grid>
                  <Grid item xs={3}>
                    Reps
                  </Grid>
                  <Grid item xs={3}>
                    lbs
                  </Grid>
                  <Grid item xs={3}>
                    Done
                  </Grid>
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

function SetListItems({ fitnessLogId }: { fitnessLogId: string }) {
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
                addSet({ fitness_log_id: fitnessLogId, reps: 0, weight: null });
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
  const { update: updateSet } = useFitnessSet();
  const [set, setSet] = useState<SpecificRecord<FitnessSet>>(initSet);

  return (
    <Grid item xs={12}>
      <Grid container alignItems="center" justifyContent="center">
        <Grid item xs={3}>
          {num}
        </Grid>
        <Grid item xs={3}>
          <TextField
            size="small"
            type="number"
            value={set.reps === null ? "" : set.reps}
            onChange={(e) => {
              setSet((prev) => ({
                ...prev,
                reps: e.target.value === "" ? null : parseInt(e.target.value),
              }));
            }}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            size="small"
            type="number"
            value={set.weight === null ? "" : set.weight}
            onChange={(e) => {
              setSet((prev) => ({
                ...prev,
                weight: e.target.value === "" ? null : parseInt(e.target.value),
              }));
            }}
          />
        </Grid>
        <Grid item xs={3}>
          <Checkbox
            checked={initSet.weight === set.weight && initSet.reps === set.reps}
            onChange={() => {
              updateSet(set);
            }}
            disabled={
              initSet.weight === set.weight && initSet.reps === set.reps
            }
          />
        </Grid>
      </Grid>
    </Grid>
  );
}
