import { useState } from 'react';
import { Button, Stack, TextField } from '@mui/material';

import useActiveApp from '../../common/hooks/useActiveApp';
import { useGroupUsers } from '../hooks/useGroupUsers';
import { useGroups } from '../hooks/useGroups';
import { useProfile } from '../hooks/useProfile';

export default function GroupCreation() {
  // global state
  const { setActiveApp, goBack } = useActiveApp();
  const { items: profiles } = useProfile();
  const { add: createGroup } = useGroups();
  const { add: createGroupUser } = useGroupUsers();

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
    group: {
      value: '',
      error: false,
      helperText: '',
      required: false,
    },
  });

  // local vars
  const profile = profiles[0]!;
  const validateForm = () => {
    if (form.group.value === '') {
      setForm((prev) => {
        return {
          ...prev,
          group: {
            ...form.group,
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
      <TextField
        label="Group"
        size="small"
        {...form.group}
        onChange={(e) => {
          setForm((prev) => {
            return {
              ...prev,
              group: {
                ...form.group,
                value: e.target.value,
                error: false,
                helperText: '',
              },
            };
          });
        }}
        error={form.group.error}
        helperText={form.group.helperText}
      />
      <Stack direction="row" spacing={1} justifyContent="center">
        <Button
          color="primary"
          variant="outlined"
          fullWidth
          onClick={() => {
            if (validateForm()) {
              createGroup({
                group_name: form.group.value,
              })
                .then(() => {
                  createGroupUser({
                    group_name: form.group.value,
                    username: profile.username,
                  }).then(() => {
                    setActiveApp((prev) => ({
                      ...prev,
                      page: 'Group Assign',
                    }));
                  });
                })
                .catch(() => {
                  setForm((prev) => {
                    return {
                      ...prev,
                      group: {
                        ...form.group,
                        error: true,
                        helperText: 'Group already exists',
                      },
                    };
                  });
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
