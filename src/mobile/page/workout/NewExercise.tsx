import {
    Button,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
} from "@mui/material";
import { useState } from "react";
import useActiveApp from "../../../hook/useActiveApp";
import { useExercise } from "../../../hook/useExercise";
import { useFitnessLog } from "../../../hook/useFitnessLog";
import { useFitnessStore } from "../../../store/useFitnessStore";
import { toDatetimeString } from "../../../util/date-utils";

const MUSCLE_GROUPS = [
  "back",
  "legs",
  "shoulders",
  "chest",
  "bicep",
  "tricep",
] as const;

export default function NewExercise() {
  // global state
  const exercise = useFitnessStore((state) => state.exercise);
  const datetime = useFitnessStore((state) => state.datetime);
  const { add: createNewExercise } = useExercise();
  const { add: createNewFitnessLog } = useFitnessLog();
  const { setActiveApp, goBack } = useActiveApp();

  // local state
  const [form, setForm] = useState<
    Record<
      string,
      {
        value: string;
        error: boolean;
        helperText: string;
        required: boolean;
      }
    >
  >({
    description: {
      value: "",
      error: false,
      helperText: "",
      required: false,
    },
    muscleGroup: {
      value: "",
      error: false,
      helperText: "",
      required: true,
    },
  });
  const validateForm = () => {
    if (form.muscleGroup.value === "") {
      setForm((prev) => {
        return {
          ...prev,
          muscleGroup: {
            ...form.muscleGroup,
            error: true,
            helperText: "Required",
          },
        };
      });
      return false;
    }
    return true;
  };

  return (
    <Stack px={1} py={2} spacing={1}>
      <TextField label="Exercise" size="small" value={exercise} disabled />
      <TextField
        label="Description"
        size="small"
        {...form.description}
        onChange={(e) => {
          setForm((prev) => {
            return {
              ...prev,
              description: {
                ...form.description,
                value: e.target.value,
                error: false,
                helperText: "",
              },
            };
          });
        }}
      />
      <FormControl error={form.muscleGroup.error}>
        <InputLabel id="muscle-group" size="small">
          Muscle Group
        </InputLabel>
        <Select
          labelId="muscle-group"
          label="Muscle Group"
          size="small"
          value={form.muscleGroup.value}
          error={form.muscleGroup.error}
          required={form.muscleGroup.required}
          onChange={(e) => {
            setForm((prev) => {
              return {
                ...prev,
                muscleGroup: {
                  ...form.muscleGroup,
                  value: e.target.value,
                  error: false,
                  helperText: "",
                },
              };
            });
          }}
        >
          {MUSCLE_GROUPS.map((mg) => {
            return (
              <MenuItem key={mg} value={mg}>
                {mg}
              </MenuItem>
            );
          })}
        </Select>
        {form.muscleGroup.helperText && (
          <FormHelperText>{form.muscleGroup.helperText}</FormHelperText>
        )}
      </FormControl>
      <Stack direction="row" spacing={1} justifyContent="center">
        <Button
          color="primary"
          variant="outlined"
          fullWidth
          onClick={() => {
            if (validateForm()) {
              createNewExercise({
                exercise,
                description: form.description.value,
                muscle_group: form.muscleGroup.value,
              }).then((exercise) => {
                createNewFitnessLog({
                  datetime: toDatetimeString(datetime),
                  exercise_id: exercise.id,
                }).then(() => {
                  setActiveApp((prev) => ({
                    ...prev,
                    page: "Workout Tracker",
                  }));
                });
              });
            }
          }}
        >
          Create
        </Button>
        <Button
          color="warning"
          variant="outlined"
          fullWidth
          onClick={() => {
            goBack();
          }}
        >
          Cancel
        </Button>
      </Stack>
    </Stack>
  );
}
