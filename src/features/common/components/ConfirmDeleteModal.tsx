import { Box, Button, Stack, Typography } from '@mui/material';

import { useModalStore } from '../store/modalStore';
import CommonModal from './CommonModal';

export default function ConfirmDeleteModal() {
  // global state
  const modal = useModalStore((state) => state.modal);
  const setModal = useModalStore((state) => state.setModal);

  // local state
  const open = modal?.modal === 'confirm-delete';
  const onClose = () => setModal(null);
  const onDelete = () => {
    modal?.onDelete();
    onClose();
  };

  return (
    <CommonModal open={open} onClose={onClose} title="Confirm Delete">
      <Stack direction="column" spacing={2}>
        <Typography variant="body2" color="gray">{`Are you sure you want to delete this record?`}</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'end' }}>
          <Button variant="contained" color="error" onClick={onDelete}>
            Delete
          </Button>
        </Box>
      </Stack>
    </CommonModal>
  );
}
