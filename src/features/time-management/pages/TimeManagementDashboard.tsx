import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Box, Card, CardContent, IconButton, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";
import { useWorkActivity } from "../hooks/useWorkActivity";
import { toDateString } from "../../common/utils/date-utils";

export default function TimeManagementDashboard() {
  // global state
  const { activities } = useWorkActivity();

  // local state
  const [datetime, setDatetime] = useState(dayjs());

  // local vars
  const sunday = datetime.startOf("week");
  const saturday = datetime.endOf("week");
  const totalMinutes = activities
    .filter((activity) => {
      const date = dayjs(activity.start_time);
      return date >= sunday && date <= saturday;
    })
    .reduce((acc, activity) => {
      const start = dayjs(activity.start_time);
      const end = dayjs(activity.end_time);
      return acc + end.diff(start, "minutes", true);
    }, 0);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ flexGrow: 1, overflow: "scroll" }}>
        <Card sx={{ mx: 2, my: 2 }}>
          <CardContent>
            <Typography variant="body1" fontWeight="bold" gutterBottom>
              Weekly Hours
            </Typography>
            <Typography variant="body2" gutterBottom textAlign="center">
              {`${hours} Hours ${minutes} Minutes Total`}
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <IconButton
                onClick={() => {
                  setDatetime(datetime.subtract(1, "week"));
                }}
              >
                <ChevronLeft />
              </IconButton>
              <Typography
                variant="body2"
                textAlign="center"
                m="auto"
              >{`${toDateString(sunday)} to ${toDateString(
                saturday
              )}`}</Typography>
              <IconButton
                onClick={() => {
                  setDatetime(datetime.add(1, "week"));
                }}
              >
                <ChevronRight />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
