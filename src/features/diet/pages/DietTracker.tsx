import {
  Delete,
  FolderOff,
  InfoOutlined,
  LunchDining,
  Save,
} from "@mui/icons-material";
import {
  Box,
  Collapse,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import FabAdd from "../../common/components/FabAdd";
import VirtualizedDateList from "../../common/components/VirtualizedDateList";
import useActiveApp from "../../common/hooks/useActiveApp";
import { DietLineItem, useDietLog } from "../hooks/useDietLog";
import { Food, useFoods } from "../hooks/useFoods";
import { SpecificRecord } from "../../common/hooks/useSupabaseData";
import { UOM, useUnits } from "../hooks/useUnits";
import { useDietStore } from "../store/useDietStore";
import { toDateString } from "../../common/utils/date-utils";
import TopAppBar from "../../common/components/TopAppBar";

type DietLogItem = {
  dietLogId: number;
  foodId: number;
  datetime: string;
  unitQty: number;
  foodName: string;
  foodUom: string;
  foodCalories: number;
  foodUomQty: number;
};

// TODO: change variable names
// TODO: update data model to use servings in diet log instead of unitQty
// TODO: maybe update queries to #1 - only query on the current date, #2 - aggregate the query to do joins (ie with dietLog+food+uom)

export default function DietTracker() {
  // global state
  const { setActiveApp } = useActiveApp();
  const { isLoaded: isUnitsLoaded, items: unitsOfMeasurement } = useUnits();
  const { isLoaded: isFoodsLoaded, items: foods } = useFoods();
  const { isLoaded: isDietLogLoaded, items: dietLogItems } = useDietLog();
  const { datetime, setDatetime } = useDietStore();

  // local vars
  const isLoaded = isUnitsLoaded && isFoodsLoaded && isDietLogLoaded;
  const uomById = unitsOfMeasurement.reduce(
    (acc: Record<string, SpecificRecord<UOM>>, unit) => {
      acc[unit.id] = unit;
      return acc;
    },
    {}
  );
  const foodById = foods.reduce(
    (acc: Record<string, SpecificRecord<Food>>, food) => {
      acc[food.id] = food;
      return acc;
    },
    {}
  );
  const myDietLog: DietLogItem[] = !isLoaded
    ? []
    : dietLogItems
        .filter((item) => {
          return toDateString(dayjs(item.datetime)) === toDateString(datetime);
        })
        .map((item) => {
          const food = foodById[item.food_id];
          const uom = uomById[food.unit_id];
          return {
            dietLogId: item.id,
            foodId: item.food_id,
            datetime: item.datetime,
            foodName: food.name,
            unitQty: item.unit_qty || 0,
            foodUom: uom.name,
            foodCalories: food.calories,
            foodUomQty: food.unit_qty,
          };
        });
  const totalCalories = myDietLog.reduce((acc, item) => {
    return acc + item.foodCalories * (item.unitQty / item.foodUomQty);
  }, 0);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <TopAppBar
        title={datetime.format("MMM YYYY")}
        showProfile
        row2={
          <VirtualizedDateList
            date={datetime}
            onDateChange={(date) => {
              setDatetime(date);
            }}
          />
        }
      />
      <Box sx={{ flexGrow: 1, overflow: "scroll" }}>
        <List
          sx={{ height: "100%", width: "100%", bgcolor: "background.paper" }}
        >
          <ListItem divider>
            <ListItemIcon>
              <InfoOutlined />
            </ListItemIcon>
            <ListItemText disableTypography>
              <Typography fontWeight="bold" textAlign="center">
                {totalCalories} Total Calories
              </Typography>
            </ListItemText>
          </ListItem>
          {myDietLog.length === 0 ? (
            <Stack
              direction="column"
              justifyContent="center"
              alignItems="center"
              spacing={2}
              sx={{ height: "calc(100% - 48px)" }}
            >
              <FolderOff fontSize="large" color="disabled" />
              <Typography color="dimgray">
                No foods have been logged today
              </Typography>
            </Stack>
          ) : (
            <Box sx={{ pb: "80px" }}>
              {myDietLog.map((item) => (
                <FoodListItem key={item.dietLogId} food={item} />
              ))}
            </Box>
          )}
        </List>
      </Box>
      <FabAdd
        onClick={() => {
          setActiveApp((prev) => ({ ...prev, page: "New Diet Record" }));
        }}
      />
    </Box>
  );
}

function FoodListItem({ food: initFood }: { food: DietLogItem }) {
  // global state
  const { delete: deleteLogItem, update: updateLogItem } = useDietLog();

  // local state
  const [open, setOpen] = useState(false);
  const [food, setFood] = useState<SpecificRecord<DietLineItem>>({
    datetime: initFood.datetime,
    food_id: initFood.foodId,
    id: initFood.dietLogId,
    unit_qty: initFood.unitQty,
  });

  // effects
  useEffect(() => {
    setFood({
      datetime: initFood.datetime,
      food_id: initFood.foodId,
      id: initFood.dietLogId,
      unit_qty: initFood.unitQty,
    });
  }, [initFood]);

  return (
    <>
      <ListItemButton onClick={() => setOpen((prev) => !prev)}>
        <ListItemIcon>
          <LunchDining />
        </ListItemIcon>
        <ListItemText
          primary={`(${initFood.unitQty}${
            initFood.foodUom === "individual" ? "" : ` ${initFood.foodUom}`
          }) ${initFood.foodName}`}
        />
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            deleteLogItem(initFood.dietLogId);
          }}
        >
          <Delete />
        </IconButton>
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List disablePadding>
          <ListItem>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Grid container alignItems="center" justifyContent="center">
                  <Grid item xs={5}>
                    Cal/Serv
                  </Grid>
                  <Grid item xs={3}>
                    Servings
                  </Grid>
                  <Grid item xs={2}>
                    Cal
                  </Grid>
                  <Grid item xs={2} />
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container alignItems="center" justifyContent="center">
                  <Grid item xs={5}>
                    {`${initFood.foodCalories}/${initFood.foodUomQty}${
                      initFood.foodUom === "individual"
                        ? ""
                        : ` ${initFood.foodUom}`
                    }`}
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      sx={{ width: "72px" }}
                      size="small"
                      type="number"
                      value={
                        food.unit_qty === null
                          ? ""
                          : food.unit_qty / initFood.foodUomQty
                      }
                      onChange={(e) => {
                        setFood((prev) => ({
                          ...prev,
                          unit_qty:
                            e.target.value === ""
                              ? null
                              : parseFloat(e.target.value) *
                                initFood.foodUomQty,
                        }));
                      }}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    {(
                      initFood.foodCalories *
                      ((food.unit_qty || 0) / initFood.foodUomQty)
                    ).toFixed(0)}
                  </Grid>
                  <Grid item xs={2}>
                    <IconButton
                      color="success"
                      size="small"
                      disabled={
                        initFood.unitQty === food.unit_qty ||
                        food.unit_qty === null
                      }
                      onClick={(e) => {
                        updateLogItem(food);
                      }}
                    >
                      <Save />
                    </IconButton>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </ListItem>
        </List>
      </Collapse>
    </>
  );
}
