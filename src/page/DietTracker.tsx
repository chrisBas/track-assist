import { Box, Button, Grid, TextField } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { Dayjs } from "dayjs";
import React, { useState } from "react";
import CommonAutocomplete from "../component/CommonAutocomplete";
import { useFoods } from "../hook/useFoods";
import { useUnits } from "../hook/useUnits";
import { DietRecord } from "../type/DietRecord";

const initDietRecords: DietRecord[] = [];

export default function DietTracker() {
  // state vars
  const [dietRecords, setDietRecords] = useState(initDietRecords);
  const { unitsOfMeasurement, addUom } = useUnits();
  const { foods, addFood } = useFoods();
  const foodOptions = foods.map((food) => ({
    label: food.name,
    value: food.name,
  }));
  const unitOptions = unitsOfMeasurement.map((uom) => ({
    label: uom.name,
    value: uom.name,
  }));

  const [selectedFood, setSelectedFood] = useState<null | string>(null);
  const [datetime, setDateTime] = useState<Dayjs | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<null | string>(null);
  const [unitQty, setUnitQty] = useState<number | null>(null);
  const [calories, setCalories] = useState<number | null>(null);

  // local vars
  const isExistingFood =
    selectedFood !== null && foods.some((f) => f.name === selectedFood);
  const isExistingUnit =
    selectedUnit !== null &&
    unitsOfMeasurement.some((uom) => uom.name === selectedUnit);
  const onAdd = async () => {
    if (selectedFood && selectedUnit && unitQty && calories) {
      const unitId: number = !isExistingUnit
        ? (await addUom({ name: selectedUnit, abbreviation: selectedUnit })).id
        : unitsOfMeasurement.find((uom) => uom.name === selectedUnit)!.id;
      const foodId = !isExistingFood
        ? (
            await addFood({
              name: selectedFood,
              unit_id: unitId,
              unit_qty: unitQty,
              calories: calories,
            })
          ).id
        : foods.find((f) => f.name === selectedFood)!.id;

        // TODO;
      console.log({ foodId, unitId, unitQty });

      const record: DietRecord = {
        id: Math.random(),
        food: selectedFood,
        unit: selectedUnit,
        datetime: datetime == null ? dayjs() : datetime,
        unitQty,
        calories,
      };
      setDietRecords((prev) => [...prev, record]);
      onReset();
    } else {
      console.error({ selectedFood, selectedUnit, unitQty, calories });
      alert("onAdd: missing required fields");
    }
  };

  const onReset = () => {
    setSelectedFood(null);
    setDateTime(null);
    setSelectedUnit(null);
    setUnitQty(null);
    setCalories(null);
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

  const onFoodSelected = (food: string | null, isNew: boolean) => {
    if (food) {
      setSelectedFood(food);
      const selectedFood = foods.find((f) => f.name === food);
      if (selectedFood !== undefined && !isNew) {
        const selectedUnit = unitsOfMeasurement.find(
          (uom) => uom.id === selectedFood.unit_id
        );
        if (selectedUnit === undefined) {
          // shouldnt be possible (if it is, there is a code bug)
          alert(`onFoodSelected: unit_id not found "${selectedFood.unit_id}"`);
        } else {
          setUnitQty(selectedFood.unit_qty);
          setCalories(selectedFood.calories);
          setSelectedUnit(selectedUnit.name);
        }
      } else if (selectedFood === undefined && isNew) {
        // TODO: create new + update state
      } else {
        // shouldnt be possible (if it is, there is a code bug)
        alert(`onFoodSelected: food not found "${food}"`);
      }
    } else {
      onReset();
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
            onSelect={(value) => {
              onFoodSelected(value, false);
            }}
            onCreate={(value) => {
              onFoodSelected(value, true);
            }}
            options={foodOptions}
          />
        </Grid>
        <Grid item xs={2} sx={{ margin: "auto" }}>
          <CommonAutocomplete
            size="small"
            label="Select unit..."
            disabled={isExistingFood}
            sx={{ width: "100%" }}
            value={selectedUnit}
            onSelect={setSelectedUnit}
            onCreate={(value) => {
              setSelectedUnit(value);
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
            disabled={isExistingFood}
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
            disabled={!(selectedFood && selectedUnit && unitQty && calories)}
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
