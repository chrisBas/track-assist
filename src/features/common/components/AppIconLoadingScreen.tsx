import { Box } from '@mui/material';

import props from '../../../features/common/utils/props';

export default function AppIconLoadingScreen() {
  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box component="img" alt="Track-Assist" src={`${props.srcPrefix}/logo192.png`} />
    </Box>
  );
}
