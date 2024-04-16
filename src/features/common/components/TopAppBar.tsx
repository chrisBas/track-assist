import React, { useState } from 'react';
import { Logout } from '@mui/icons-material';
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
} from '@mui/material';

import { useSession } from '../hooks/useSession';
import { logout } from '../utils/supabase-client';

export interface Props {
  leftAction?: React.ReactNode;
  title?: string | React.ReactNode;
  showProfile?: boolean;
  row2?: React.ReactNode;
}

export default function TopAppBar({ leftAction, title, showProfile = false, row2 }: Props) {
  // global state
  const [session] = useSession();

  // local state
  const [profileMenuAnchorEl, setProfileMenuAnchorEl] = useState<null | HTMLElement>(null);

  // local vars
  const handleProfileMenuOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    setProfileMenuAnchorEl(e.currentTarget);
  };
  const handleMenuClose = () => {
    setProfileMenuAnchorEl(null);
  };
  const profileMenuOpen = Boolean(profileMenuAnchorEl);
  const isTitleString = typeof title === 'string';

  return (
    <Box>
      <AppBar
        position="static"
        color="inherit"
        sx={{
          mb: '8px',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={{
              ...(row2 === undefined ? {} : { display: 'flex', flexDirection: 'column', pt: 2 }),
            }}
          >
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box>{leftAction}</Box>
              {title && (isTitleString ? <Typography variant="body1">{title}</Typography> : title)}
              <Box>
                {showProfile && (
                  <Tooltip title="Open settings">
                    <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0 }}>
                      <Avatar
                        sx={{ width: 36, height: 36 }}
                        alt={session?.user.user_metadata?.['full_name']}
                        src={session?.user.user_metadata?.['picture']}
                      />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </Box>
            {row2 && <Box sx={{ width: '100%' }}>{row2}</Box>}
          </Toolbar>
        </Container>
      </AppBar>
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
