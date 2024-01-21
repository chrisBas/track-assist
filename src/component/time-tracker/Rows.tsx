import dayjs from "dayjs";
import { DateItem, DatedTimeLogs, TimeLog } from "../../type/DateTimeLogs";
import { Row } from "./Row";

export function Rows({
  datedTimeLogs,
  aggregateKey,
  previousKeys = [],
  onUpdate,
  onCreate,
  onDelete,
}: {
  datedTimeLogs: DatedTimeLogs[];
  aggregateKey?: keyof DateItem;
  previousKeys?: (keyof DateItem)[];
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
              previousKeys={previousKeys}
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
          const previousDatedTimeLog = previousKeys.reduce(
            (map: Partial<DatedTimeLogs>, previousKey) => {
              map[previousKey] = datedTimeLogs[0][previousKey];
              return map;
            },
            {}
          );

          return (
            <Row
              key={key}
              datedTimeLog={{
                ...previousDatedTimeLog,
                [aggregateKey]: convertTypeOnAggregate(key, aggregateKey),
              }}
              timeAggregate={time}
              nestedRows={datedTimeLogs}
              aggregateKey={aggregateKey}
              previousKeys={previousKeys}
              onUpdate={onUpdate}
              onCreate={onCreate}
              onDelete={onDelete}
            />
          );
        })}
    </>
  );
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
