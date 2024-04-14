import { Button, Stack, TextField } from "@mui/material";
import { useState } from "react";
import useActiveApp from "../../common/hooks/useActiveApp";
import { useGroups } from "../../profile/hooks/useGroups";
import { useTasks } from "../hooks/useTasks";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import CommonAutocomplete from "../../common/components/CommonAutocomplete";
import { useTaskGroups } from "../hooks/useTaskGroups";

export default function TodoCreation() {
  // global state
  const { setActiveApp, goBack } = useActiveApp();
  const { add: createTask } = useTasks();
  const { items: groups } = useGroups();
  const { add: createTaskGroup } = useTaskGroups();

  // local state
  const [form, setForm] = useState<
    Record<
      string,
      {
        value: string | null | Dayjs;
        error: boolean;
        helperText: string;
        required: boolean;
      }
    >
  >({
    label: {
      value: "",
      error: false,
      helperText: "",
      required: true,
    },
    due_date: {
        value: null,
        error: false,
        helperText: "",
        required: false,
    },
    notes: {
        value: "",
        error: false,
        helperText: "",
        required: false,
    },
    group: {
        value: null,
        error: false,
        helperText: "",
        required: false,
    },
  });

  // local vars
  const validateForm = () => {
    if (form.group.value === "") {
      setForm((prev) => {
        return {
          ...prev,
          label: {
            ...form.label,
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
      <TextField
        label="Label"
        size="small"
        {...form.label}
        onChange={(e) => {
          setForm((prev) => {
            return {
              ...prev,
              label: {
                ...form.label,
                value: e.target.value,
                error: false,
                helperText: "",
              },
            };
          });
        }}
        error={form.label.error}
        helperText={form.label.helperText}
      />
        <CommonAutocomplete
            value={form.group.value as string || null}
            options={groups.map(group => ({value: group.group_name, label: group.group_name}))}
            onSelect={(val) => {
                setForm((prev) => {
                    return {
                        ...prev,
                        group: {
                            ...form.group,
                            value: val,
                            error: false,
                            helperText: "",
                        },
                    };
                });
            }}
            label="Group"
            size="small"
            error={form.group.error}
            helperText={form.group.helperText}
      />
      <DateTimePicker
        slotProps={{
          textField: {
            size: "small",
            error: form.due_date.error,
            helperText: form.due_date.helperText,
          },
        }}
        sx={{ width: "100%" }}
        value={form.due_date.value === null ? null : dayjs(form.due_date.value)}
        onChange={(value) => {
            setForm((prev) => {
                return {
                  ...prev,
                  due_date: {
                    ...form.label,
                    value: value,
                    error: false,
                    helperText: "",
                  },
                };
              });
        }}
      />
      <TextField
        label="Notes"
        size="small"
        {...form.notes}
        onChange={(e) => {
          setForm((prev) => {
            return {
              ...prev,
              notes: {
                ...form.notes,
                value: e.target.value,
                error: false,
                helperText: "",
              },
            };
          });
        }}
        error={form.notes.error}
        helperText={form.notes.helperText}
      />
      <Stack direction="row" spacing={1} justifyContent="center">
        <Button
          color="primary"
          variant="outlined"
          fullWidth
          onClick={() => {
            if (validateForm()) {
                createTask({
                    label: form.label.value as string,
                    due_date: (form.due_date.value as Dayjs | null)?.format("YYYY-MM-DDTHH:mm:ss") || null,
                    notes: form.notes.value as string || null,
                    is_complete: false,
                }).then((task) => {
                    if(form.group.value === null) {
                        setActiveApp((prev) => ({
                            ...prev,
                            page: "Group Assign",
                        }));
                    } else {
                        createTaskGroup({
                            task_id: task.id,
                            group_id: groups.find(group => group.group_name === form.group.value)!.id,
                        }).then(() => {
                            setActiveApp((prev) => ({
                                ...prev,
                                page: "Group Assign",
                            }));
                        })
                    }
                })
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
