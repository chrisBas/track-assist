import {
  ArrowForwardIos,
  CheckCircleOutline,
  MoreHoriz,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  IconButton,
  List,
  Stack,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";
import FabAdd from "../../../component/FabAdd";
import useActiveApp from "../../../hook/useActiveApp";
import {
  toDateStringWithMonth,
  toDatetimeString,
} from "../../../util/date-utils";
import TopAppBar from "../../component/TopAppBar";

type Task = {
  id: string;
  label: string;
  dueDate: string | null;
  isComplete: boolean;
};

type ExpandedOption =
  | "my-tasks"
  | "due-today"
  | "due-thisweek"
  | "past-due"
  | "due-later"
  | null;

export default function TodoTasks() {
  // global state
  const { setActiveApp } = useActiveApp();

  // local state
  const today = dayjs().startOf("day"); // move to local vars
  const [unsortedTasks, setTasks] = useState<Task[]>([
    {
      id: "a",
      label: "today task",
      dueDate: toDatetimeString(today),
      isComplete: false,
    },
    {
      id: "b",
      label: "yesterday task",
      dueDate: toDatetimeString(today.subtract(1, "days")),
      isComplete: false,
    },
    {
      id: "c",
      label: "tomorrow task",
      dueDate: toDatetimeString(today.add(1, "days")),
      isComplete: false,
    },
    {
      id: "d",
      label: "next week task",
      dueDate: toDatetimeString(today.add(7, "days")),
      isComplete: false,
    },
    {
      id: "e",
      label: "next week minus 1 task",
      dueDate: toDatetimeString(today.add(6, "days")),
      isComplete: false,
    },
    {
      id: "f",
      label: "not due task",
      dueDate: null,
      isComplete: false,
    },
  ]);
  const [expanded, setExpanded] = useState<ExpandedOption>("my-tasks");

  // local vars
  const tasks = unsortedTasks.sort((a, b) => {
    if (a.dueDate === null && b.dueDate === null) return 0;
    if (a.dueDate === null)
      return dayjs(b.dueDate).isBefore(today.add(1)) ? 1 : -1;
    if (b.dueDate === null)
      return dayjs(a.dueDate).isBefore(today.add(1)) ? -1 : 1;
    return dayjs(a.dueDate).diff(dayjs(b.dueDate));
  });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <TopAppBar title={"Todo Lists"} showProfile />
      <Box sx={{ flexGrow: 1, overflow: "scroll" }}>
        <List
          sx={{ height: "100%", width: "100%", bgcolor: "background.paper" }}
        >
          <Box sx={{ pb: "80px" }}>
            <TaskGrouping
              label="My Tasks"
              expanded={expanded === "my-tasks"}
              onExpandChange={() => {
                setExpanded((prev) =>
                  prev === "my-tasks" ? null : "my-tasks"
                );
              }}
              tasks={tasks}
            />
            <TaskGrouping
              label="Past Due"
              expanded={expanded === "past-due"}
              onExpandChange={() => {
                setExpanded((prev) =>
                  prev === "past-due" ? null : "past-due"
                );
              }}
              tasks={tasks.filter((task) => {
                if (task.dueDate === null) return false;
                return dayjs(task.dueDate).isBefore(today, "day");
              })}
            />
            <TaskGrouping
              label="Due Today"
              expanded={expanded === "due-today"}
              onExpandChange={() => {
                setExpanded((prev) =>
                  prev === "due-today" ? null : "due-today"
                );
              }}
              tasks={tasks.filter((task) => {
                if (task.dueDate === null) return false;
                return dayjs(task.dueDate).isSame(today, "day");
              })}
            />
            <TaskGrouping
              label="Due This Week"
              expanded={expanded === "due-thisweek"}
              onExpandChange={() => {
                setExpanded((prev) =>
                  prev === "due-thisweek" ? null : "due-thisweek"
                );
              }}
              tasks={tasks.filter((task) => {
                if (task.dueDate === null) return false;
                const diff = dayjs(task.dueDate).diff(today, "day", true);
                return diff > -1 && diff <= 6;
              })}
            />
            <TaskGrouping
              label="Due Later"
              expanded={expanded === "due-later"}
              onExpandChange={() => {
                setExpanded((prev) =>
                  prev === "due-later" ? null : "due-later"
                );
              }}
              tasks={tasks.filter((task) => {
                if (task.dueDate === null) return false;
                const diff = dayjs(task.dueDate).diff(today, "day", true);
                return diff > 6;
              })}
            />
          </Box>
        </List>
      </Box>
      <FabAdd
        onClick={() => {
          setActiveApp((prev) => ({ ...prev, page: "New Weight Entry" }));
        }}
      />
    </Box>
  );
}

function TaskGrouping({
  label,
  expanded,
  onExpandChange,
  tasks,
}: {
  label: string;
  expanded: boolean;
  onExpandChange: () => void;
  tasks: Task[];
}) {
  return (
    <Accordion disableGutters expanded={expanded} onChange={onExpandChange}>
      <AccordionSummary
        expandIcon={<ArrowForwardIos sx={{ fontSize: "0.9rem" }} />}
        sx={{
          flexDirection: "row-reverse",
          "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
            transform: "rotate(90deg)",
          },
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
        >
          <Typography>{label}</Typography>
          <Stack direction="row" alignItems="center">
            <Typography>{tasks.length}</Typography>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                // TODO: edit group
              }}
            >
              <MoreHoriz />
            </IconButton>
          </Stack>
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ maxHeight: "calc(34px * 8)", overflowY: "scroll", px: 1 }}>
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}

function TaskItem({ task }: { task: Task }) {
  // local vars
  const today = dayjs().startOf("day");
  const isTomorrow =
    task.dueDate != null &&
    dayjs(task.dueDate).isSame(today.add(1, "day"), "day");
  const isToday =
    task.dueDate != null && dayjs(task.dueDate).isSame(today, "day");
  const isPastDue =
    task.dueDate != null && dayjs(task.dueDate).isBefore(today, "day");

  return (
    <Stack
      width="100%"
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      onClick={() => {
        console.log("TODO: view task");
      }}
    >
      <Stack direction="row" alignItems="center">
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            // TODO: complete task, but make sure to display snackbar with undo
            console.log("TODO: complete task");
          }}
        >
          <CheckCircleOutline />
        </IconButton>
        <Typography variant="body2">{task.label}</Typography>
      </Stack>
      <Button
        size="small"
        variant="text"
        color={
          isTomorrow || isToday ? "success" : isPastDue ? "error" : "inherit"
        }
        sx={{ textTransform: "none" }}
        onClick={(e) => {
          e.stopPropagation();
          // TODO: allow date selection OR null
          console.log("TODO: modify date");
        }}
      >
        <Typography variant="body2">
          {task.dueDate === null
            ? "Not Due"
            : isToday
            ? "Today"
            : isTomorrow
            ? "Tomorrow"
            : toDateStringWithMonth(dayjs(task.dueDate))}
        </Typography>
      </Button>
    </Stack>
  );
}
