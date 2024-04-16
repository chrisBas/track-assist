import { Box, Card, CardActionArea, CardContent, CardMedia, Grid, Typography } from '@mui/material';

import { apps } from '../../../App';
import TopAppBar from '../components/TopAppBar';
import useActiveApp from '../hooks/useActiveApp';

export default function MainMenu() {
  const { setActiveApp } = useActiveApp();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TopAppBar title="Applets" showProfile />
      <Box sx={{ flexGrow: 1, overflow: 'scroll' }}>
        <Grid container spacing={2}>
          {apps.map((app) => (
            <Grid item key={app.name} xs={12}>
              <Card sx={{ maxWidth: '92%', margin: 'auto' }}>
                <CardActionArea
                  sx={{ display: 'flex' }}
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
                    image={app.img}
                    alt={app.name}
                    sx={{ objectFit: 'contain', width: '120px' }}
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
    </Box>
  );
}
