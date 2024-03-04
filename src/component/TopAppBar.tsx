import MenuIcon from "@mui/icons-material/Menu";
import {
  Alert,
  AlertColor,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Snackbar,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Session, createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import useActivePage from "../hook/useActivePage";
import log from "../util/log";
import LeftNavDrawer from "./LeftNavDrawer";

const pageTitle = "Common Tools";

const projectUrl = "https://qnpaxdvwmaovefvvlhyd.supabase.co";
const publicAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFucGF4ZHZ3bWFvdmVmdnZsaHlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk0ODEzNjQsImV4cCI6MjAyNTA1NzM2NH0.-E2jGecRltKjkOlHgu_fSmTaAtozNOGeqvqTrqFfP6k";
const supabase = createClient(projectUrl, publicAnonKey);

export default function TopAppBar() {
  const { setActivePage } = useActivePage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [snackbarState, setSnackbarState] = useState<{
    open: boolean;
    message: string;
    status: AlertColor;
  }>({
    open: false,
    message: "",
    status: "info",
  });
  const [session, setSession] = useState<Session | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        setSnackbarState({
          open: true,
          message: "User logged in",
          status: "success",
        });
      }
      if (event === "INITIAL_SESSION") {
        setIsLoaded(true);
      }
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = () => {
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
  };

  const logout = () => {
    supabase.auth
      .signOut()
      .then((_response) => {
        setSnackbarState({
          open: true,
          message: "User logged out",
          status: "success",
        });
      })
      .catch((response) => {
        setSnackbarState({
          open: true,
          message: "User logout failed",
          status: "error",
        });
        log.error("signOut", response);
        return;
      });
  };
  const onSnackbarClose = () => {
    setSnackbarState((prev) => ({ ...prev, open: false }));
  };
  const onSnackbarTransitionEnd = () => {
    if (!snackbarState.open) {
      setSnackbarState({ open: false, message: "", status: "info" });
    }
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Box>
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
            </Box>
            <Box>
              {isLoaded ? (
                session == null ? (
                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={() => {
                      login();
                    }}
                  >
                    Sign In
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={() => {
                      logout();
                    }}
                  >
                    Sign Out
                  </Button>
                )
              ) : (
                <Button variant="outlined" color="inherit" disabled>
                  <CircularProgress color="inherit" size="1.75rem" />
                </Button>
              )}
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      <LeftNavDrawer
        open={mobileOpen}
        onClose={() => {
          setMobileOpen(false);
        }}
      />
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={snackbarState.open}
        autoHideDuration={3000}
        onClose={onSnackbarClose}
        onTransitionEnd={onSnackbarTransitionEnd}
      >
        <Alert
          onClose={onSnackbarClose}
          severity={snackbarState.status}
          sx={{ width: "100%" }}
        >
          {snackbarState.message}
        </Alert>
      </Snackbar>
    </>
  );
}
