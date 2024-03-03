import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import { Box, Button, IconButton, Snackbar } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import {
  TokenResponse,
  googleLogout,
  useGoogleLogin,
} from "@react-oauth/google";
import axios from "axios";
import { useEffect, useState } from "react";
import useActivePage from "../hook/useActivePage";
import LeftNavDrawer from "./LeftNavDrawer";

const pageTitle = "Common Tools";

type UserToken = Omit<
  TokenResponse,
  "error" | "error_description" | "error_uri"
>;
type UserInfo = {
  email: string;
  family_name: string;
  given_name: string;
  hd?: string;
  id: string;
  locale: string;
  name: string;
  picture: string;
  verified_email: boolean;
};

export default function TopAppBar() {
  const { setActivePage } = useActivePage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: "",
  });
  // TODO change to global state
  // TODO change to local storage
  const [userToken, setUserToken] = useState<UserToken | null>(null);
  const [profile, setProfile] = useState<UserInfo | null>(null);

  useEffect(() => {
    if (userToken != null && profile == null) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${userToken.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${userToken.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          // TODO: change to a more specific type
          setProfile(res.data);
          setSnackbarState({
            open: true,
            message: "User logged in Successfully",
          });
        })
        .catch((err) => {
          setSnackbarState({
            open: true,
            message: "Failed to get user profile",
          });
          console.error(err);
        });
    }
  }, [userToken, profile]);

  const login = useGoogleLogin({
    onSuccess: (response) => {
      setUserToken(response);
    },
    onError: (response) => {
      setSnackbarState({ open: true, message: "Failed to get user token" });
      console.error(response);
    },
  });
  const logout = () => {
    googleLogout();
    setProfile(null);
    setUserToken(null);
    setSnackbarState({
      open: true,
      message: "User logged out successfully",
    });
  };
  const onSnackbarClose = () => {
    setSnackbarState((prev) => ({ ...prev, open: false }));
  };
  const onSnackbarTransitionEnd = () => {
    if (!snackbarState.open) {
      setSnackbarState({ open: false, message: "" });
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
              {userToken == null ? (
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
        message={snackbarState.message}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={onSnackbarClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </>
  );
}
