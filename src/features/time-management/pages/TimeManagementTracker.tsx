import { useState } from 'react';
import { Delete, FolderOff, InfoOutlined, LockClock } from '@mui/icons-material';
import {
  Box,
  Button,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { MobileTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

import FabAdd from '../../common/components/FabAdd';
import TopAppBar from '../../common/components/TopAppBar';
import VirtualizedDateList from '../../common/components/VirtualizedDateList';
import { useModalStore } from '../../common/store/modalStore';
import { toDatetimeString } from '../../common/utils/date-utils';
import { SpecificActivity, useWorkActivity } from '../hooks/useWorkActivity';

export default function TimeManagementTracker() {
  // global state
  const { activities, addActivity } = useWorkActivity();

  // local state
  const [datetime, setDatetime] = useState(dayjs());

  // local vars
  const filteredActivities = activities
    .filter((activity) => {
      const date = dayjs(activity.start_time);
      return date.isSame(datetime, 'day');
    })
    .sort((a, b) => (a > b ? 1 : -1));
  const totalMinutes = filteredActivities.reduce((acc, activity) => {
    const start = dayjs(activity.start_time);
    const end = dayjs(activity.end_time);
    return acc + end.diff(start, 'minutes', true);
  }, 0);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TopAppBar
        title={datetime.format('MMM YYYY')}
        showProfile
        row2={
          <VirtualizedDateList
            date={datetime}
            onDateChange={(date) => {
              setDatetime(date);
            }}
          />
        }
      />
      <Box sx={{ flexGrow: 1, overflow: 'scroll' }}>
        <List sx={{ height: '100%', width: '100%', bgcolor: 'background.paper' }}>
          <ListItem divider>
            <ListItemIcon>
              <InfoOutlined />
            </ListItemIcon>
            <ListItemText disableTypography>
              <Typography fontWeight="bold" textAlign="center">
                {`${hours === 0 ? '' : `${hours} Hours `}${minutes} Minutes Total`}
              </Typography>
            </ListItemText>
          </ListItem>
          {filteredActivities.length === 0 ? (
            <Stack
              direction="column"
              justifyContent="center"
              alignItems="center"
              spacing={2}
              sx={{ height: 'calc(100% - 48px)' }}
            >
              <FolderOff fontSize="large" color="disabled" />
              <Typography color="dimgray">No times have been logged today</Typography>
            </Stack>
          ) : (
            <Box sx={{ pb: '80px' }}>
              {filteredActivities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </Box>
          )}
        </List>
      </Box>
      <FabAdd
        onClick={() => {
          const currentTime = toDatetimeString(dayjs());
          addActivity({
            start_time: currentTime,
            end_time: currentTime,
            notes: '',
          });
        }}
      />
    </Box>
  );
}

function ActivityItem({ activity }: { activity: SpecificActivity }) {
  // global state
  const { deleteActivity, updateActivity } = useWorkActivity();
  const setModal = useModalStore((state) => state.setModal);

  // local state
  const [open, setOpen] = useState(false);
  const [startTime, setStartTime] = useState(activity.start_time == null ? null : dayjs(activity.start_time));
  const [endTime, setEndTime] = useState(activity.end_time == null ? null : dayjs(activity.end_time));
  const [notes, setNodes] = useState(activity.notes);

  // local vars
  const totalMinutes = dayjs(activity.end_time).diff(dayjs(activity.start_time), 'minutes', true);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const dataChanged =
    (startTime != null && toDatetimeString(startTime) !== activity.start_time) ||
    (endTime != null && toDatetimeString(endTime) !== activity.end_time) ||
    notes !== activity.notes;

  return (
    <>
      <ListItemButton onClick={() => setOpen((prev) => !prev)}>
        <ListItemIcon>
          <LockClock />
        </ListItemIcon>
        <ListItemText
          primary={`(${hours === 0 ? '' : `${hours}hr `}${minutes}min) ${dayjs(activity.start_time).format(
            'hh:mmA'
          )} - ${dayjs(activity.end_time).format('hh:mmA')}`}
          secondary={activity.notes}
        />
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            setModal({
              modal: 'confirm-delete',
              onDelete: () => {
                deleteActivity(activity.id);
              },
            });
          }}
        >
          <Delete />
        </IconButton>
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Stack px={3} py={2} spacing={2} direction="column">
          <MobileTimePicker
            label="Start Time"
            value={startTime}
            onAccept={(value) => {
              setStartTime(value);
            }}
          />
          <MobileTimePicker
            label="End Time"
            value={endTime}
            onAccept={(value) => {
              setEndTime(value);
            }}
            minTime={startTime}
          />
          <TextField label="Notes" value={notes} onChange={(e) => setNodes(e.target.value)} />
          <Button
            size="small"
            variant="outlined"
            color="success"
            onClick={() => {
              updateActivity({
                ...activity,
                start_time: toDatetimeString(startTime!),
                end_time: toDatetimeString(endTime!),
                notes,
              });
            }}
            disabled={startTime == null || endTime == null || !dataChanged || startTime > endTime}
          >
            Save
          </Button>
        </Stack>
      </Collapse>
    </>
  );
}
