import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import {
  Collapse,
  Table,
  TableBody,
  TableRow,
  TableCell as UnstyledCell,
  styled,
  tableCellClasses,
} from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";
import { DateItem, DatedTimeLogs, TimeLog } from "../../type/DateTimeLogs";
import { Rows } from "./Rows";
import { TimeLogRow } from "./TimeLogRow";

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
const DAY_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const TableCell = styled(UnstyledCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#283852",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: "14px",
  },
}));

export function Row({
  datedTimeLog,
  nestedRows,
  timeAggregate,
  aggregateKeys,
  activeAggregateIdx = 0,
  onUpdate,
  onCreate,
  onDelete,
}: {
  datedTimeLog: Partial<DatedTimeLogs>;
  nestedRows: DatedTimeLogs[];
  timeAggregate?: string;
  aggregateKeys: (keyof DateItem)[];
  activeAggregateIdx?: number;
  onUpdate: (date: DateItem, timeLog: TimeLog) => void;
  onCreate: (date: DateItem, timeLog: TimeLog) => void;
  onDelete: (date: DateItem, id: string) => void;
}) {
  const aggregateKey = aggregateKeys[activeAggregateIdx];
  const [open, setOpen] = useState(isCurrentDate(datedTimeLog, aggregateKey));
  const collapsable = aggregateKey !== undefined;
  const dayOfWeek =
    aggregateKey === "day"
      ? datedTimeLog.month !== undefined
        ? dayjs(
            `${datedTimeLog.year}-${datedTimeLog.month}-${datedTimeLog.day}`
          ).day()
        : datedTimeLog.week !== undefined
        ? datedTimeLog.day! -
          parseInt(
            dayjs("1950-01-01").add(datedTimeLog.week!, "week").format("DD")
          )
        : undefined
      : undefined;
  const isWeekday = dayOfWeek !== undefined && dayOfWeek > 0 && dayOfWeek < 6;

  return (
    <>
      <TableRow
        hover={collapsable}
        sx={{
          backgroundColor: isWeekday
            ? "#e3eeff"
            : collapsable
            ? "#fbfbfb"
            : undefined,
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
        {aggregateKeys.map((aggregateKey, idx) => {
          return (
            <TableCell key={idx}>
              {activeAggregateIdx === idx && format(datedTimeLog, aggregateKey)}
            </TableCell>
          );
        })}
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
          <TableCell
            style={{ padding: 0, border: 0 }}
            colSpan={6 + aggregateKeys.length}
          >
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Table sx={{ tableLayout: "fixed" }} size="small">
                <TableBody>
                  <Rows
                    datedTimeLogs={nestedRows}
                    aggregateKeys={aggregateKeys}
                    activeAggregateIdx={activeAggregateIdx + 1}
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

function format(
  datedTimeLog: Partial<DatedTimeLogs>,
  timeUnit: keyof DateItem
): number | string {
  if (timeUnit === "year") {
    return datedTimeLog.year!;
  }
  if (timeUnit === "month") {
    return MONTHS[datedTimeLog.month! - 1];
  }
  if (timeUnit === "day") {
    if (datedTimeLog.year !== undefined && datedTimeLog.month !== undefined) {
      const dayOfWeek = dayjs(
        `${datedTimeLog.year}-${datedTimeLog.month}-${datedTimeLog.day}`
      ).day();
      return `${DAY_OF_WEEK[dayOfWeek]}, ${datedTimeLog.day}`;
    } else if (datedTimeLog.week !== undefined) {
      const sundayStart = parseInt(
        dayjs("1950-01-01").add(datedTimeLog.week!, "week").format("DD")
      );
      const dayOfWeek = datedTimeLog.day! - sundayStart;
      return `${DAY_OF_WEEK[dayOfWeek]}, ${datedTimeLog.day}`;
    }
  }
  if (timeUnit === "week") {
    return dayjs("1950-01-01")
      .add(datedTimeLog.week!, "week")
      .format("YYYY-MM-DD");
  }
  return "";
}

function isCurrentDate(record: Partial<DateItem>, timeUnit?: keyof DateItem) {
  const now = dayjs();
  if (timeUnit === "year") {
    return record.year === now.year();
  }
  if (timeUnit === "month") {
    return record.year === now.year() && record.month === now.month() + 1;
  }
  if (timeUnit === "week") {
    return now.diff(dayjs("1950-01-01"), "weeks") === record.week;
  }
  if (timeUnit === "day") {
    if (record.year !== undefined && record.month !== undefined) {
      return (
        record.year === now.year() &&
        record.month === now.month() + 1 &&
        record.day === now.date()
      );
    } else if (record.week !== undefined) {
      return (
        now.diff(dayjs("1950-01-01"), "weeks") === record.week &&
        now.date() === record.day
      );
    }
  }
  return false;
}
