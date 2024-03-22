import { AccountCircle, Login, Logout } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Alert,
  AlertColor,
  Box,
  Button,
  CircularProgress,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Snackbar,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import { useSession } from "../hook/useSession";
import log from "../util/log";
import props from "../util/props";
import supabase from "../util/supabase-client";
import LeftNavDrawer from "./LeftNavDrawer";

const pageTitle = "Track-Assist";

export default function TopAppBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileMenuAnchorEl, setProfileMenuAnchorEl] =
    useState<null | HTMLElement>(null);
  const [snackbarState, setSnackbarState] = useState<{
    open: boolean;
    message: string;
    status: AlertColor;
  }>({
    open: false,
    message: "",
    status: "info",
  });
  const [session, setSession] = useSession();
  const [isLoaded, setIsLoaded] = useState(false);

  const handleProfileMenuOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    setProfileMenuAnchorEl(e.currentTarget);
  };
  const handleMenuClose = () => {
    setProfileMenuAnchorEl(null);
  };
  const profileMenuOpen = Boolean(profileMenuAnchorEl);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "INITIAL_SESSION") {
        setIsLoaded(true);
      }
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [setSession]);

  const login = () => {
    supabase.auth
      .signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: props.authRedirect,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      })
      .then(() => {
        console.log("promise signed in");
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
              alignItems: "center",
              width: "100%",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
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

              <Typography
                color="primary.contrastText"
                variant="h6"
                noWrap
                component="div"
              >
                {pageTitle}
              </Typography>
            </Box>
            <Box>
              {isLoaded ? (
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="user account"
                  aria-controls="profile-menu"
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
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
      <Menu
        anchorEl={profileMenuAnchorEl}
        id="profile-menu"
        keepMounted
        open={profileMenuOpen}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            if (session == null) {
              login();
            } else {
              logout();
            }
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            {session == null ? (
              <Login fontSize="small" />
            ) : (
              <Logout fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText>{`Sign${session == null ? "in" : "out"}`}</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}
