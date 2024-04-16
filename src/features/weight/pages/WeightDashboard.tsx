import { Box } from '@mui/material';
import dayjs from 'dayjs';

import CommonAreaChart from '../../common/components/CommonLineChart';
import { useMetrics } from '../hooks/useMetrics';

export default function WeightDashboard() {
  // global state
  const { items: allMetrics } = useMetrics();

  // local vars
  const weights = allMetrics.filter((metric) => metric.metric === 'weight (lbs)');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          aspectRatio: '1',
          maxHeight: '400px',
          width: '100%',
          py: 2,
          px: 1,
        }}
      >
        <CommonAreaChart
          title="Weight (lbs)"
          data={weights.map((weight) => ({
            datetime: dayjs(weight.datetime).startOf('day').unix(),
            value: weight.value,
          }))}
          xAxisDataKey={'datetime'}
        />
      </Box>
    </Box>
  );
}
