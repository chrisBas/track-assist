import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
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
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  TableCell as UnstyledCell,
  styled,
  tableCellClasses,
} from "@mui/material";
import { TimeField } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useState } from "react";
import useLocalStorage from "../hook/useLocalStorage";

const AGGREGATE_KEYS: (keyof DateItem)[] = ["year", "month", "day"];
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
const DISPLAY_DATES = getLastDays(3, "years");

interface TimeLog {
  id: string;
  startTime: string;
  endTime: string;
  notes: string;
}

interface DateItem {
  year: number;
  month: number;
  day: number;
}

interface DatedTimeLogs extends DateItem {
  timeLogs: TimeLog[];
}

const TableCell = styled(UnstyledCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: "14px",
  },
}));

export default function TimeTracker() {
  // state
  const [datedTimeLogs, setDatedTimeLogs] = useLocalStorage<DatedTimeLogs[]>(
    "dated-time-logs",
    []
  );

  // local
  const datedTimeLogsByDate = datedTimeLogs.reduce(
    (map: Record<string, DatedTimeLogs>, datedTimeLog) => {
      map[`${datedTimeLog.year}-${datedTimeLog.month}-${datedTimeLog.day}`] =
        datedTimeLog;
      return map;
    },
    {}
  );
  const datesWithTimeLogs: DatedTimeLogs[] = [];
  DISPLAY_DATES.forEach((date) => {
    datesWithTimeLogs.push({
      ...date,
      timeLogs:
        datedTimeLogsByDate[`${date.year}-${date.month}-${date.day}`]
          ?.timeLogs || [],
    });
  });
  const onUpdate = (date: DateItem, timeLog: TimeLog) => {
    setDatedTimeLogs((prev) => {
      return prev.map((item) => {
        if (
          item.year === date.year &&
          item.month === date.month &&
          item.day === date.day
        ) {
          return {
            ...item,
            timeLogs: item.timeLogs.map((timeLogItem) => {
              return timeLog.id === timeLogItem.id ? timeLog : timeLogItem;
            }),
          };
        }
        return item;
      });
    });
  };
  const onCreate = (date: DateItem, timeLog: TimeLog) => {
    setDatedTimeLogs((prev) => {
      let found = false;
      const updatedLogs: DatedTimeLogs[] = [];

      for (const item of prev) {
        if (
          item.year === date.year &&
          item.month === date.month &&
          item.day === date.day
        ) {
          found = true;
          updatedLogs.push({
            ...item,
            timeLogs: [
              ...item.timeLogs,
              {
                ...timeLog,
                id: `${Math.floor(Math.random() * 1000000000000)}`,
              },
            ],
          });
          break;
        } else {
          updatedLogs.push(item);
        }
      }
      if (!found) {
        updatedLogs.push({
          ...date,
          timeLogs: [
            { ...timeLog, id: `${Math.floor(Math.random() * 1000000000000)}` },
          ],
        });
      }

      return updatedLogs;
    });
  };

  const onDelete = (date: DateItem, id: string) => {
    setDatedTimeLogs((prev) => {
      return prev.map((item) => {
        if (
          item.year === date.year &&
          item.month === date.month &&
          item.day === date.day
        ) {
          return {
            ...item,
            timeLogs: item.timeLogs.filter((timeLog) => timeLog.id !== id),
          };
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
          <Rows
            datedTimeLogs={datesWithTimeLogs}
            aggregateKey="year"
            onUpdate={onUpdate}
            onCreate={onCreate}
            onDelete={onDelete}
          />
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function Rows({
  datedTimeLogs,
  aggregateKey,
  onUpdate,
  onCreate,
  onDelete,
}: {
  datedTimeLogs: DatedTimeLogs[];
  aggregateKey?: keyof DateItem;
  onUpdate: (date: DateItem, timeLog: TimeLog) => void;
  onCreate: (date: DateItem, timeLog: TimeLog) => void;
  onDelete: (date: DateItem, id: string) => void;
}) {
  if (aggregateKey === undefined) {
    return (
      <>
        {datedTimeLogs.map((datedTimeLog, idx) => {
          return (
            <Row
              key={idx}
              datedTimeLog={datedTimeLog}
              nestedRows={[]}
              aggregateKey={aggregateKey}
              onUpdate={onUpdate}
              onCreate={onCreate}
              onDelete={onDelete}
            />
          );
        })}
      </>
    );
  }

  const aggregate = datedTimeLogs.reduce(
    (map: Record<string, DatedTimeLogs[]>, record) => {
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
          const datedTimeLogs = aggregate[key];
          const totalMins = datedTimeLogs.reduce((total, datedTimeLog) => {
            return (
              total +
              datedTimeLog.timeLogs.reduce((totalMins, timeLog) => {
                return (
                  totalMins +
                  dayjs(timeLog.endTime, "HH:mm").diff(
                    dayjs(timeLog.startTime, "HH:mm"),
                    "minutes"
                  )
                );
              }, 0)
            );
          }, 0);
          const hours = Math.floor(totalMins / 60);
          const mins = totalMins % 60;
          const time = `${hours < 10 ? `0${hours}` : hours}:${
            mins < 10 ? `0${mins}` : mins
          }`;

          return (
            <Row
              key={key}
              datedTimeLog={{
                [aggregateKey]: convertTypeOnAggregate(key, aggregateKey),
              }}
              timeAggregate={time}
              nestedRows={datedTimeLogs}
              aggregateKey={aggregateKey}
              onUpdate={onUpdate}
              onCreate={onCreate}
              onDelete={onDelete}
            />
          );
        })}
    </>
  );
}

function Row({
  datedTimeLog,
  nestedRows,
  timeAggregate,
  aggregateKey,
  onUpdate,
  onCreate,
  onDelete,
}: {
  datedTimeLog: Partial<DatedTimeLogs>;
  nestedRows: DatedTimeLogs[];
  timeAggregate?: string;
  aggregateKey?: keyof DateItem;
  onUpdate: (date: DateItem, timeLog: TimeLog) => void;
  onCreate: (date: DateItem, timeLog: TimeLog) => void;
  onDelete: (date: DateItem, id: string) => void;
}) {
  const [open, setOpen] = useState(isCurrentDate(datedTimeLog, aggregateKey));
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
        <TableCell>{aggregateKey === "year" && datedTimeLog.year}</TableCell>
        <TableCell>
          {aggregateKey === "month" &&
            (datedTimeLog.month === undefined
              ? undefined
              : MONTHS[datedTimeLog.month - 1])}
        </TableCell>
        <TableCell>{aggregateKey === "day" && datedTimeLog.day}</TableCell>
        {collapsable && <TableCell>{timeAggregate}</TableCell>}
        <TableCell style={{ padding: 0 }} colSpan={collapsable ? 4 : 5}>
          {!collapsable && (
            <Table
              sx={{ tableLayout: "fixed" }}
              size="small"
              aria-label="time-logs"
            >
              <TableBody>
                {datedTimeLog.timeLogs?.map((timeLog) => {
                  return (
                    <TimeLogRow
                      key={timeLog.id}
                      timeLog={timeLog}
                      onSave={(timeLog) =>
                        onUpdate(datedTimeLog as DateItem, timeLog as TimeLog)
                      }
                      onDelete={(id) => onDelete(datedTimeLog as DateItem, id)}
                    />
                  );
                })}
                <TimeLogRow
                  timeLog={{}}
                  onSave={(timeLog) =>
                    onCreate(datedTimeLog as DateItem, timeLog as TimeLog)
                  }
                />
              </TableBody>
            </Table>
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
                    datedTimeLogs={nestedRows}
                    aggregateKey={
                      AGGREGATE_KEYS[AGGREGATE_KEYS.indexOf(aggregateKey) + 1]
                    }
                    onUpdate={onUpdate}
                    onCreate={onCreate}
                    onDelete={onDelete}
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

function TimeLogRow({
  timeLog: defaultTimeLog,
  onSave,
  onDelete,
}: {
  timeLog: Partial<TimeLog>;
  onSave: (timeLog: Partial<TimeLog>) => void;
  onDelete?: (id: string) => void;
}) {
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

  return (
    <TableRow>
      <TableCell style={{ border: 0 }}>{time}</TableCell>
      <TableCell style={{ border: 0 }}>
        <TimeField
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
              onSave(timeLog);
              if (timeLog.id === undefined) {
                setTimeLog(defaultTimeLog);
              }
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

function getLastDays(n: number, unit: dayjs.ManipulateType): DateItem[] {
  const now = dayjs();
  const oldest = now.subtract(n, unit);
  const dates = [oldest];
  const days = now.diff(oldest, "day");

  for (let i = 1; i <= days; i++) {
    dates.push(oldest.add(i, "day"));
  }
  return dates.map((date) => {
    return {
      year: date.year(),
      month: date.month() + 1,
      day: date.date(),
    };
  });
}

function sortAggregate(
  a: string,
  b: string,
  aggregateKey: keyof DateItem
): number {
  if (aggregateKey === "year") {
    return Number(b) - Number(a);
  }
  if (aggregateKey === "month") {
    return Number(b) - Number(a);
  }
  return Number(b) - Number(a);
}

function convertTypeOnAggregate(
  value: string,
  aggregateKey: keyof DateItem
): number | string {
  if (aggregateKey === "year") {
    return Number(value);
  }
  if (aggregateKey === "month") {
    return Number(value);
  }
  if (aggregateKey === "day") {
    return Number(value);
  }
  return value;
}

function isCurrentDate(record: Partial<DateItem>, timeUnit?: keyof DateItem) {
  const now = dayjs();
  if (timeUnit === "year") {
    return record.year === now.year();
  }
  if (timeUnit === "month") {
    return record.month === now.month() + 1;
  }
  if (timeUnit === "day") {
    return record.day === now.date();
  }
  return false;
}
