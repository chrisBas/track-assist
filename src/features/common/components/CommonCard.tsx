import React, { useState } from 'react';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import {
  Card,
  CardActionArea,
  CardActions,
  CardHeader,
  Collapse,
  IconButton,
  IconButtonProps,
  Typography,
  styled,
} from '@mui/material';

interface Props {
  title: string;
  subtitle?: string;
  subTitleColor?: string;
  action?: React.JSX.Element & React.ReactNode;
  action2?: React.JSX.Element & React.ReactNode;
  children?: React.ReactNode;
}

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function CommonCard({ title, subtitle, subTitleColor = 'dimgrey', action, action2, children }: Props) {
  // local state
  const [open, setOpen] = useState(false);

  return (
    <Card sx={{ maxWidth: '92%', margin: 'auto', my: 1 }}>
      <CardActionArea onClick={() => setOpen((prev) => !prev)}>
        <CardHeader
          title={<Typography variant="body1">{title}</Typography>}
          subheader={
            subtitle && (
              <Typography variant="body2" color={subTitleColor}>
                {subtitle}
              </Typography>
            )
          }
          sx={{ pb: 0 }}
          action={action}
          disableTypography
        />
        <CardActions disableSpacing>
          <ExpandMore component="span" expand={open} aria-expanded={open} aria-label="show more">
            <ExpandMoreIcon />
          </ExpandMore>
          {action2}
        </CardActions>
      </CardActionArea>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {children}
      </Collapse>
    </Card>
  );
}
