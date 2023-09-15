import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import LeftNavDrawer from "./LeftNavDrawer";
import TopAppBar from "./TopAppBar";

export default function Layout({ children }: { children: JSX.Element }) {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <TopAppBar />
      <LeftNavDrawer />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
