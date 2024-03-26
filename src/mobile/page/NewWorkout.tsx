import { ChevronLeft, FitnessCenter } from "@mui/icons-material";
import {
  Box,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import useActiveApp from "../../hook/useActiveApp";
import { useExercise } from "../../hook/useExercise";
import TopAppBar from "../component/TopAppBar";

export default function NewWorkout() {
  const { goBack } = useActiveApp();
  const { items: exercises } = useExercise();

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
          {exercises.map((exercise, idx) => {
            // TODO: add search to navbar
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
