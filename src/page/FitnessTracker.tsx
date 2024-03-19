import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import CommonAutocomplete from "../component/CommonAutocomplete";
import CommonCard from "../component/CommonCard";
import CommonModal from "../component/CommonModal";
import ConfirmDeleteModal from "../component/ConfirmDeleteModal";
import FabAdd from "../component/FabAdd";
import FlexEnd from "../component/FlexEnd";
import { useExercise } from "../hook/useExercise";
import { useFitnessLog } from "../hook/useFitnessLog";
import { FitnessSet, useFitnessSet } from "../hook/useFitnessSet";
import { SpecificRecord } from "../hook/useSupabaseData";

const COMMON_DATE_FORMAT = "YYYY-MM-DDTHH:mm:ss";
const TIME_FORMAT = "HH:mm";

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
  const [sets, setSets] = useState<
    { id?: number; reps: number | null; weight: number | null }[]
  >([{ reps: null, weight: null }]);
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
  const canAdd =
    exercise != null &&
    sets.length > 0 &&
    !sets.some((set) => set.reps === null);

  // local fns
  const onReset = () => {
    setFitnessLogItemId(null);
    setDatetime(null);
    setExercise(null);
    setSets([{ reps: null, weight: null }]);
  };
  const onAdd = async () => {
    if (canAdd) {
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
  const onDelete = (id: number) => {
    deleteFitnessLog(id);
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
  const onEdit = (id: number) => {
    const record = fitnessLogs.find((record) => record.id === id);
    if (record) {
      setFitnessLogItemId(record.id);
      setExercise(exercises.find((e) => e.id === record.exercise_id)!.exercise);
      setDatetime(dayjs(record.datetime));
      const sets = fitnessSets.filter((fs) => fs.fitness_log_id === record.id);
      setSets(
        sets.map((set) => ({
          id: set.id,
          reps: set.reps,
          weight: set.weight || null,
        }))
      );

      setAddEditModalOpen(true);
    }
  };

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
                  <CommonCard
                    key={record.id}
                    title={record.exercise}
                    subtitle={record.datetime.format(TIME_FORMAT)}
                    subinfo={`[${record.sets
                      .map((set) => set.reps)
                      .join(", ")}]`}
                    sx={{
                      mt: idx === 0 ? 0 : 2,
                      mb: idx === records.length - 1 ? 0 : 2,
                    }}
                    onSelect={() => {
                      onEdit(record.id);
                    }}
                    onDelete={() => {
                      setConfirmDeleteModal({
                        id: record.id,
                        open: true,
                      });
                    }}
                  />
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
                      e.target.value === "" ? null : parseFloat(e.target.value);
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
                      e.target.value === "" ? null : parseFloat(e.target.value);
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
