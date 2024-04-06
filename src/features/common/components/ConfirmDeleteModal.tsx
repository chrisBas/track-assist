import { Box, Button, Stack, Typography } from "@mui/material";
import CommonModal from "./CommonModal";

interface Props {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export default function ConfirmDeleteModal({ open, onClose, onDelete }: Props) {
  return (
    <CommonModal open={open} onClose={onClose} title="Confirm Delete">
      <Stack direction="column" spacing={2}>
        <Typography
          variant="body2"
          color="gray"
        >{`Are you sure you want to delete this record?`}</Typography>
        <Box sx={{ display: "flex", justifyContent: "end" }}>
          <Button variant="contained" color="error" onClick={onDelete}>
            Delete
          </Button>
        </Box>
      </Stack>
    </CommonModal>
  );
}
