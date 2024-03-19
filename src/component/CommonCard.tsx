import CloseIcon from "@mui/icons-material/Close";
import {
    Card,
    CardActionArea,
    CardContent,
    IconButton,
    Stack,
    SxProps,
    Theme,
    Typography,
} from "@mui/material";

interface Props {
  title: string;
  subtitle: string;
  subinfo: string;
  sx: SxProps<Theme>;
  onSelect: () => void;
  onDelete: () => void;
}

export default function CommonCard({
  title,
  subtitle,
  subinfo,
  sx,
  onSelect,
  onDelete,
}: Props) {
  return (
    <Card sx={sx}>
      <CardActionArea
        component="div"
        onClick={() => {
          onSelect();
        }}
      >
        <CardContent>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="subtitle1" fontWeight={500}>
              {title}
            </Typography>
            <IconButton
              aria-label="delete"
              size="small"
              onClick={(e) => {
                onDelete();
                e.stopPropagation();
              }}
            >
              <CloseIcon />
            </IconButton>
          </Stack>
          <Stack direction="row" justifyContent="space-between" color="gray">
            <Typography variant="body2" fontWeight={500}>
              {subtitle}
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {subinfo}
            </Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
