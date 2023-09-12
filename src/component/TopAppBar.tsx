import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "./Link";

const pageTitle = "Common Tools";

export default function TopAppBar() {
  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <Link to="">
          <Typography variant="h6" noWrap component="div">
            {pageTitle}
          </Typography>
        </Link>
      </Toolbar>
    </AppBar>
  );
}
