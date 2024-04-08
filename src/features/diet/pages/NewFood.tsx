import { Button, Stack, TextField } from "@mui/material";
import { useState } from "react";
import CommonAutocomplete from "../../common/components/CommonAutocomplete";
import useActiveApp from "../../common/hooks/useActiveApp";
import { useDietLog } from "../hooks/useDietLog";
import { useFoods } from "../hooks/useFoods";
import { useUnits } from "../hooks/useUnits";
import { useDietStore } from "../store/useDietStore";
import { AutocompleteOptionType } from "../../common/types/AutocompleteOptionType";
import { toDatetimeString } from "../../common/utils/date-utils";

const NEW_ITEM_VAL = "_NEW";

type ErrorType = { msg: string; target: "uom" | "calories" | "unitQty" };

export default function NewFood() {
  // global state
  const food = useDietStore((state) => state.food);
  const datetime = useDietStore((state) => state.datetime);
  const { add: createNewFood } = useFoods();
  const { items: uoms, add: createNewUom } = useUnits();
  const { add: createNewDietLog } = useDietLog();
  const { setActiveApp, goBack } = useActiveApp();

  // local state
  const [errors, setErrors] = useState<ErrorType[]>([]);
  const [uom, setUom] = useState<Partial<AutocompleteOptionType>>({});
  const [unitQty, setUnitQty] = useState<number | null>(null);
  const [calories, setCalories] = useState<number | null>(null);

  // local vars
  const uomOptions: AutocompleteOptionType[] = uoms.map((uom) => ({
    label: uom.name,
    value: `${uom.id}`,
  }));
  if (uom.value === NEW_ITEM_VAL) {
    uomOptions.push(uom as AutocompleteOptionType);
  }
  const validateForm = () => {
    const errors: ErrorType[] = [];
    if (uom.value === undefined) {
      errors.push({ msg: "Required", target: "uom" });
    }
    if (unitQty === null) {
      errors.push({ msg: "Required", target: "unitQty" });
    }
    if (calories === null) {
      errors.push({ msg: "Required", target: "calories" });
    }
    if (errors.length > 0) {
      setErrors(errors);
      return false;
    }
    return true;
  };

  return (
    <Stack px={1} py={2} spacing={1}>
      <TextField label="Food" size="small" value={food} disabled />
      <CommonAutocomplete
        value={uom.value === undefined ? null : uom.value}
        options={uomOptions}
        onCreate={(label) => {
          setUom({ label, value: NEW_ITEM_VAL });
          setErrors((prev) => prev.filter((error) => error.target !== "uom"));
        }}
        onSelect={(val) => {
          setUom(
            val === null ? {} : uomOptions.find((uom) => uom.value === val)!
          );
          setErrors((prev) => prev.filter((error) => error.target !== "uom"));
        }}
        label="Unit of Measurement"
        size="small"
        error={errors.some((error) => error.target === "uom")}
        helperText={errors.find((error) => error.target === "uom")?.msg}
        required
      />
      <TextField
        label="Unit Quantity"
        size="small"
        value={unitQty === null ? "" : unitQty}
        type="number"
        error={errors.some((error) => error.target === "unitQty")}
        helperText={errors.find((error) => error.target === "unitQty")?.msg}
        onChange={(e) => {
          setUnitQty(e.target.value === "" ? null : parseFloat(e.target.value));
          setErrors((prev) =>
            prev.filter((error) => error.target !== "unitQty")
          );
        }}
        required
      />
      <TextField
        label="Calories"
        size="small"
        value={calories === null ? "" : calories}
        type="number"
        error={errors.some((error) => error.target === "calories")}
        helperText={errors.find((error) => error.target === "calories")?.msg}
        onChange={(e) => {
          setCalories(
            e.target.value === "" ? null : parseFloat(e.target.value)
          );
          setErrors((prev) =>
            prev.filter((error) => error.target !== "calories")
          );
        }}
        required
      />
      <Stack direction="row" spacing={1} justifyContent="center">
        <Button
          color="primary"
          variant="outlined"
          fullWidth
          onClick={async () => {
            if (validateForm()) {
              const uomId =
                uom.value === NEW_ITEM_VAL
                  ? (
                      await createNewUom({
                        name: uom.label!,
                        abbreviation: uom.label!,
                      })
                    ).id
                  : parseInt(uom.value!);
              createNewFood({
                name: food,
                unit_id: uomId,
                unit_qty: unitQty!,
                calories: calories!,
              }).then((food) => {
                createNewDietLog({
                  datetime: toDatetimeString(datetime),
                  food_id: food.id,
                  servings: 1,
                }).then(() => {
                  setActiveApp((prev) => ({
                    ...prev,
                    page: "Diet Tracker",
                  }));
                });
              });
            }
          }}
        >
          Create
        </Button>
        <Button
          color="warning"
          variant="outlined"
          fullWidth
          onClick={() => {
            goBack();
          }}
        >
          Cancel
        </Button>
      </Stack>
    </Stack>
  );
}
