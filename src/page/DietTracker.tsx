import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import CommonAutocomplete from "../component/CommonAutocomplete";
import CommonCard from "../component/CommonCard";
import CommonModal from "../component/CommonModal";
import ConfirmDeleteModal from "../component/ConfirmDeleteModal";
import FabAdd from "../component/FabAdd";
import FlexEnd from "../component/FlexEnd";
import { useDietLog } from "../hook/useDietLog";
import { useFoods } from "../hook/useFoods";
import { useUnits } from "../hook/useUnits";
import { DietRecord } from "../type/DietRecord";

const COMMON_DATE_FORMAT = "YYYY-MM-DDTHH:mm:ss";
const TIME_FORMAT = "HH:mm";

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

  const [selectedDate, setSelectedDate] = useState<string | null>(
    dayjs().format("YYYY-MM-DD")
  );
  const [dietLogItemId, setDietLogItemId] = useState<null | string>(null);
  const [selectedFood, setSelectedFood] = useState<null | string>(null);
  const [datetime, setDateTime] = useState<Dayjs | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<null | string>(null);
  const [unitQty, setUnitQty] = useState<number | null>(null);
  const [calories, setCalories] = useState<number | null>(null);
  const [addEditModalOpen, setAddEditModalOpen] = useState(false);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState<{
    open: boolean;
    id: string | null;
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
          unitQty: item.unit_qty || 0,
          calories: Math.round(
            food!.calories * ((item.unit_qty || 0) / food.unit_qty)
          ),
        };
      });
  const dietRecordsByDate = dietRecords.reduce(
    (acc: Record<string, DietRecord[]>, record) => {
      const date = record.datetime.format("YYYY-MM-DD");
      if (acc[date] === undefined) {
        acc[date] = [];
      }
      acc[date].push(record);
      return acc;
    },
    {}
  );
  const isExistingFood =
    selectedFood !== null && foods.some((f) => f.name === selectedFood);
  const isExistingUnit =
    selectedUnit !== null &&
    unitsOfMeasurement.some((uom) => uom.name === selectedUnit);
  const onAdd = async () => {
    if (selectedFood && selectedUnit && unitQty && calories) {
      const unitId: string = !isExistingUnit
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

  const onEdit = (id: string) => {
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

  const onDelete = (id: string) => {
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
      {Object.entries(dietRecordsByDate).map(([date, dietRecords]) => {
        const totalCalories = dietRecords.reduce((cal, record) => {
          return cal + record.calories;
        }, 0);
        return (
          <Accordion
            key={date}
            expanded={date === selectedDate}
            onChange={() => {
              setSelectedDate(date === selectedDate ? null : date);
            }}
            sx={{ "&.MuiPaper-root": { my: "1px" } }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                width="80%"
              >
                <Typography variant="body2" fontWeight={500}>
                  {date}
                </Typography>
                <Typography
                  variant="body2"
                  color="grey"
                  fontWeight={500}
                >{`${totalCalories}cal`}</Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              {dietRecords.map((record, idx) => {
                return (
                  <CommonCard
                    key={record.id}
                    title={`(${record.unitQty}${
                      record.unit === "individual" ? "" : ` ${record.unit}`
                    }) ${record.food}`}
                    subtitle={record.datetime.format(TIME_FORMAT)}
                    subinfo={`${record.calories} cal`}
                    sx={{
                      mt: idx === 0 ? 0 : 2,
                      mb: idx === dietRecords.length - 1 ? 0 : 2,
                    }}
                    onSelect={() => {
                      onEdit(record.id);
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
            </AccordionDetails>
          </Accordion>
        );
      })}
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
        title={`${dietLogItemId == null ? "Add" : "Update"} Record`}
      >
        <Stack direction="column" spacing={2}>
          <DateTimePicker
            label="Datetimes"
            slotProps={{ textField: { size: "small" } }}
            sx={{ width: "100%" }}
            value={datetime}
            onChange={(value) => {
              setDateTime(value);
            }}
          />
          <CommonAutocomplete
            size="small"
            label="Food"
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
          <CommonAutocomplete
            size="small"
            label="Unit"
            disabled={isExistingFood}
            sx={{ width: "100%" }}
            value={selectedUnit}
            onSelect={setSelectedUnit}
            onCreate={(value) => {
              setSelectedUnit(value);
            }}
            options={unitOptions}
          />
          <TextField
            size="small"
            sx={{ width: "100%" }}
            label="Unit Qty"
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
          <TextField
            size="small"
            sx={{ width: "100%" }}
            disabled={isExistingFood}
            label="Calories"
            type="number"
            value={calories == null ? "" : calories}
            onChange={(e) => {
              setCalories(
                e.target.value === "" ? null : parseFloat(e.target.value)
              );
            }}
          />
          <FlexEnd>
            <Button
              variant="contained"
              color="success"
              onClick={() => {
                onAdd();
                setAddEditModalOpen(false);
              }}
              disabled={!(selectedFood && selectedUnit && unitQty && calories)}
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
