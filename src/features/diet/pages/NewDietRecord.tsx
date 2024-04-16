import { useState } from 'react';
import { Add, ChevronLeft, LunchDining, Search } from '@mui/icons-material';
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
import { useDietLog } from '../hooks/useDietLog';
import { useFoods } from '../hooks/useFoods';
import { useDietStore } from '../store/useDietStore';

// TODO: make this a generic component (used in both NewDietRecord and NewWorkout)

export default function NewDietRecord() {
  // global state
  const datetime = useDietStore((state) => state.datetime);
  const setFood = useDietStore((state) => state.setFood);
  const { goBack, setActiveApp } = useActiveApp();
  const { items: foods } = useFoods();
  const { add: addDietLog } = useDietLog();

  // local state
  const [search, setSearch] = useState('');

  // local vars
  const filteredFoods = foods.filter((food) => {
    return food.name.toLowerCase().includes(search.toLowerCase());
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
          {filteredFoods.length === 0 ? (
            <ListItemButton
              onClick={() => {
                setFood(search);
                setActiveApp((prev) => ({ ...prev, page: 'New Food' }));
              }}
            >
              <ListItemIcon>
                <Add />
              </ListItemIcon>
              <ListItemText primary={`New Food | ${search}`} />
            </ListItemButton>
          ) : (
            filteredFoods.map((food) => {
              return (
                <ListItemButton
                  key={food.id}
                  onClick={() => {
                    addDietLog({
                      datetime: toDatetimeString(datetime),
                      food_id: food.id,
                      servings: 1,
                    }).then(() => {
                      setActiveApp((prev) => ({
                        ...prev,
                        page: 'Diet Tracker',
                      }));
                    });
                  }}
                >
                  <ListItemIcon>
                    <LunchDining />
                  </ListItemIcon>
                  <ListItemText primary={food.name} secondary={`${food.calories}cal / serving`} />
                </ListItemButton>
              );
            })
          )}
        </List>
      </Box>
    </Box>
  );
}
