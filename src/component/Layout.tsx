import { Divider, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import TopAppBar from "./TopAppBar";

export default function Layout({
  title,
  children,
}: {
  title: string;
  children: JSX.Element;
}) {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <TopAppBar />
      <Box component="main" sx={{ flexGrow: 1, maxWidth: "100%" }}>
        <Toolbar />
        <Typography
          variant="body1"
          fontWeight={500}
          textAlign="center"
          sx={{ py: 2 }}
        >
          {title}
        </Typography>
        <Divider sx={{mb:1}} />
        {children}
      </Box>
    </Box>
  );
}
