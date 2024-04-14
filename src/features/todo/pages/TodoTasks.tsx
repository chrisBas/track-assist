import {
  Check,
  Close,
  Delete,
  FolderOff,
  KeyboardArrowDown,
  KeyboardArrowRight,
  Save
} from "@mui/icons-material";
import {
  Box,
  Button,
  Collapse,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import CommonAutocomplete from "../../common/components/CommonAutocomplete";
import FabAdd from "../../common/components/FabAdd";
import TopAppBar from "../../common/components/TopAppBar";
import useActiveApp from "../../common/hooks/useActiveApp";
import { SpecificRecord } from "../../common/hooks/useSupabaseData";
import { useModalStore } from "../../common/store/modalStore";
import { toDateStringWithMonth } from "../../common/utils/date-utils";
import { useGroups } from "../../profile/hooks/useGroups";
import { useTaskGroups } from "../hooks/useTaskGroups";
import { Task, useTasks } from "../hooks/useTasks";


export default function TodoTasks() {
  // global state
  const { setActiveApp } = useActiveApp();
  const {items: tasks} = useTasks();

  // local state
  const [snackbarUndoFn, setSnackbarUndoFn] = useState<{undoFn: null | (() => void)}>({undoFn: null});

  // local vars
  const filteredTasks = tasks.filter(task => !task.is_complete)
  const handleClose = (_event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarUndoFn({undoFn: null});
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <TopAppBar title={"Todo Lists"} showProfile />
      <Box sx={{ flexGrow: 1, overflow: "scroll" }}>
        <List
          sx={{ 
            height: "100%", 
            width: "100%", 
            bgcolor: "background.paper", 
            marginBottom: '88px' // this is needed to prevent the fab from covering the last item
          }}
        >
          {filteredTasks.length === 0 ? (<Stack
              direction="column"
              justifyContent="center"
              alignItems="center"
              spacing={2}
              sx={{ height: "calc(100%)" }}
            >
              <FolderOff fontSize="large" color="disabled" />
              <Typography color="dimgray">
                No tasks have been added
              </Typography>
            </Stack>) : (filteredTasks.map(task => {
            return <TaskItem key={task.id} task={task} handleTaskCompletion={(undoFn) => {
              setSnackbarUndoFn({undoFn})
            }} />
          }))}
        </List>
      </Box>
      <Snackbar
        sx={{bottom: '72px'}}
        open={snackbarUndoFn.undoFn != null}
        autoHideDuration={4000}
        onClose={handleClose}
        message="Task Completed"
        action={
          <>
          <Button color="secondary" size="small" onClick={(e) => {
            handleClose(e);
            snackbarUndoFn.undoFn?.();
          }}>
            UNDO
          </Button>
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <Close fontSize="small" />
          </IconButton>
        </>
        }
      />
      <FabAdd
        onClick={() => {
          setActiveApp((prev) => ({ ...prev, page: "Todo Creation" }));
        }}
      />
    </Box>
  );
}

function TaskItem({ task, handleTaskCompletion }: { task: SpecificRecord<Task>, handleTaskCompletion: (undoFn: () => void) => void }) {
  // global state
  const { delete: deleteTask, update: updateTask } = useTasks();
  const setModal = useModalStore((state) => state.setModal);

  // local state
  const [open, setOpen] = useState(false);

  // local vars
  const today = dayjs().startOf("day")
  const tomorrow = today.add(1, "day").endOf("day")
  const dueDate = task.due_date === null ? null : dayjs(task.due_date)
  const dueDateColor = dueDate === null ? 'dimgray' : dueDate.isBefore(today) ? "red" : dueDate.isBefore(tomorrow) ? "green" : "dimgray"
  const diffDays = dueDate == null ? 0 : dueDate.diff(today, 'day');
  const dueDateLabel = dueDate === null ? "Not Due" : diffDays === 0 ? 'Today' : diffDays === 1 ? 'Tomorrow' : toDateStringWithMonth(dueDate)

  return (
    <>
      <ListItemButton onClick={() => setOpen((prev) => !prev)}>
        <ListItemIcon>
          {open ? <KeyboardArrowDown /> : <KeyboardArrowRight />}
        </ListItemIcon>
        <ListItemText primary={task.label} secondary={<Typography variant="caption" color={dueDateColor}>{dueDateLabel}</Typography>} />
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            handleTaskCompletion(() => {
              updateTask({ ...task, is_complete: false });
            })
            updateTask({ ...task, is_complete: true });
          }}
        >
          <Check />
        </IconButton>
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            setModal({
              modal: "confirm-delete",
              onDelete: () => {
                deleteTask(task.id);
              },
            });
          }}
        >
          <Delete />
        </IconButton>
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <EditTask task={task} />
      </Collapse>
    </>
  );
}

