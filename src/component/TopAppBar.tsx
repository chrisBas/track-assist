import { Button } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import useActivePage from "../hook/useActivePage";

const pageTitle = "Common Tools";

export default function TopAppBar() {
  const { setActivePage } = useActivePage();

  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <Button
          sx={{ color: "primary.contrastText" }}
          onClick={() => {
            setActivePage((_old) => "");
          }}
        >
          <Typography variant="h6" noWrap component="div">
            {pageTitle}
          </Typography>
        </Button>
      </Toolbar>
    </AppBar>
  );
}
