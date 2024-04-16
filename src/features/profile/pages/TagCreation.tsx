import { Button, Stack, TextField } from '@mui/material';
import { useState } from 'react';

import useActiveApp from '../../common/hooks/useActiveApp';
import { useTags } from '../hooks/useTags';
import { useGroupUserStore } from '../store/useGroupUserStore';

export default function TagCreation() {
  // global state
  const { setActiveApp, goBack } = useActiveApp();
  const { add: createTag } = useTags();
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
    name: {
      value: '',
      error: false,
      helperText: '',
      required: false,
    },
  });

  // local vars
  const validateForm = () => {
    if (form.name.value === '') {
      setForm((prev) => {
        return {
          ...prev,
          name: {
            ...form.name,
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
        label="Tag Name"
        size="small"
        {...form.name}
        onChange={(e) => {
          setForm((prev) => {
            return {
              ...prev,
              name: {
                ...form.name,
                value: e.target.value,
                error: false,
                helperText: '',
              },
            };
          });
        }}
        error={form.name.error}
        helperText={form.name.helperText}
        autoFocus
      />
      <Stack direction="row" spacing={1} justifyContent="center">
        <Button
          color="primary"
          variant="outlined"
          fullWidth
          onClick={() => {
            if (validateForm()) {
              createTag({
                group_name: groupName,
                name: form.name.value,
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
