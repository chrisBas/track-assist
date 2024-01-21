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
  aggregateKey,
  previousKeys = [],
  onUpdate,
  onCreate,
  onDelete,
}: {
  datedTimeLog: Partial<DatedTimeLogs>;
  nestedRows: DatedTimeLogs[];
  timeAggregate?: string;
  aggregateKey?: keyof DateItem;
  previousKeys?: (keyof DateItem)[];
  onUpdate: (date: DateItem, timeLog: TimeLog) => void;
  onCreate: (date: DateItem, timeLog: TimeLog) => void;
  onDelete: (date: DateItem, id: string) => void;
}) {
  const [open, setOpen] = useState(isCurrentDate(datedTimeLog, aggregateKey));
  const collapsable = aggregateKey !== undefined;
  const dayOfWeek =
    aggregateKey === "day"
      ? dayjs(
          `${datedTimeLog.year}-${datedTimeLog.month}-${datedTimeLog.day}`
        ).day()
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
        <TableCell>{aggregateKey === "year" && datedTimeLog.year}</TableCell>
        <TableCell>
          {aggregateKey === "month" && MONTHS[datedTimeLog.month! - 1]}
        </TableCell>
        <TableCell>
          {aggregateKey === "day" &&
            `${DAY_OF_WEEK[dayOfWeek!]}, ${datedTimeLog.day}`}
        </TableCell>
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
                    previousKeys={[...previousKeys, aggregateKey]}
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

function isCurrentDate(record: Partial<DateItem>, timeUnit?: keyof DateItem) {
  const now = dayjs();
  if (timeUnit === "year") {
    return record.year === now.year();
  }
  if (timeUnit === "month") {
    return record.year === now.year() && record.month === now.month() + 1;
  }
  if (timeUnit === "day") {
    return (
      record.year === now.year() &&
      record.month === now.month() + 1 &&
      record.day === now.date()
    );
  }
  return false;
}
