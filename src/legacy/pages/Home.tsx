import { Container, Typography } from "@mui/material";

export default function Home() {
  return (
    <Container
      sx={{
        height: "calc(100vh - 64px - 24px - 24px)",
        justifyContent: "center",
        alignItems: "middle",
        display: "flex",
      }}
    >
      <Typography variant="h6">
        A simple compilation of various tools that you might find helpful.
      </Typography>
    </Container>
  );
}
