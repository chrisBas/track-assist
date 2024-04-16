import { useState } from 'react';
import { Button, Stack, TextField } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';

import useActiveApp from '../../common/hooks/useActiveApp';
import { toDatetimeString } from '../../common/utils/date-utils';
import { useMetrics } from '../hooks/useMetrics';

type ErrorType = { msg: string; target: 'datetime' | 'weight' };

export default function NewWeightEntry() {
  // global state
  const { items: allMetrics, add: addMetric } = useMetrics();
  const { setActiveApp, goBack } = useActiveApp();

  // local vars
  const weights = allMetrics.filter((metric) => metric.metric === 'weight (lbs)');

  // local state
  const [datetime, setDatetime] = useState<Dayjs | null>(dayjs());
  const [weight, setWeight] = useState<string>(weights.length > 0 ? `${weights[0].value}` : '');
  const [errors, setErrors] = useState<ErrorType[]>([]);

  // local vars
  const validateForm = () => {
    const errors: ErrorType[] = [];
    if (weight === '') {
      errors.push({ msg: 'Required', target: 'weight' });
    }
    if (datetime === null) {
      errors.push({ msg: 'Required', target: 'datetime' });
    }
    if (errors.length > 0) {
      setErrors(errors);
      return false;
    }
    return true;
  };

  return (
    <Stack px={1} py={2} spacing={1}>
      <DateTimePicker
        slotProps={{
          textField: {
            size: 'small',
            error: errors.some((error) => error.target === 'datetime'),
            helperText: errors.find((error) => error.target === 'datetime')?.msg,
          },
        }}
        sx={{ width: '100%' }}
        value={datetime}
        onChange={(value) => {
          setDatetime(value);
          setErrors((prev) => prev.filter((error) => error.target !== 'datetime'));
        }}
      />
      <TextField
        label="Weight"
        size="small"
        value={weight}
        type="number"
        error={errors.some((error) => error.target === 'weight')}
        helperText={errors.find((error) => error.target === 'weight')?.msg}
        onChange={(e) => {
          setWeight(e.target.value);
          setErrors((prev) => prev.filter((error) => error.target !== 'weight'));
        }}
        required
        autoFocus
      />
      <Stack direction="row" spacing={1} justifyContent="center">
        <Button
          color="primary"
          variant="outlined"
          fullWidth
          onClick={async () => {
            if (validateForm()) {
              addMetric({
                datetime: toDatetimeString(datetime!),
                value: parseFloat(weight),
                metric: 'weight (lbs)',
              }).then(() => {
                setActiveApp((prev) => ({ ...prev, page: 'Weight Tracker' }));
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
