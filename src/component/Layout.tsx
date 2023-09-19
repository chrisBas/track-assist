import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import TopAppBar from "./TopAppBar";

export default function Layout({ children }: { children: JSX.Element }) {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <TopAppBar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, maxWidth: "100%" }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
