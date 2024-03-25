import AddIcon from "@mui/icons-material/Add";

import { Fab } from "@mui/material";
import { MouseEventHandler } from "react";

interface Props {
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export default function FabAdd({ onClick }: Props) {
  return (
    <Fab
      color="primary"
      aria-label="add"
      sx={{ position: "fixed", bottom: 72, right: 16 }}
      onClick={onClick}
    >
      <AddIcon />
    </Fab>
  );
}
