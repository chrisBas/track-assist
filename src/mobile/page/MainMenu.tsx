import {
  Box,
  Card,
  CardActionArea,
  CardContent,
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
        Apps
      </Typography>
      <Grid container>
        {apps.map((app) => (
          <Grid item key={app.name} xs={6}>
            <Card>
              <CardActionArea
                onClick={() => {
                  setActiveApp(() => ({
                    app: app.name,
                    nav: app.nav[0].label,
                    page: app.nav[0].pages[0].label,
                  }));
                }}
              >
                {/* <CardMedia
              component="img"
              height="140"
              image="/static/images/cards/contemplative-reptile.jpg"
              alt="green iguana"
            /> */}
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {app.name}
                  </Typography>
                  {/* <Typography variant="body2" color="text.secondary">
                Description...
              </Typography> */}
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
