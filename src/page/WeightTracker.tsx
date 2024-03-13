import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import CommonAutocomplete from "../component/CommonAutocomplete";
import { Metric, useMetrics } from "../hook/useMetrics";
import { SpecificRecord } from "../hook/useSupabaseData";

const COMMON_DATE_FORMAT = "YYYY-MM-DDTHH:mm:ss";

export default function WeightTracker() {
  const {
    items: metrics,
    add: addMetric,
    delete: deleteMetric,
    update: updateMetric,
  } = useMetrics();
  const [metricId, setMetricId] = useState<number | null>(null);
  const [datetime, setDatetime] = useState<Dayjs | null>(null);
  const [metric, setMetric] = useState<string | null>(null);
  const [value, setValue] = useState<number | null>(null);

  // local vars
  const metricOptions = [
    ...metrics.reduce((set, metric) => {
      set.add(metric.metric);
      return set;
    }, new Set()),
  ].map((metric) => ({ label: metric as string, value: metric as string }));
  const onMetricSeleted = (metric: string | null, isNew: boolean) => {
    if (!isNew) {
      if (metric == null) {
        setValue(null);
      } else {
        const firstMetric = metrics.find((m) => m.metric === metric)!;
        setValue(firstMetric.value);
      }
    }
    setMetric(metric);
  };
  const onReset = () => {
    setMetricId(null);
    setDatetime(null);
    setMetric(null);
    setValue(null);
  };
  const onAdd = () => {
    if (metricId == null) {
      addMetric({
        metric: metric!,
        value: value!,
        datetime: (datetime || dayjs()).format(COMMON_DATE_FORMAT),
      });
    } else {
      updateMetric({
        id: metricId,
        metric: metric!,
        value: value!,
        datetime: (datetime || dayjs()).format(COMMON_DATE_FORMAT),
      });
    }
    onReset();
  };
  const onEdit = (metric: SpecificRecord<Metric>) => {
    setMetricId(metric.id);
    setDatetime(dayjs(metric.datetime));
    setMetric(metric.metric);
    setValue(metric.value);
  };
  const onDelete = () => {
    if (metricId != null) {
      deleteMetric(metricId);
      onReset();
    }
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={4} lg={3} sx={{ margin: "auto" }}>
          <DateTimePicker
            slotProps={{ textField: { size: "small" } }}
            sx={{ width: "100%" }}
            value={datetime}
            onChange={setDatetime}
          />
        </Grid>
        <Grid item xs={4} lg={3} sx={{ margin: "auto" }}>
          <CommonAutocomplete
            size="small"
            label="Select metric..."
            sx={{ width: "100%" }}
            value={metric}
            onSelect={(value) => {
              onMetricSeleted(value, false);
            }}
            onCreate={(value) => {
              onMetricSeleted(value, true);
            }}
            options={metricOptions}
          />
        </Grid>
        <Grid item xs={4} lg={3} sx={{ margin: "auto" }}>
          <TextField
            size="small"
            sx={{ width: "100%" }}
            label="Value..."
            type="number"
            value={value == null ? "" : value}
            onChange={(e) => {
              const value =
                e.target.value === "" ? null : parseFloat(e.target.value);
              setValue(value);
            }}
          />
        </Grid>
        <Grid item xs={4} lg={1} sx={{ margin: "auto" }}>
          <Button
            sx={{ width: "100%" }}
            variant="contained"
            color="success"
            onClick={() => {
              onAdd();
            }}
            disabled={metric == null || value == null}
          >
            {metricId == null ? "Add" : "Update"}
          </Button>
        </Grid>
        <Grid item xs={4} lg={1} sx={{ margin: "auto" }}>
          <Button
            sx={{ width: "100%" }}
            variant="contained"
            color="warning"
            onClick={() => {
              onReset();
            }}
          >
            Reset
          </Button>
        </Grid>
        <Grid item xs={4} lg={1} sx={{ margin: "auto" }}>
          <Button
            sx={{ width: "100%" }}
            variant="contained"
            color="error"
            onClick={() => {
              onDelete();
            }}
            disabled={metricId == null}
          >
            Delete
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={2} py={2}>
        <Grid item xs={12} md={5}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="body2" fontWeight="bold">
                    Datetime
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" fontWeight="bold">
                    Value
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" fontWeight="bold">
                    Metric
                  </Typography>
                </Grid>
                {metrics.map((metric) => {
                  return (
                    <Grid
                      px={2}
                      py={1}
                      container
                      key={metric.id}
                      sx={{
                        cursor: "pointer",
                        "&:hover": { backgroundColor: "#eaeaea" },
                      }}
                      onClick={() => {
                        onEdit(metric);
                      }}
                    >
                      <Grid item xs={4}>
                        <Typography variant="body2">
                          {dayjs(metric.datetime).format("YYYY-MM-DD HH:mm")}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2">{metric.value}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2">{metric.metric}</Typography>
                      </Grid>
                    </Grid>
                  );
                })}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={7}>
          <Card sx={{ height: "100%" }}>
            <CardContent>Chart goes here...</CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
