import { Box, Grid, TextField, Typography } from "@mui/material";
import useLocalStorage from "../hook/useLocalStorage";

function formatNum(n: number) {
  let s = `${n}`;
  for (let i = s.length - 3; i > 0; i -= 3) {
    s = s.slice(0, i) + "," + s.slice(i);
  }
  return s;
}

export default function CrystalUrchinCalculator() {
  const [
    { large: largeCount, med: medCount, small: smallCount },
    setUrchinCounts,
  ] = useLocalStorage<{
    large?: number;
    med?: number;
    small?: number;
  }>("urchinCounts", {
    large: 0,
    med: 0,
    small: 0,
  });
  const urchinPoints =
    (largeCount || 0) * 3 + (medCount || 0) * 2 + (smallCount || 0);

  return (
    <Box>
      {" "}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            type="number"
            label="Large Urchin"
            value={largeCount}
            onChange={(e) =>
              setUrchinCounts((old) => ({
                ...old,
                large: e.target.value ? parseInt(e.target.value) : undefined,
              }))
            }
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            type="number"
            label="Medium Urchin"
            value={medCount}
            onChange={(e) =>
              setUrchinCounts((old) => ({
                ...old,
                med: e.target.value ? parseInt(e.target.value) : undefined,
              }))
            }
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            type="number"
            label="Small Urchin"
            value={smallCount}
            onChange={(e) =>
              setUrchinCounts((old) => ({
                ...old,
                small: e.target.value ? parseInt(e.target.value) : undefined,
              }))
            }
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">{`Points: ${formatNum(urchinPoints)}  (${
            largeCount || 0
          } large, ${medCount || 0} med, ${
            smallCount || 0
          } small)`}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">{`Xp: ${formatNum(
            urchinPoints * 10
          )}`}</Typography>
        </Grid>
      </Grid>
    </Box>
  );
}
