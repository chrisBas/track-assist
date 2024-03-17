import DeleteOutline from "@mui/icons-material/DeleteOutline";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  IconButton,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import CommonAutocomplete from "../component/CommonAutocomplete";
import FabAdd from "../component/FabAdd";
import { useDietLog } from "../hook/useDietLog";
import { useFoods } from "../hook/useFoods";
import { useUnits } from "../hook/useUnits";
import { DietRecord } from "../type/DietRecord";

const COMMON_DATE_FORMAT = "YYYY-MM-DDTHH:mm:ss";
const DATE_FORMAT_2 = "HH:mm MMM DD, YYYY";

export default function DietTracker() {
  // state vars
  const {
    isLoaded: isUnitsLoaded,
    items: unitsOfMeasurement,
    add: addUom,
  } = useUnits();
  const { isLoaded: isFoodsLoaded, items: foods, add: addFood } = useFoods();
  const {
    isLoaded: isDietLogLoaded,
    items: dietLogItems,
    add: addDietLog,
    update: updateDietLog,
    delete: deleteDietLog,
  } = useDietLog();
  const foodOptions = foods.map((food) => ({
    label: food.name,
    value: food.name,
  }));
  const unitOptions = unitsOfMeasurement.map((uom) => ({
    label: uom.name,
    value: uom.name,
  }));

  const [dietLogItemId, setDietLogItemId] = useState<null | number>(null);
  const [selectedFood, setSelectedFood] = useState<null | string>(null);
  const [datetime, setDateTime] = useState<Dayjs | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<null | string>(null);
  const [unitQty, setUnitQty] = useState<number | null>(null);
  const [calories, setCalories] = useState<number | null>(null);
  const [addEditModalOpen, setAddEditModalOpen] = useState(false);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState<{
    open: boolean;
    id: number | null;
  }>({ open: false, id: null });

  // local vars
  const isDataLoaded = isUnitsLoaded && isFoodsLoaded && isDietLogLoaded;
  const dietRecords: DietRecord[] = !isDataLoaded
    ? []
    : dietLogItems.map((item) => {
        const food = foods.find((f) => f.id === item.food_id)!;
        return {
          id: item.id,
          datetime: dayjs(item.datetime),
          food: food.name,
          unit: unitsOfMeasurement.find((uom) => uom.id === food.unit_id)!.name,
          unitQty: item.unit_qty,
          calories: Math.round(
            food!.calories * (item.unit_qty / food.unit_qty)
          ),
        };
      });
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

      if (dietLogItemId == null) {
        addDietLog({
          datetime:
            datetime == null
              ? dayjs().format(COMMON_DATE_FORMAT)
              : datetime.format(COMMON_DATE_FORMAT),
          food_id: foodId,
          unit_qty: unitQty,
        });
      } else {
        updateDietLog({
          id: dietLogItemId,
          datetime:
            datetime == null
              ? dayjs().format(COMMON_DATE_FORMAT)
              : datetime.format(COMMON_DATE_FORMAT),
          food_id: foodId,
          unit_qty: unitQty,
        });
      }
      onReset();
    } else {
      console.error({ selectedFood, selectedUnit, unitQty, calories });
      alert("onAdd: missing required fields");
    }
  };

  const onReset = () => {
    setDietLogItemId(null);
    setSelectedFood(null);
    setDateTime(null);
    setSelectedUnit(null);
    setUnitQty(null);
    setCalories(null);
  };

  const onEdit = (id: number) => {
    const record = dietRecords.find((record) => record.id === id);
    if (record) {
      setDietLogItemId(record.id);
      setSelectedFood(record.food);
      setDateTime(record.datetime);
      setSelectedUnit(record.unit);
      setUnitQty(record.unitQty);
      setCalories(record.calories);
      setAddEditModalOpen(true);
    }
  };

  const onDelete = (id: number) => {
    deleteDietLog(id);
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
      {dietRecords.map((record) => {
        return (
          <Card key={record.id} sx={{ my: 2 }}>
            <CardActionArea
              onClick={() => {
                onEdit(record.id);
              }}
            >
              <CardContent>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="subtitle1" fontWeight={500}>
                    {`(${record.unitQty}${
                      record.unit === "individual" ? "" : ` ${record.unit}`
                    }) ${record.food}`}
                  </Typography>
                  <IconButton
                    aria-label="delete"
                    size="small"
                    onClick={(e) => {
                      setConfirmDeleteModal({ id: record.id, open: true });
                      e.stopPropagation();
                    }}
                  >
                    <DeleteOutline />
                  </IconButton>
                </Stack>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  color="gray"
                >
                  <Typography variant="body2" fontWeight={500}>
                    {record.datetime.format(DATE_FORMAT_2)}
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight={500}
                  >{`${record.calories} cal`}</Typography>
                </Stack>
              </CardContent>
            </CardActionArea>
          </Card>
        );
      })}
      <Modal
        open={confirmDeleteModal.open}
        onClose={() => {
          setConfirmDeleteModal({ id: null, open: false });
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #eaeaea",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography
            variant="h6"
            fontWeight={500}
          >{`Are you sure you want to delete ${confirmDeleteModal.id}?`}</Typography>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              onDelete(confirmDeleteModal.id!);
              setConfirmDeleteModal({ id: null, open: false });
            }}
          >
            Delete
          </Button>
        </Box>
      </Modal>
      <Modal
        open={addEditModalOpen}
        onClose={() => {
          onReset();
          setAddEditModalOpen(false);
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #eaeaea",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Grid container spacing={1}>
            <Grid item xs={12} md={6} lg={2} sx={{ margin: "auto" }}>
              <DateTimePicker
                slotProps={{ textField: { size: "small" } }}
                sx={{ width: "100%" }}
                value={datetime}
                onChange={(value) => {
                  setDateTime(value);
                }}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={2} sx={{ margin: "auto" }}>
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
            <Grid item xs={12} md={6} lg={2} sx={{ margin: "auto" }}>
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
            <Grid item xs={12} md={6} lg={2} sx={{ margin: "auto" }}>
              <TextField
                size="small"
                sx={{ width: "100%" }}
                label="Unit qty..."
                type="number"
                value={unitQty == null ? "" : unitQty}
                onChange={(e) => {
                  const unitQty =
                    e.target.value === "" ? null : parseFloat(e.target.value);
                  setUnitQty(unitQty);
                  if (isExistingFood) {
                    const food = foods.find((f) => f.name === selectedFood)!;
                    if (unitQty == null) {
                      setCalories(food.calories);
                    } else {
                      setCalories((food.calories * unitQty) / food.unit_qty);
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={2} sx={{ margin: "auto" }}>
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
            <Grid item xs={12} md={3} lg={1} sx={{ margin: "auto" }}>
              <Button
                sx={{ width: "100%" }}
                variant="contained"
                color="success"
                onClick={() => {
                  onAdd();
                  setAddEditModalOpen(false);
                }}
                disabled={
                  !(selectedFood && selectedUnit && unitQty && calories)
                }
              >
                {dietLogItemId == null ? "Add" : "Update"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
      <FabAdd
        onClick={() => {
          setAddEditModalOpen(true);
        }}
      />
    </Box>
  );
}
