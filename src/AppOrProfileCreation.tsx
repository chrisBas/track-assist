import { useState } from 'react';
import { Box, Button, Stack, TextField } from '@mui/material';

import App from './App';
import AppIconLoadingScreen from './features/common/components/AppIconLoadingScreen';
import TopAppBar from './features/common/components/TopAppBar';
import { useProfile } from './features/profile/hooks/useProfile';

export default function AppOrProfileCreation() {
  // global state
  const { items: profileList, add: createProfile, isLoaded: isProfileLoaded } = useProfile();

  // local state
  const [username, setUsername] = useState('');
  const [errMsg, setErrMsg] = useState('');

  if (!isProfileLoaded) {
    return <AppIconLoadingScreen />;
  } else if (profileList.length === 0) {
    return (
      <Box>
        <TopAppBar title="Create Profile" showProfile />
        <Stack pt={1} spacing={2} sx={{ px: '10%' }}>
          <TextField
            error={errMsg !== ''}
            label={errMsg}
            placeholder="New Username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            autoFocus
          />
          <Button
            variant="contained"
            onClick={() => {
              createProfile({ username }).catch((reason) => {
                if (reason.code === '23505') {
                  setErrMsg('Username already exists');
                } else if (reason.code === '23514') {
                  setErrMsg('Username must contain at least 3 characters');
                } else {
                  setErrMsg('An unknown error occurred');
                }
              });
            }}
          >
            Create Profile
          </Button>
        </Stack>
      </Box>
    );
  } else {
    return <App />;
  }
}
