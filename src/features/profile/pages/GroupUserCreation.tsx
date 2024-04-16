import { useState } from 'react';
import { Button, Stack, TextField } from '@mui/material';

import useActiveApp from '../../common/hooks/useActiveApp';
import { useGroupUsers } from '../hooks/useGroupUsers';
import { useGroupUserStore } from '../store/useGroupUserStore';

export default function GroupUserCreation() {
  // global state
  const { setActiveApp, goBack } = useActiveApp();
  const { add: createGroupUser } = useGroupUsers();
  const { groupName } = useGroupUserStore();

  // local state
  const [form, setForm] = useState<
    Record<
      string,
      {
        value: string;
        error: boolean;
        helperText: string;
        required: boolean;
      }
    >
  >({
    username: {
      value: '',
      error: false,
      helperText: '',
      required: false,
    },
  });

  // local vars
  const validateForm = () => {
    if (form.username.value === '') {
      setForm((prev) => {
        return {
          ...prev,
          username: {
            ...form.username,
            error: true,
            helperText: 'Required',
          },
        };
      });
      return false;
    }
    return true;
  };

  return (
    <Stack px={1} py={2} spacing={1}>
      <TextField label="Group" size="small" value={groupName} disabled />
      <TextField
        label="Username"
        size="small"
        {...form.username}
        onChange={(e) => {
          setForm((prev) => {
            return {
              ...prev,
              username: {
                ...form.username,
                value: e.target.value,
                error: false,
                helperText: '',
              },
            };
          });
        }}
        error={form.username.error}
        helperText={form.username.helperText}
        autoFocus
      />
      <Stack direction="row" spacing={1} justifyContent="center">
        <Button
          color="primary"
          variant="outlined"
          fullWidth
          onClick={() => {
            if (validateForm()) {
              createGroupUser({
                group_name: groupName,
                username: form.username.value,
              }).then(() => {
                setActiveApp((prev) => ({
                  ...prev,
                  page: 'Group Assign',
                }));
              });
            }
          }}
        >
          Create
        </Button>
        <Button
          color="warning"
          variant="outlined"
          fullWidth
          onClick={() => {
            goBack();
          }}
        >
          Cancel
        </Button>
      </Stack>
    </Stack>
  );
}
