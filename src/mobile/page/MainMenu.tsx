import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import { apps } from "../../App";
import useActiveApp from "../../hook/useActiveApp";

export default function MainMenu() {
  const { setActiveApp } = useActiveApp();

  return (
    <Box p={1}>
      <Typography gutterBottom variant="h5" component="div">
        Applets
      </Typography>
      <Grid container spacing={2}>
        {apps.map((app) => (
          <Grid item key={app.name} xs={12}>
            <Card sx={{borderRadius: 3}}>
              <CardActionArea
                onClick={() => {
                  setActiveApp(() => ({
                    app: app.name,
                    nav: app.nav[0].label,
                    page: app.nav[0].pages[0].label,
                  }));
                }}
              >
                <CardMedia
                  component="img"
                  height="120"
                  image={app.img}
                  alt={app.name}
                  sx={{ objectFit: "contain" }}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {app.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {app.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
