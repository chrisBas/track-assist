import { Box, Grid, TextField, Typography } from "@mui/material";
import useLocalStorage from "../hook/useLocalStorage";

function formatValue(n: number) {
  const decimals = 1000000; // 6
  return `${Math.round(n * 100 * decimals) / decimals}%`;
}

export default function DropChanceCalculator() {
  const [{ droprate, threshold, kills }, set] = useLocalStorage<{
    droprate: number | "";
    threshold: number | "";
    kills: number | "";
  }>("dropchancecalculator", { droprate: 0, threshold: 0, kills: 0 });

  const setDroprate = (droprate: number | "") => {
    set((old) => ({ ...old, droprate }));
  };
  const setKills = (kills: number | "") => {
    set((old) => ({ ...old, kills }));
  };
  const setThreshold = (threshold: number | "") => {
    set((old) => ({ ...old, threshold }));
  };

  const probParts = Array.from({
    length: threshold ? Math.ceil((kills || 0) / threshold) : 1,
  });
  const parts = probParts.map((_, idx) => {
    // if there are multiple parts, all parts except the last will be the threshold #
    // else, it will be the kills after the last threshold
    const killInPart =
      idx + 1 < probParts.length
        ? threshold
        : (kills || 0) - (threshold || 0) * idx;

    const prob = 1 - Math.pow(1 - (idx + 1) / (droprate || 1), killInPart || 0);
    return prob;
  });
  const probability = 1 - parts.reduce((acc, cur) => acc * (1 - cur), 1);

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Droprate"
            placeholder="1/droprate"
            type="number"
            value={droprate}
            onChange={(e) =>
              setDroprate(e.target.value ? parseInt(e.target.value) : "")
            }
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Threshold"
            type="number"
            value={threshold}
            onChange={(e) =>
              setThreshold(e.target.value ? parseInt(e.target.value) : "")
            }
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Kills"
            type="number"
            value={kills}
            onChange={(e) =>
              setKills(e.target.value ? parseInt(e.target.value) : "")
            }
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">{`Probability: ${formatValue(
            probability
          )}`}</Typography>
        </Grid>
      </Grid>
    </Box>
  );
}
