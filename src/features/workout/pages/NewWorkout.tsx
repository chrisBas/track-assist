import { useState } from 'react';
import { Add, ChevronLeft, FitnessCenter, Search } from '@mui/icons-material';
import {
  Box,
  Divider,
  IconButton,
  InputBase,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
} from '@mui/material';

import TopAppBar from '../../common/components/TopAppBar';
import useActiveApp from '../../common/hooks/useActiveApp';
import { toDatetimeString } from '../../common/utils/date-utils';
import { useExercise } from '../hooks/useExercise';
import { useFitnessLog } from '../hooks/useFitnessLog';
import { useFitnessStore } from '../store/useFitnessStore';

export default function NewWorkout() {
  // global state
  const datetime = useFitnessStore((state) => state.datetime);
  const setExercise = useFitnessStore((state) => state.setExercise);
  const { goBack, setActiveApp } = useActiveApp();
  const { items: exercises } = useExercise();
  const { add: addFitnessLog } = useFitnessLog();

  // local state
  const [search, setSearch] = useState('');

  // local vars
  const filteredExercises = exercises.filter((exercise) => {
    return exercise.exercise.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TopAppBar
        title={
          <Paper
            sx={{
              p: '2px 4px',
              display: 'flex',
              alignItems: 'center',
              width: '100%',
            }}
            elevation={0}
          >
            <IconButton onClick={() => goBack()}>
              <ChevronLeft />
            </IconButton>
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
              <Search />
            </IconButton>
          </Paper>
        }
      />
      <Box sx={{ flexGrow: 1, overflow: 'scroll' }}>
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {filteredExercises.length === 0 ? (
            <ListItemButton
              onClick={() => {
                setExercise(search);
                setActiveApp((prev) => ({ ...prev, page: 'New Exercise' }));
              }}
            >
              <ListItemIcon>
                <Add />
              </ListItemIcon>
              <ListItemText primary={`New Exercise | ${search}`} />
            </ListItemButton>
          ) : (
            filteredExercises.map((exercise) => {
              return (
                <ListItemButton
                  key={exercise.id}
                  onClick={() => {
                    addFitnessLog({
                      exercise_id: exercise.id,
                      datetime: toDatetimeString(datetime),
                    }).then(() => {
                      setActiveApp((prev) => ({
                        ...prev,
                        page: 'Workout Tracker',
                      }));
                    });
                  }}
                >
                  <ListItemIcon>
                    <FitnessCenter />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${exercise.muscle_group} | ${exercise.exercise}`}
                    secondary={exercise.description}
                  />
                </ListItemButton>
              );
            })
          )}
        </List>
      </Box>
    </Box>
  );
}
