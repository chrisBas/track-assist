import { Box } from "@mui/material";

interface Props {
  children: React.ReactNode;
}

export default function FlexEnd({ children }: Props) {
  return <Box sx={{ display: "flex", justifyContent: "end" }}>{children}</Box>;
}
