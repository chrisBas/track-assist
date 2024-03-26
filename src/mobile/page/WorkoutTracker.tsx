import { Add, Delete, InfoOutlined, Remove } from "@mui/icons-material";
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
  Switch,
  TextField,
  Tooltip,
} from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";
import FabAdd from "../../component/FabAdd";
import VirtualizedDateList from "../../component/VirtualizedDateList";
import useActiveApp from "../../hook/useActiveApp";
import TopAppBar from "../component/TopAppBar";

export default function WorkoutTracker() {
  // global state
  const { setActiveApp } = useActiveApp();

  // local state
  const [date, setDate] = useState(dayjs());

  const exercises = [
    {
      name: "Back Squat",
      muscleGroup: "Legs",
      description:
        "The back squat is a lower body exercise that targets the quadriceps, hamstrings, and glutes. It also works the calves, lower back, and core.",
      weightUnit: "lbs",
      defaultSets: [
        {
          reps: 8,
          weight: 135,
        },
      ],
    },
  ];

  return (
    <>
      <TopAppBar title="Workouts" showProfile />
      <VirtualizedDateList
        date={date}
        onDateChange={(date) => {
          setDate(date);
        }}
      />
      <Box>
        <List sx={{ width: "100%", bgcolor: "background.paper" }}>
          {exercises.map((exercise, idx) => (
            <ExerciseListItem key={idx} exercise={exercise} />
          ))}
        </List>
      </Box>
      <FabAdd
        onClick={() => {
          setActiveApp((prev) => ({ ...prev, page: "New Workout" }));
        }}
      />
    </>
  );
}

function ExerciseListItem({ exercise }: { exercise: any }) {
  // local state
  const [open, setOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [sets, setSets] = useState<
    { reps: number | null; weight: number | null; complete: boolean }[]
  >(exercise.defaultSets);

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
            console.log("delete");
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
                    Lbs
                  </Grid>
                  <Grid item xs={3}>
                    Done
                  </Grid>
                </Grid>
              </Grid>
              {sets.map((set, idx) => {
                return (
                  <Grid item key={idx} xs={12}>
                    <Grid container alignItems="center" justifyContent="center">
                      <Grid item xs={3}>
                        {idx}
                      </Grid>
                      <Grid item xs={3}>
                        <TextField
                          size="small"
                          type="number"
                          value={set.reps === null ? "" : set.reps}
                          onChange={(e) => {
                            setSets((prev) =>
                              prev.map((s, i) =>
                                i === idx
                                  ? {
                                      ...s,
                                      reps:
                                        e.target.value === ""
                                          ? null
                                          : parseInt(e.target.value),
                                    }
                                  : s
                              )
                            );
                          }}
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField
                          size="small"
                          type="number"
                          value={set.weight === null ? "" : set.weight}
                          onChange={(e) => {
                            setSets((prev) =>
                              prev.map((s, i) =>
                                i === idx
                                  ? {
                                      ...s,
                                      weight:
                                        e.target.value === ""
                                          ? null
                                          : parseInt(e.target.value),
                                    }
                                  : s
                              )
                            );
                          }}
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <Switch
                          checked={set.complete}
                          onChange={(e) => {
                            setSets((prev) =>
                              prev.map((s, i) =>
                                i === idx
                                  ? { ...s, complete: e.target.checked }
                                  : s
                              )
                            );
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                );
              })}
              <Grid item xs={12}>
                <Grid container alignItems="center" justifyContent="center">
                  <Grid item xs={6} px={3}>
                    <Button
                      size="small"
                      startIcon={<Remove />}
                      variant="outlined"
                      fullWidth
                      onClick={() => {
                        setSets((prev) => prev.slice(0, -1));
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
                        setSets((prev) => [
                          ...prev,
                          { reps: null, weight: null, complete: true },
                        ]);
                      }}
                    >
                      Add Set
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </ListItem>
        </List>
      </Collapse>
    </>
  );
}
