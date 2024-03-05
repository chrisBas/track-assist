import {
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
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
import { useWorkActivity } from "../hook/useWorkActivity";
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
  const [layout, setLayout] = useLocalStorage<string>(
    "time-tracker-layout",
    "ymd-aggregate"
  );
  const [datedTimeLogs, setDatedTimeLogs] = useLocalStorage<DatedTimeLogs[]>(
    "dated-time-logs",
    []
  );
  const { activities, addActivity, deleteActivity, updateActivity } =
    useWorkActivity();

  const datedTimeLogsByDate = activities.reduce(
    (map: Record<string, DatedTimeLogs>, activity) => {
      const date = dayjs(activity.start_time);
      const year = date.year();
      const month = date.month() + 1;
      const day = date.date();
      const startTime = date.format("HH:mm");
      const endTime = dayjs(activity.end_time).format("HH:mm");
      const key = `${year}-${month}-${day}`;
      if (map[key] == null) {
        map[key] = {
          year,
          month,
          day,
          week: date.diff(dayjs("1950-01-01"), "weeks"),
          timeLogs: [],
        };
      }
      map[key].timeLogs.push({
        id: `${activity.id}`,
        startTime,
        endTime,
        notes: activity.notes || "",
      });
      return map;
    },
    {}
  );

  // local
  // const datedTimeLogsByDate = datedTimeLogs.reduce(
  //   (map: Record<string, DatedTimeLogs>, datedTimeLog) => {
  //     map[`${datedTimeLog.year}-${datedTimeLog.month}-${datedTimeLog.day}`] =
  //       datedTimeLog;
  //     return map;
  //   },
  //   {}
  // );
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
    <Container>
      <Stack py="12px" direction="row" spacing={2} justifyContent="flex-end">
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="time-tracker-layout-label">Layout</InputLabel>
          <Select
            labelId="time-tracker-layout-label"
            label="Layout"
            value={layout}
            onChange={(e) => setLayout((_prev) => e.target.value)}
          >
            <MenuItem value="ymd-aggregate">
              Year, Month, Day Aggregate
            </MenuItem>
            <MenuItem value="week-aggregate">Week, Day Aggregate</MenuItem>
          </Select>
        </FormControl>
      </Stack>
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
              {layout === "ymd-aggregate" && (
                <>
                  <TableCell>Year</TableCell>
                  <TableCell>Month</TableCell>
                  <TableCell>Day</TableCell>
                </>
              )}
              {layout === "week-aggregate" && (
                <>
                  <TableCell>Week</TableCell>
                  <TableCell>Day</TableCell>
                </>
              )}
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
              aggregateKeys={
                layout === "ymd-aggregate"
                  ? ["year", "month", "day"]
                  : layout === "week-aggregate"
                  ? ["week", "day"]
                  : []
              }
              onUpdate={onUpdate}
              onCreate={onCreate}
              onDelete={onDelete}
            />
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

/* Week # is based on Sunday Jan 1st 1950 - this day was chose b/c Jan 1 fell on a Sunday (1st day of the week) */
function getLastDays(n: number, unit: dayjs.ManipulateType): DateItem[] {
  const now = dayjs();
  const endOfNextMonth = now.add(1, "month").endOf("month");
  const oldest = endOfNextMonth.subtract(n, unit);
  const dates = [oldest];
  const days = endOfNextMonth.diff(oldest, "day");

  for (let i = 1; i <= days; i++) {
    dates.push(oldest.add(i, "day"));
  }

  return dates.map((date) => {
    return {
      year: date.year(),
      month: date.month() + 1,
      week: date.diff(dayjs("1950-01-01"), "weeks"),
      day: date.date(),
    };
  });
}
