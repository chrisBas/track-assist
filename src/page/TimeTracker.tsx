import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from "@mui/icons-material/Remove";
import SaveIcon from "@mui/icons-material/Save";

import {
  Collapse,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { TimeField } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useState } from "react";

const AGGREGATE_KEYS: (keyof TimeRecord)[] = ["year", "month", "day"];
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

interface TimeRecord {
  id: string;
  year: number;
  month: number;
  day: number;
  startTime: string;
  endTime: string;
  notes: string;
}

interface ExtendedTimeRecord extends TimeRecord {
  time?: string;
}

export default function TimeTracker() {
  const [rows, setRows] = useState(getLastDays(3, "years"));
  const onUpdate = (record: TimeRecord) => {
    setRows((prev) => {
      return prev.map((item) => {
        if (item.id === record.id) {
          return record;
        }
        return item;
      });
    });
  };

  return (
    <TableContainer component={Paper}>
      <Table
        aria-label="time-tracker-table"
        size="small"
        sx={{ tableLayout: "fixed" }}
      >
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Year</TableCell>
            <TableCell>Month</TableCell>
            <TableCell>Day</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Start</TableCell>
            <TableCell>End</TableCell>
            <TableCell>Notes</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <Rows rows={rows} aggregateKey="year" onUpdate={onUpdate} />
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function Rows({
  rows,
  aggregateKey,
  onUpdate,
}: {
  rows: ExtendedTimeRecord[];
  aggregateKey?: keyof TimeRecord;
  onUpdate: (record: TimeRecord) => void;
}) {
  if (aggregateKey === undefined) {
    return (
      <>
        {rows.map((record) => {
          const totalMins = dayjs(record.endTime, "HH:mm").diff(
            dayjs(record.startTime, "HH:mm"),
            "minutes"
          );
          const hours = Math.floor(totalMins / 60);
          const mins = totalMins % 60;
          const time = `${hours < 10 ? `0${hours}` : hours}:${
            mins < 10 ? `0${mins}` : mins
          }`;

          return (
            <Row
              key={record.id}
              row={{ ...record, time }}
              nestedRows={[]}
              aggregateKey={aggregateKey}
              onUpdate={onUpdate}
            />
          );
        })}
      </>
    );
  }

  const aggregate = rows.reduce(
    (map: Record<string, ExtendedTimeRecord[]>, record) => {
      const key = record[aggregateKey]!;
      map[key] = map[key] || [];
      map[key].push(record);
      return map;
    },
    {}
  );

  return (
    <>
      {Object.keys(aggregate)
        .sort((a, b) => sortAggregate(a, b, aggregateKey))
        .map((key) => {
          const records = aggregate[key];
          const totalMins = records.reduce((total, record) => {
            total += dayjs(record.endTime, "HH:mm").diff(
              dayjs(record.startTime, "HH:mm"),
              "minutes"
            );
            return total;
          }, 0);
          const hours = Math.floor(totalMins / 60);
          const mins = totalMins % 60;
          const time = `${hours < 10 ? `0${hours}` : hours}:${
            mins < 10 ? `0${mins}` : mins
          }`;

          return (
            <Row
              key={key}
              row={{ [aggregateKey]: key, time }}
              nestedRows={records}
              aggregateKey={aggregateKey}
              onUpdate={onUpdate}
            />
          );
        })}
    </>
  );
}

function Row({
  row,
  nestedRows,
  aggregateKey,
  onUpdate,
}: {
  row: Partial<ExtendedTimeRecord>;
  nestedRows: ExtendedTimeRecord[];
  aggregateKey?: keyof TimeRecord;
  onUpdate: (record: TimeRecord) => void;
}) {
  const [open, setOpen] = useState(false);
  const [localRecord, setLocalRecord] = useState(row);
  const collapsable = aggregateKey !== undefined;

  return (
    <>
      <TableRow
        hover={collapsable}
        sx={{
          backgroundColor: collapsable ? "#fbfbfb" : undefined,
          "& > *": {
            color: open
              ? "rgba(0,0,0,0.2)"
              : collapsable
              ? "rgba(0,0,0,0.5)"
              : undefined,
          },
        }}
        onClick={() => collapsable && setOpen(!open)}
      >
        <TableCell>
          {collapsable && (open ? <RemoveIcon /> : <AddIcon />)}
        </TableCell>
        <TableCell>{aggregateKey === "year" && row.year}</TableCell>
        <TableCell>
          {aggregateKey === "month" &&
            (row.month === undefined ? undefined : MONTHS[row.month - 1])}
        </TableCell>
        <TableCell>{aggregateKey === "day" && row.day}</TableCell>
        <TableCell>{row.time}</TableCell>
        <TableCell>
          {!collapsable && (
            <TimeField
              value={dayjs(localRecord.startTime, "HH:mm")}
              onChange={(value) => {
                setLocalRecord((prev) => {
                  return {
                    ...prev,
                    startTime:
                      value === null ? undefined : value.format("HH:mm"),
                  };
                });
              }}
              variant="standard"
            />
          )}
        </TableCell>
        <TableCell>
          {!collapsable && (
            <TimeField
              value={dayjs(localRecord.endTime, "HH:mm")}
              onChange={(value) => {
                setLocalRecord((prev) => {
                  return {
                    ...prev,
                    endTime: value === null ? undefined : value.format("HH:mm"),
                  };
                });
              }}
              variant="standard"
            />
          )}
        </TableCell>
        <TableCell>
          {!collapsable && (
            <TextField
              value={localRecord.notes}
              onChange={(e) => {
                setLocalRecord((prev) => {
                  return {
                    ...prev,
                    notes: e.currentTarget.value,
                  };
                });
              }}
              variant="standard"
            />
          )}
        </TableCell>
        <TableCell>
          {!collapsable && (
            <Stack direction="row">
              <IconButton
                aria-label="save"
                onClick={() => {
                  onUpdate(localRecord as TimeRecord);
                }}
              >
                <SaveIcon color="info" />
              </IconButton>
              <IconButton color="error" aria-label="delete">
                <DeleteIcon />
              </IconButton>
            </Stack>
          )}
        </TableCell>
      </TableRow>
      {collapsable && (
        <TableRow>
          <TableCell style={{ padding: 0, border: 0 }} colSpan={9}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Table
                sx={{ tableLayout: "fixed" }}
                size="small"
                aria-label={
                  AGGREGATE_KEYS[AGGREGATE_KEYS.indexOf(aggregateKey) + 1]
                }
              >
                <TableBody>
                  <Rows
                    rows={nestedRows}
                    aggregateKey={
                      AGGREGATE_KEYS[AGGREGATE_KEYS.indexOf(aggregateKey) + 1]
                    }
                    onUpdate={onUpdate}
                  />
                </TableBody>
              </Table>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

function getLastDays(n: number, unit: dayjs.ManipulateType) {
  const now = dayjs();
  const oldest = now.subtract(n, unit);
  const dates = [oldest];
  const days = now.diff(oldest, "day");

  for (let i = 1; i <= days; i++) {
    dates.push(oldest.add(i, "day"));
  }
  return dates.map((date) => {
    return {
      id: `${Math.floor(Math.random() * 1000000000000000)}`,
      year: date.year(),
      month: date.month() + 1,
      day: date.date(),
      startTime: "9:00",
      endTime: "17:00",
      notes: "Worked on project",
    };
  });
}

function sortAggregate(
  a: string,
  b: string,
  aggregateKey: keyof TimeRecord
): number {
  if (aggregateKey === "year") {
    return Number(b) - Number(a);
  }
  if (aggregateKey === "month") {
    return Number(b) - Number(a);
  }
  return Number(b) - Number(a);
}
