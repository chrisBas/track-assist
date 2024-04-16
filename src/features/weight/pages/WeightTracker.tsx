import { useState } from 'react';
import { Delete, FolderOff, Save, Scale } from '@mui/icons-material';
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';

import FabAdd from '../../common/components/FabAdd';
import TopAppBar from '../../common/components/TopAppBar';
import useActiveApp from '../../common/hooks/useActiveApp';
import { SpecificRecord } from '../../common/hooks/useSupabaseData';
import { useModalStore } from '../../common/store/modalStore';
import { Metric, useMetrics } from '../hooks/useMetrics';

export default function WeightTracker() {
  // global state
  const { items: allMetrics } = useMetrics();
  const { setActiveApp } = useActiveApp();

  // local vars
  const weights = allMetrics.filter((metric) => metric.metric === 'weight (lbs)');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TopAppBar title={'Weight Tracker'} showProfile />
      <Box sx={{ flexGrow: 1, overflow: 'scroll' }}>
        <List sx={{ height: '100%', width: '100%', bgcolor: 'background.paper' }}>
          {weights.length === 0 ? (
            <Stack
              direction="column"
              justifyContent="center"
              alignItems="center"
              spacing={2}
              sx={{ height: 'calc(100%)' }}
            >
              <FolderOff fontSize="large" color="disabled" />
              <Typography color="dimgray">No weights have been logged</Typography>
            </Stack>
          ) : (
            <Box sx={{ pb: '80px' }}>
              {weights.map((weight) => (
                <WeightItem key={weight.id} weight={weight} />
              ))}
            </Box>
          )}
        </List>
      </Box>
      <FabAdd
        onClick={() => {
          setActiveApp((prev) => ({ ...prev, page: 'New Weight Entry' }));
        }}
      />
    </Box>
  );
}

function WeightItem({ weight }: { weight: SpecificRecord<Metric> }) {
  // global state
  const { delete: deleteMetric, update: updateMetric } = useMetrics();
  const setModal = useModalStore((state) => state.setModal);

  // local state
  const [weightValue, setWeightValue] = useState<string>(`${weight.value}`);

  return (
    <ListItem>
      <ListItemIcon>
        <Scale />
      </ListItemIcon>
      <ListItemText
        primary={
          <TextField
            size="small"
            variant="standard"
            type="number"
            label={dayjs(weight.datetime).format('MMM DD, YYYY')}
            value={weightValue}
            onChange={(e) => {
              setWeightValue(e.target.value);
            }}
          />
        }
      />
      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          updateMetric({
            ...weight,
            value: parseFloat(weightValue),
          });
        }}
        disabled={weightValue === `${weight.value}` || weightValue === ''}
      >
        <Save />
      </IconButton>
      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          setModal({
            modal: 'confirm-delete',
            onDelete: () => {
              deleteMetric(weight.id);
            },
          });
        }}
      >
        <Delete />
      </IconButton>
    </ListItem>
  );
}
