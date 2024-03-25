import { Logout } from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Box,
  Container,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useSession } from "../../hook/useSession";
import { logout } from "../../util/supabase-client";

interface Props {
  leftAction?: React.ReactNode;
  title?: string;
  showProfile?: boolean;
}

export default function TopAppBar({
  leftAction,
  title,
  showProfile = false,
}: Props) {
  // global state
  const [session] = useSession();

  // local state
  const [profileMenuAnchorEl, setProfileMenuAnchorEl] =
    useState<null | HTMLElement>(null);

  // local vars
  const handleProfileMenuOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    setProfileMenuAnchorEl(e.currentTarget);
  };
  const handleMenuClose = () => {
    setProfileMenuAnchorEl(null);
  };
  const profileMenuOpen = Boolean(profileMenuAnchorEl);

  return (
    <Box>
      <AppBar
        position="fixed"
        color="transparent"
        sx={{
          boxShadow: "none",
          borderBottom: "1px solid rgba(0, 0, 0, 0.23)",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>{leftAction}</Box>
              <Box>
                {title && <Typography variant="h6">{title}</Typography>}
              </Box>
              <Box>
                {showProfile && (
                  <Tooltip title="Open settings">
                    <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0 }}>
                      <Avatar
                        alt={session?.user.user_metadata?.["full_name"]}
                        src={session?.user.user_metadata?.["picture"]}
                      />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Toolbar />
      <Menu
        anchorEl={profileMenuAnchorEl}
        id="profile-menu"
        keepMounted
        open={profileMenuOpen}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            logout().then(() => {
              handleMenuClose();
            });
          }}
        >
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          <ListItemText>Signout</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
}
