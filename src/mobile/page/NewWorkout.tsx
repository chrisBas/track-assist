import { ChevronLeft, FitnessCenter, Search } from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
} from "@mui/material";
import { useState } from "react";
import useActiveApp from "../../hook/useActiveApp";
import { useExercise } from "../../hook/useExercise";
import TopAppBar from "../component/TopAppBar";

export default function NewWorkout() {
  // global state
  const { goBack } = useActiveApp();
  const { items: exercises } = useExercise();

  // local state
  const [search, setSearch] = useState("");

  // local vars
  const filteredExercises = exercises.filter((exercise) => {
    return exercise.exercise.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <>
      <TopAppBar
        leftAction={
          <IconButton onClick={() => goBack()}>
            <ChevronLeft />
          </IconButton>
        }
      />
      <Box>
        <List sx={{ width: "100%", bgcolor: "background.paper" }}>
          <ListItem>
            <Paper
              sx={{
                p: "2px 4px",
                display: "flex",
                alignItems: "center",
                width: 400,
              }}
            >
              <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
                <Search />
              </IconButton>
              <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
            </Paper>
          </ListItem>
          {filteredExercises.map((exercise, idx) => {
            return (
              <ListItemButton
                key={exercise.id}
                onClick={() => {
                  // TODO: implement selection
                  console.log(`Selected ${exercise.id}`);
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
          })}
        </List>
      </Box>
    </>
  );
}
