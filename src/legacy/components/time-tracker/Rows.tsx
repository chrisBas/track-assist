import dayjs from "dayjs";
import { DateItem, DatedTimeLogs, TimeLog } from "../../types/DateTimeLogs";
import { Row } from "./Row";

export function Rows({
  datedTimeLogs,
  aggregateKeys,
  activeAggregateIdx = 0,
  onUpdate,
  onCreate,
  onDelete,
}: {
  datedTimeLogs: DatedTimeLogs[];
  aggregateKeys: (keyof DateItem)[];
  activeAggregateIdx?: number;
  onUpdate: (date: DateItem, timeLog: TimeLog) => void;
  onCreate: (date: DateItem, timeLog: TimeLog) => void;
  onDelete: (date: DateItem, id: string) => void;
}) {
  const aggregateKey = aggregateKeys[activeAggregateIdx];
  if (aggregateKey === undefined) {
    return (
      <>
        {datedTimeLogs.map((datedTimeLog, idx) => {
          return (
            <Row
              key={idx}
              datedTimeLog={datedTimeLog}
              nestedRows={[]}
              aggregateKeys={aggregateKeys}
              activeAggregateIdx={activeAggregateIdx}
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
        .sort((a, b) => (Number(b) - Number(a)) < -7 ? 1 : -1) // end of the month reached
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
          const previousDatedTimeLog = aggregateKeys
            .slice(0, activeAggregateIdx)
            .reduce((map: Partial<DatedTimeLogs>, previousKey) => {
              map[previousKey] = datedTimeLogs[0][previousKey];
              return map;
            }, {});

          return (
            <Row
              key={key}
              datedTimeLog={{
                ...previousDatedTimeLog,
                [aggregateKey]: Number(key),
              }}
              timeAggregate={time}
              nestedRows={datedTimeLogs}
              aggregateKeys={aggregateKeys}
              activeAggregateIdx={activeAggregateIdx}
              onUpdate={onUpdate}
              onCreate={onCreate}
              onDelete={onDelete}
            />
          );
        })}
    </>
  );
}
