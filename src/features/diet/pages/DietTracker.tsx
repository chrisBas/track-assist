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
import TopAppBar from "../../common/components/TopAppBar";
import VirtualizedDateList from "../../common/components/VirtualizedDateList";
import useActiveApp from "../../common/hooks/useActiveApp";
import { SpecificRecord } from "../../common/hooks/useSupabaseData";
import { useModalStore } from "../../common/store/modalStore";
import { toDateString } from "../../common/utils/date-utils";
import { DietLineItem, useDietLog } from "../hooks/useDietLog";
import { Food, useFoods } from "../hooks/useFoods";
import { UOM, useUnits } from "../hooks/useUnits";
import { useDietStore } from "../store/useDietStore";

type DietLogItem = {
  dietLogId: number;
  foodId: number;
  datetime: string;
  servings: number;
  foodName: string;
  foodUom: string;
  foodCalories: number;
  foodUomQty: number;
};

// TODO: change variable names
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
            servings: item.servings,
            foodUom: uom.name,
            foodCalories: food.calories,
            foodUomQty: food.unit_qty,
          };
        });
  const totalCalories = myDietLog.reduce((acc, item) => {
    return acc + item.foodCalories * item.servings;
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

function FoodListItem({ food: initDietLogItem }: { food: DietLogItem }) {
  // global state
  const { delete: deleteLogItem, update: updateLogItem } = useDietLog();
  const setModal = useModalStore((state) => state.setModal);

  // local state
  const [open, setOpen] = useState(false);
  const [dietLogItem, setFood] = useState<SpecificRecord<DietLineItem>>({
    datetime: initDietLogItem.datetime,
    food_id: initDietLogItem.foodId,
    id: initDietLogItem.dietLogId,
    servings: initDietLogItem.servings,
  });

  // effects
  useEffect(() => {
    setFood({
      datetime: initDietLogItem.datetime,
      food_id: initDietLogItem.foodId,
      id: initDietLogItem.dietLogId,
      servings: initDietLogItem.servings,
    });
  }, [initDietLogItem]);

  return (
    <>
      <ListItemButton onClick={() => setOpen((prev) => !prev)}>
        <ListItemIcon>
          <LunchDining />
        </ListItemIcon>
        <ListItemText
          primary={`(${initDietLogItem.servings}${
            initDietLogItem.foodUom === "individual" ? "" : ` ${initDietLogItem.foodUom}`
          }) ${initDietLogItem.foodName}`}
        />
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            setModal({
              modal: "confirm-delete",
              onDelete: () => {
                deleteLogItem(initDietLogItem.dietLogId);
              },
            });
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
                    {`${initDietLogItem.foodCalories}/${initDietLogItem.foodUomQty}${
                      initDietLogItem.foodUom === "individual"
                        ? ""
                        : ` ${initDietLogItem.foodUom}`
                    }`}
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      sx={{ width: "72px" }}
                      size="small"
                      type="number"
                      value={
                        dietLogItem.servings === null
                          ? ""
                          : dietLogItem.servings
                      }
                      onChange={(e) => {
                        setFood((prev) => ({
                          ...prev,
                          unit_qty:
                            e.target.value === ""
                              ? null
                              : parseFloat(e.target.value) *
                                initDietLogItem.foodUomQty,
                        }));
                      }}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    {(
                      initDietLogItem.foodCalories *
                      dietLogItem.servings
                    ).toFixed(0)}
                  </Grid>
                  <Grid item xs={2}>
                    <IconButton
                      color="success"
                      size="small"
                      disabled={
                        initDietLogItem.servings === dietLogItem.servings
                      }
                      onClick={(e) => {
                        updateLogItem(dietLogItem);
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
