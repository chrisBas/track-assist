import { Add, MoreHoriz } from "@mui/icons-material";
import Delete from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import CommonAutocomplete from "../component/CommonAutocomplete";
import CommonModal from "../component/CommonModal";
import ConfirmDeleteModal from "../component/ConfirmDeleteModal";
import FabAdd from "../component/FabAdd";
import FlexEnd from "../component/FlexEnd";
import { useExercise } from "../hook/useExercise";
import { useFitnessLog } from "../hook/useFitnessLog";
import { FitnessSet, useFitnessSet } from "../hook/useFitnessSet";
import { SpecificRecord } from "../hook/useSupabaseData";

const COMMON_DATE_FORMAT = "YYYY-MM-DDTHH:mm:ss";

type FitnessLog = {
  id: number;
  datetime: Dayjs;
  exercise: string;
  sets: SpecificRecord<FitnessSet>[];
};

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
  const [selectedDate, setSelectedDate] = useState<string | null>(
    dayjs().format("YYYY-MM-DD")
  );
  const [addEditModalOpen, setAddEditModalOpen] = useState(false);
  const [fitnessLogItemId, setFitnessLogItemId] = useState<number | null>(null);
  const [datetime, setDatetime] = useState<Dayjs | null>(null);
  const [exercise, setExercise] = useState<string | null>(null);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState<{
    open: boolean;
    id: number | null;
  }>({ open: false, id: null });

  // local vars
  const isLoaded =
    isExercisesLoaded && isFitnessSetsLoaded && isFitnessLogsLoaded;
  const allFitnessLogs: FitnessLog[] = !isLoaded
    ? []
    : fitnessLogs.map((fl) => {
        const exercise = exercises.find((e) => e.id === fl.exercise_id)!;
        const sets = fitnessSets.filter((fs) => fs.fitness_log_id === fl.id);
        return {
          id: fl.id,
          datetime: dayjs(fl.datetime),
          exercise: exercise.exercise,
          sets,
        };
      });
  const fitnessLogsByDate = allFitnessLogs.reduce(
    (acc: Record<string, FitnessLog[]>, record) => {
      const date = record.datetime.format("YYYY-MM-DD");
      if (acc[date] === undefined) {
        acc[date] = [];
      }
      acc[date].push(record);
      return acc;
    },
    {}
  );
  const exerciseOptions = exercises.map((exercise) => ({
    label: exercise.exercise,
    value: exercise.exercise,
  }));
  const isExistingExercise = exercises.some((e) => e.exercise === exercise);
  const canAdd = exercise != null;

  // local fns
  const onReset = () => {
    setFitnessLogItemId(null);
    setDatetime(null);
    setExercise(null);
  };
  const onAdd = async () => {
    if (canAdd) {
      const exercise_id: number = !isExistingExercise
        ? (
            await addExercise({
              exercise: exercise,
              muscle_group: "legs",
              description: null,
              type: "weighted",
            })
          ).id
        : exercises.find((exer) => exer.exercise === exercise)!.id;
      if (fitnessLogItemId == null) {
        await addFitnessLog({
          exercise_id,
          datetime: (datetime || dayjs()).format(COMMON_DATE_FORMAT),
        });
      } else {
        updateFitnessLog({
          id: fitnessLogItemId,
          exercise_id,
          datetime: (datetime || dayjs()).format(COMMON_DATE_FORMAT),
        });
      }
    }
    onReset();
  };
  const onDelete = (id: number) => {
    deleteFitnessLog(id);
  };
  const onExerciseSelected = (exercise: string | null, isNew: boolean) => {
    setExercise(exercise);
  };
  const onEdit = (id: number) => {
    const record = fitnessLogs.find((record) => record.id === id);
    if (record) {
      setFitnessLogItemId(record.id);
      setExercise(exercises.find((e) => e.id === record.exercise_id)!.exercise);
      setDatetime(dayjs(record.datetime));
      setAddEditModalOpen(true);
    }
  };

  // TODO: show error message if operation fails.
  // FOR EXAMPLE: if an exercise has 1+ sets and the exercise is deleted, it fails (b/c reference)

  // TODO: Show distance aggregate

  // TODO: Don't save on each update to a set, save on "Save" button click

  return (
    <Box>
      {Object.entries(fitnessLogsByDate).map(([date, records]) => {
        return (
          <Accordion
            key={date}
            expanded={date === selectedDate}
            onChange={() => {
              setSelectedDate(date === selectedDate ? null : date);
            }}
            sx={{ "&.MuiPaper-root": { my: "1px" } }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                width="80%"
              >
                <Typography variant="body2" fontWeight={500}>
                  {date}
                </Typography>
                <Typography
                  variant="body2"
                  color="grey"
                  fontWeight={500}
                >{`0 miles`}</Typography>
                {/* TODO: change this to a distance aggregate, instead of "0 Miles" */}
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              {records.map((record, idx) => {
                return (
                  <Accordion
                    key={record.id}
                    sx={{
                      "&.MuiPaper-root": {
                        border: "none",
                        boxShadow: "none",
                        "&:before": {
                          height: 0,
                        },
                      },
                    }}
                  >
                    <AccordionSummary
                      sx={{
                        "&.MuiAccordionSummary-root": {
                          minHeight: "32px",
                          "&.Mui-expanded": {
                            minHeight: "32px",
                          },
                        },
                        ".MuiAccordionSummary-content": { my: "4px" },
                      }}
                    >
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ width: "100%" }}
                      >
                        <Stack direction="row" alignItems="center">
                          <ExpandMoreIcon />
                          <Typography variant="subtitle1" fontWeight={500}>
                            {record.exercise}
                          </Typography>
                        </Stack>
                        <Stack direction="row">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmDeleteModal({
                                id: record.id,
                                open: true,
                              });
                            }}
                          >
                            <Delete />
                          </IconButton>
                          <IconButton
                            size="small"
                            aria-label="edit"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(record.id);
                            }}
                          >
                            <MoreHoriz />
                          </IconButton>
                        </Stack>
                      </Stack>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container sx={{ py: 1 }} textAlign="center">
                        {record.sets.length > 0 && (
                          <Grid item xs={12}>
                            <Grid container>
                              <Grid item xs={2}>
                                Set
                              </Grid>
                              <Grid item xs={4}>
                                Reps
                              </Grid>
                              <Grid item xs={4}>
                                Lbs
                              </Grid>
                              <Grid item xs={2}></Grid>
                            </Grid>
                          </Grid>
                        )}
                        {record.sets.map((set, idx) => {
                          return (
                            <Grid key={set.id} item xs={12}>
                              <Grid container alignItems="center">
                                <Grid item xs={2}>
                                  {idx + 1}
                                </Grid>
                                <Grid item xs={4}>
                                  <TextField
                                    size="small"
                                    value={set.reps}
                                    onChange={(e) => {
                                      const reps =
                                        e.target.value === ""
                                          ? 0
                                          : parseFloat(e.target.value);
                                      updateFitnessSet({
                                        id: set.id,
                                        reps,
                                        weight: set.weight,
                                        fitness_log_id: set.fitness_log_id,
                                        distance: null,
                                      });
                                    }}
                                    sx={{ mx: 3 }}
                                  />
                                </Grid>
                                <Grid item xs={4}>
                                  <TextField
                                    size="small"
                                    value={set.weight || ""}
                                    onChange={(e) => {
                                      const weight =
                                        e.target.value === ""
                                          ? undefined
                                          : parseFloat(e.target.value);
                                      updateFitnessSet({
                                        id: set.id,
                                        reps: set.reps,
                                        weight:
                                          weight === undefined ? null : weight,
                                        fitness_log_id: set.fitness_log_id,
                                        distance: null,
                                      });
                                    }}
                                    sx={{ mx: 3 }}
                                  />
                                </Grid>
                                <Grid item xs={2}>
                                  <IconButton
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteFitnessSet(set.id);
                                    }}
                                  >
                                    <Delete />
                                  </IconButton>
                                </Grid>
                              </Grid>
                            </Grid>
                          );
                        })}
                      </Grid>
                      <FlexEnd>
                        <Button
                          size="small"
                          startIcon={<Add />}
                          variant="outlined"
                          color="inherit"
                          onClick={(e) => {
                            e.stopPropagation();
                            addFitnessSet({
                              fitness_log_id: record.id,
                              reps: 0,
                              weight: null,
                              distance: null,
                            });
                          }}
                        >
                          Add Set
                        </Button>
                      </FlexEnd>
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            </AccordionDetails>
          </Accordion>
        );
      })}
      <ConfirmDeleteModal
        open={confirmDeleteModal.open}
        onClose={() => {
          setConfirmDeleteModal({ id: null, open: false });
        }}
        onDelete={() => {
          onDelete(confirmDeleteModal.id!);
          setConfirmDeleteModal({ id: null, open: false });
        }}
      />
      <CommonModal
        open={addEditModalOpen}
        onClose={() => {
          onReset();
          setAddEditModalOpen(false);
        }}
        title={`${fitnessLogItemId == null ? "Add" : "Update"} Record`}
      >
        <Stack direction="column" spacing={2}>
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
          <Stack
            direction="row"
            spacing={1}
            justifyContent="flex-end"
            sx={{ pt: 0.5 }}
          ></Stack>
          <FlexEnd>
            <Button
              variant="contained"
              color="success"
              onClick={() => {
                onAdd();
                setAddEditModalOpen(false);
              }}
              disabled={!canAdd}
            >
              Save
            </Button>
          </FlexEnd>
        </Stack>
      </CommonModal>
      <FabAdd
        onClick={() => {
          setAddEditModalOpen(true);
        }}
      />
    </Box>
  );
}
