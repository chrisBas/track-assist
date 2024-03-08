import { Box, Button, Grid, TextField } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { Dayjs } from "dayjs";
import React, { useState } from "react";
import CommonAutocomplete from "../component/CommonAutocomplete";
import { AutocompleteOptionType } from "../type/AutocompleteOptionType";
import { DietRecord } from "../type/DietRecord";

const initDietRecords: DietRecord[] = [];

const initFoodOptions: AutocompleteOptionType[] = [
  { value: "steak", label: "Steak" },
];
const initUnitOptions: AutocompleteOptionType[] = [
  { value: "ounce", label: "Ounce" },
];

export default function DietTracker() {
  // state vars
  const [dietRecords, setDietRecords] = useState(initDietRecords);

  const [foodOptions, setFoodOptions] = useState(initFoodOptions);
  const [unitOptions, setUnitOptions] = useState(initUnitOptions);

  const [selectedFood, setSelectedFood] = useState<null | string>(null);
  const [datetime, setDateTime] = useState<Dayjs | null>(dayjs());
  const [selectedUnit, setSelectedUnit] = useState<null | string>(null);
  const [unitQty, setUnitQty] = useState<number | null>(null);
  const [calories, setCalories] = useState<number | null>(null);

  // local vars
  const onAdd = () => {
    if (selectedFood && datetime && selectedUnit && unitQty && calories) {
      const record: DietRecord = {
        id: Math.random(),
        food: selectedFood,
        unit: selectedUnit,
        datetime,
        unitQty,
        calories,
      };
      setDietRecords((prev) => [...prev, record]);
      onReset();
    }
  };

  const onReset = () => {
    setSelectedFood(null);
    setDateTime(dayjs());
    setSelectedUnit(null);
    setUnitQty(null);
    setCalories(null);
    setFoodOptions(initFoodOptions);
    setUnitOptions(initUnitOptions);
  };

  const onEdit = (id: number) => {
    const record = dietRecords.find((record) => record.id === id);
    if (record) {
      setSelectedFood(record.food);
      setDateTime(record.datetime);
      setSelectedUnit(record.unit);
      setUnitQty(record.unitQty);
      setCalories(record.calories);
    }
  };

  return (
    <Box>
      <Grid container spacing={1}>
        <Grid item xs={2} sx={{ margin: "auto" }}>
          <DateTimePicker
            slotProps={{ textField: { size: "small" } }}
            sx={{ width: "100%" }}
            value={datetime}
            onChange={(value) => {
              setDateTime(value);
            }}
          />
        </Grid>
        <Grid item xs={2} sx={{ margin: "auto" }}>
          <CommonAutocomplete
            size="small"
            label="Select food..."
            sx={{ width: "100%" }}
            value={selectedFood}
            onSelect={setSelectedFood}
            onCreate={(value) => {
              setSelectedFood(value);
              setFoodOptions([...initFoodOptions, { value, label: value }]);
            }}
            options={foodOptions}
          />
        </Grid>
        <Grid item xs={2} sx={{ margin: "auto" }}>
          <CommonAutocomplete
            size="small"
            label="Select unit..."
            sx={{ width: "100%" }}
            value={selectedUnit}
            onSelect={setSelectedUnit}
            onCreate={(value) => {
              setSelectedUnit(value);
              setUnitOptions([...initUnitOptions, { value, label: value }]);
            }}
            options={unitOptions}
          />
        </Grid>
        <Grid item xs={2} sx={{ margin: "auto" }}>
          <TextField
            size="small"
            sx={{ width: "100%" }}
            label="Unit qty..."
            type="number"
            value={unitQty == null ? "" : unitQty}
            onChange={(e) => {
              setUnitQty(
                e.target.value === "" ? null : parseFloat(e.target.value)
              );
            }}
          />
        </Grid>
        <Grid item xs={2} sx={{ margin: "auto" }}>
          <TextField
            size="small"
            sx={{ width: "100%" }}
            label="Calories..."
            type="number"
            value={calories == null ? "" : calories}
            onChange={(e) => {
              setCalories(
                e.target.value === "" ? null : parseFloat(e.target.value)
              );
            }}
          />
        </Grid>
        <Grid item xs={1} sx={{ margin: "auto" }}>
          <Button
            sx={{ width: "100%" }}
            variant="contained"
            color="success"
            onClick={() => {
              onAdd();
            }}
            disabled={
              !(selectedFood && datetime && selectedUnit && unitQty && calories)
            }
          >
            Add
          </Button>
        </Grid>
        <Grid item xs={1} sx={{ margin: "auto" }}>
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
      </Grid>
      <Grid container spacing={1} py={4}>
        <Grid item xs={2} sx={{ margin: "auto" }}>
          Datetime
        </Grid>
        <Grid item xs={2} sx={{ margin: "auto" }}>
          Food
        </Grid>
        <Grid item xs={2} sx={{ margin: "auto" }}>
          Unit
        </Grid>
        <Grid item xs={2} sx={{ margin: "auto" }}>
          Unit Qty
        </Grid>
        <Grid item xs={2} sx={{ margin: "auto" }}>
          Calories
        </Grid>
        <Grid item xs={2} sx={{ margin: "auto" }}>
          Action
        </Grid>
        {dietRecords.map((record, index) => {
          return (
            <React.Fragment key={index}>
              <Grid item xs={2} sx={{ margin: "auto" }}>
                {record.datetime.format("YYYY-MM-DD HH:mm")}
              </Grid>
              <Grid item xs={2} sx={{ margin: "auto" }}>
                {record.food}
              </Grid>
              <Grid item xs={2} sx={{ margin: "auto" }}>
                {record.unit}
              </Grid>
              <Grid item xs={2} sx={{ margin: "auto" }}>
                {record.unitQty}
              </Grid>
              <Grid item xs={2} sx={{ margin: "auto" }}>
                {record.calories}
              </Grid>
              <Grid item xs={2} sx={{ margin: "auto" }}>
                <Button
                  sx={{ width: "100%" }}
                  variant="contained"
                  color="success"
                  onClick={() => {
                    onEdit(record.id);
                  }}
                >
                  Edit
                </Button>
              </Grid>
            </React.Fragment>
          );
        })}
      </Grid>
    </Box>
  );
}
