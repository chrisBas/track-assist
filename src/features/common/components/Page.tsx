import {
  Box
} from "@mui/material";
import FabAdd from "../../common/components/FabAdd";
import TopAppBar, { Props as TopAppBarProps } from "../../common/components/TopAppBar";
interface Props {
  topAppBar?: TopAppBarProps;
  children: React.ReactNode;
  onFabAdd?: () => void;
}

export default function Page({ topAppBar, onFabAdd, children }: Props) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {topAppBar && <TopAppBar {...topAppBar} />}
      <Box
        sx={{
          flexGrow: 1,
          overflow: 'scroll',
          paddingBottom: onFabAdd ? '88px' : undefined,
        }}
      >
        {children}
      </Box>
      {onFabAdd && <FabAdd onClick={onFabAdd} />}
    </Box>
  );
}
