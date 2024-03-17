import {
    Card,
    CardContent,
    CardHeader,
    Modal,
    Typography,
} from "@mui/material";

interface Props {
  title: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function CommonModal({ title, open, onClose, children }: Props) {
  return (
    <Modal open={open} onClose={onClose}>
      <Card
        sx={(theme) => ({
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          [theme.breakpoints.up("xs")]: {
            maxWidth: "90%",
          },
        })}
      >
        <CardHeader
          sx={{ pb: 1 }}
          title={<Typography variant="h6">{title}</Typography>}
        />
        <CardContent sx={{ pt: 1 }}>{children}</CardContent>
      </Card>
    </Modal>
  );
}
