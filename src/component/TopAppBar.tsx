import MenuIcon from "@mui/icons-material/Menu";
import { Button, IconButton } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import useActivePage from "../hook/useActivePage";
import LeftNavDrawer from "./LeftNavDrawer";

const pageTitle = "Common Tools";

export default function TopAppBar() {
  const { setActivePage } = useActivePage();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2, display: { sm: "none" } }}
            onClick={() => setMobileOpen(true)}
          >
            <MenuIcon />
          </IconButton>
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
      <LeftNavDrawer
        open={mobileOpen}
        onClose={() => {
          setMobileOpen(false);
        }}
      />
    </>
  );
}
