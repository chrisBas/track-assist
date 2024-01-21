import {
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell as UnstyledCell,
  styled,
  tableCellClasses,
} from "@mui/material";
import dayjs from "dayjs";
import { Rows } from "../component/time-tracker/Rows";
import useLocalStorage from "../hook/useLocalStorage";
import { DateItem, DatedTimeLogs, TimeLog } from "../type/DateTimeLogs";

const DISPLAY_DATES = getLastDays(3, "years");

const TableCell = styled(UnstyledCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#283852",
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
    <TableContainer component={Paper} sx={{ maxHeight: "800px" }}>
      <Table
        aria-label="time-tracker-table"
        size="small"
        sx={{ tableLayout: "fixed" }}
        stickyHeader
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
