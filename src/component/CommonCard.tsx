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
  subinfo?: string;
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
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="column">
              <Typography variant="subtitle1" fontWeight={500}>
                {title}
              </Typography>
              <Typography variant="body2" fontWeight={500} color="gray">
                {subtitle}
              </Typography>
            </Stack>
            <Stack direction="column">
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
              {subinfo && (
                <Typography variant="body2" color="gray" fontWeight={500}>
                  {subinfo}
                </Typography>
              )}
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
