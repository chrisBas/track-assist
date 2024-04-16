import { MouseEventHandler } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { Fab } from '@mui/material';

interface Props {
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export default function FabAdd({ onClick }: Props) {
  return (
    <Fab color="primary" aria-label="add" sx={{ position: 'fixed', bottom: 88, right: 16 }} onClick={onClick}>
      <AddIcon />
    </Fab>
  );
}