function EditTask({ task: initTask }: { task: SpecificRecord<Task> }) {
  // global state
  const { update: updateTask } = useTasks();
  const { items: taskGroups, update: updateTaskGroup, add: addTaskGroup, delete: deleteTaskGroup } = useTaskGroups();
  const {items: groups, isLoaded: isGroupsLoaded} = useGroups();

  // local state
  const [task, setTask] = useState(initTask);
  const [newTaskGroupId, setNewTaskGroupId] = useState<number | undefined>(undefined);

  // local vars
  const taskGroup = taskGroups.find(group => group.task_id === task.id);
  const groupName = !isGroupsLoaded || taskGroup === undefined ? null : groups.find(group => group.id === taskGroup.group_id)!.group_name;
  const isTaskClean= (task.label === initTask.label && task.due_date === initTask.due_date && task.notes === initTask.notes)
  const isGroupClean = (newTaskGroupId === taskGroup?.group_id)
  const isClean = (isTaskClean && isGroupClean);

  // effects
  useEffect(() => {
    setTask(initTask)
  }, [initTask])
  useEffect(() => {
    setNewTaskGroupId(taskGroups.find(group => group.task_id === task.id)?.group_id)
  }, [taskGroups, task])

  return (
    <Stack spacing={1} sx={{ paddingX: "56px" }}>
      <TextField value={task.label} onChange={(e) => setTask((prev) => ({ ...prev, label: e.target.value }))} size='small' />
      <CommonAutocomplete
            value={groupName}
            options={groups.map(group => ({value: group.group_name, label: group.group_name}))}
            onSelect={(val) => {
              setNewTaskGroupId(val === null ? undefined : groups.find(group => group.group_name === val)!.id)
            }}
            label="Group"
            size="small"
      />
      <DateTimePicker
        slotProps={{
          actionBar: {
            actions: ['clear', 'cancel', 'accept']
          },
          textField: {
            size: "small",
          },
        }}
        sx={{ width: "100%" }}
        value={task.due_date === null ? null : dayjs(task.due_date)}
        onChange={(value) => {
          setTask((prev) => {
            return {...prev, due_date: value?.format("YYYY-MM-DDTHH:mm:ss") ?? null}
          });
        }}
        
      />
      <TextField
        label="Notes"
        size="small"
        value={task.notes ?? ""}
        onChange={(e) => {
          setTask((prev) => {
            return {...prev, notes: e.target.value || null}
          });
        }}
      />
      <Button size='small' variant = 'contained' startIcon={<Save />} disabled={isClean} onClick={() => {
        if(!isTaskClean) {
          updateTask(task)
        } 
        if(!isGroupClean) {
          if(taskGroup === undefined) {
            addTaskGroup({task_id: task.id, group_id: newTaskGroupId!})
          } else if(newTaskGroupId === undefined) {
            deleteTaskGroup(taskGroup.id)
          } else {
            updateTaskGroup({...taskGroup, group_id: newTaskGroupId!})
          }
        }
      }}>Save</Button>
    </Stack>
  );
}