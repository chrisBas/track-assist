import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import SaveIcon from "@mui/icons-material/Save";

import {
  IconButton,
  Stack,
  TableCell,
  TableRow,
  TextField,
} from "@mui/material";
import { TimeField } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { TimeLog } from "../../type/DateTimeLogs";

export function TimeLogRow({
  timeLog: defaultTimeLog,
  onSave: onSaveDefault,
  onDelete,
}: {
  timeLog: Partial<TimeLog>;
  onSave: (timeLog: Partial<TimeLog>) => void;
  onDelete?: (id: string) => void;
}) {
  const startTimeFieldRef = useRef<HTMLDivElement | null>(null);
  const hasFocussed = useRef(false);
  const [timeLog, setTimeLog] = useState(defaultTimeLog);
  const modified = JSON.stringify(timeLog) !== JSON.stringify(defaultTimeLog);
  const totalMins =
    timeLog.endTime && timeLog.startTime
      ? dayjs(timeLog.endTime, "HH:mm").diff(
          dayjs(timeLog.startTime, "HH:mm"),
          "minutes"
        )
      : 0;
  const hours = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  const time = `${hours < 10 ? `0${hours}` : hours}:${
    mins < 10 ? `0${mins}` : mins
  }`;
  const onSave = () => {
    onSaveDefault(timeLog);
    if (timeLog.id === undefined) {
      setTimeLog(defaultTimeLog);
      hasFocussed.current = false;
    }
  };

  useEffect(() => {
    if (timeLog.id === undefined && !hasFocussed.current) {
      hasFocussed.current = true;
      startTimeFieldRef.current?.focus();
    }
  }, [timeLog]);

  return (
    <TableRow>
      <TableCell style={{ border: 0 }}>{time}</TableCell>
      <TableCell style={{ border: 0 }}>
        <TimeField
          inputRef={startTimeFieldRef}
          value={
            timeLog.startTime === undefined
              ? null
              : dayjs(timeLog.startTime, "HH:mm")
          }
          onChange={(value) => {
            setTimeLog((prev) => {
              return {
                ...prev,
                startTime: value === null ? undefined : value.format("HH:mm"),
              };
            });
          }}
          variant="standard"
        />
      </TableCell>
      <TableCell style={{ border: 0 }}>
        <TimeField
          value={
            timeLog.endTime === undefined
              ? null
              : dayjs(timeLog.endTime, "HH:mm")
          }
          onChange={(value) => {
            setTimeLog((prev) => {
              return {
                ...prev,
                endTime: value === null ? undefined : value.format("HH:mm"),
              };
            });
          }}
          variant="standard"
        />
      </TableCell>
      <TableCell style={{ border: 0 }}>
        <TextField
          placeholder="notes..."
          value={timeLog.notes === undefined ? "" : timeLog.notes}
          onChange={(e) => {
            setTimeLog((prev) => {
              return {
                ...prev,
                notes: e.target.value,
              };
            });
          }}
          variant="standard"
        />
      </TableCell>
      <TableCell style={{ border: 0 }}>
        <Stack direction="row">
          <IconButton
            disabled={!modified}
            aria-label="save"
            onClick={() => {
              onSave();
            }}
          >
            <SaveIcon color={modified ? "info" : "disabled"} />
          </IconButton>
          <IconButton
            disabled={!modified}
            aria-label="reset"
            onClick={() => {
              setTimeLog(defaultTimeLog);
            }}
          >
            <RefreshIcon color={modified ? "warning" : "disabled"} />
          </IconButton>
          {onDelete && (
            <IconButton
              color="error"
              aria-label="delete"
              onClick={() => {
                onDelete(timeLog.id!);
              }}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </Stack>
      </TableCell>
    </TableRow>
  );
}
