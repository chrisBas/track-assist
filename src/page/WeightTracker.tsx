import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  TextField,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import CommonAreaChart from "../component/CommonAreaChart";
import CommonAutocomplete from "../component/CommonAutocomplete";
import CommonCard from "../component/CommonCard";
import CommonModal from "../component/CommonModal";
import ConfirmDeleteModal from "../component/ConfirmDeleteModal";
import FabAdd from "../component/FabAdd";
import FlexEnd from "../component/FlexEnd";
import { Metric, useMetrics } from "../hook/useMetrics";
import { SpecificRecord } from "../hook/useSupabaseData";

const COMMON_DATE_FORMAT = "YYYY-MM-DDTHH:mm:ss";
const DATE_TIME_FORMAT = "HH:mm MMM DD, YYYY";

export default function WeightTracker() {
  const {
    items: metrics,
    add: addMetric,
    delete: deleteMetric,
    update: updateMetric,
  } = useMetrics();
  const [metricId, setMetricId] = useState<string | null>(null);
  const [datetime, setDatetime] = useState<Dayjs | null>(null);
  const [metric, setMetric] = useState<string | null>(null);
  const [value, setValue] = useState<number | null>(null);
  const [addEditModalOpen, setAddEditModalOpen] = useState(false);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState<{
    open: boolean;
    id: string | null;
  }>({ open: false, id: null });

  // local vars
  const canAdd = metric == null || value == null;
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
    if (!canAdd) {
      addMetric({
        metric: metric!,
        value: value!,
        datetime: (datetime || dayjs()).format(COMMON_DATE_FORMAT),
      });
    } else {
      updateMetric({
        id: metricId!,
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
    setAddEditModalOpen(true);
  };
  const onDelete = (id: string) => {
    deleteMetric(id);
    onReset();
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent
              sx={{ aspectRatio: "3 / 2", maxHeight: "400px", width: "100%" }}
            >
              <CommonAreaChart
                data={metrics.map((metric) => ({
                  datetime: dayjs(metric.datetime).unix(),
                  value: metric.value,
                }))}
                xAxisDataKey={"datetime"}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ px: 2 }}>
            {metrics.map((record, idx) => {
              return (
                <CommonCard
                  key={record.id}
                  title={`${record.value}`}
                  subtitle={dayjs(record.datetime).format(DATE_TIME_FORMAT)}
                  sx={{
                    mt: idx === 0 ? 0 : 2,
                    mb: idx === metrics.length - 1 ? 0 : 2,
                  }}
                  onSelect={() => {
                    onEdit(record);
                  }}
                  onDelete={() => {
                    setConfirmDeleteModal({
                      id: record.id,
                      open: true,
                    });
                  }}
                />
              );
            })}
          </Box>
        </Grid>
      </Grid>
      <ConfirmDeleteModal
        open={confirmDeleteModal.open}
        onClose={() => {
          setConfirmDeleteModal({ id: null, open: false });
        }}
        onDelete={() => {
          onDelete(confirmDeleteModal.id!);
          setConfirmDeleteModal({ id: null, open: false });
        }}
      />
      <CommonModal
        open={addEditModalOpen}
        onClose={() => {
          onReset();
          setAddEditModalOpen(false);
        }}
        title={`${metricId == null ? "Add" : "Update"} Record`}
      >
        <Stack direction="column" spacing={2}>
          <DateTimePicker
            slotProps={{ textField: { size: "small" } }}
            sx={{ width: "100%" }}
            value={datetime}
            onChange={setDatetime}
          />
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
          <Stack
            direction="row"
            spacing={1}
            justifyContent="flex-end"
            sx={{ pt: 0.5 }}
          ></Stack>
          <FlexEnd>
            <Button
              sx={{ width: "100%" }}
              variant="contained"
              color="success"
              onClick={() => {
                onAdd();
                setAddEditModalOpen(false);
              }}
              disabled={canAdd}
            >
              Save
            </Button>
          </FlexEnd>
        </Stack>
      </CommonModal>
      <FabAdd
        onClick={() => {
          setAddEditModalOpen(true);
        }}
      />
    </Box>
  );
}
