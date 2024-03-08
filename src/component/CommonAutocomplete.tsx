import {
  Autocomplete,
  AutocompletePropsSizeOverrides,
  SxProps,
  TextField,
  Theme,
  createFilterOptions,
} from "@mui/material";
import { AutocompleteOptionType } from "../type/AutocompleteOptionType";
import { OverridableStringUnion } from "../type/OverridableStringUnion";

const filter = createFilterOptions<AutocompleteOptionType>();

interface Props {
  disabled?: boolean;
  size?: OverridableStringUnion<
    "small" | "medium",
    AutocompletePropsSizeOverrides
  >;
  label?: string;
  id?: string;
  value: string | null;
  sx?: SxProps<Theme>;
  onSelect: (value: string | null) => void;
  onCreate: (value: string) => void;
  options: AutocompleteOptionType[];
}

export default function CommonAutocomplete({
  disabled,
  size,
  label,
  id,
  sx,
  value,
  onSelect,
  onCreate,
  options,
}: Props) {
  return (
    <Autocomplete
      disabled={disabled}
      size={size}
      value={value}
      onChange={(_event, newValue) => {
        if (typeof newValue === "string" || newValue === null) {
          onSelect(newValue);
        } else if (newValue.label === `Add "${newValue.value}"`) {
          onCreate(newValue.value);
        } else {
          onSelect(newValue.value);
        }
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some(
          (option) => inputValue === option.label
        );
        if (inputValue !== "" && !isExisting) {
          filtered.push({
            value: inputValue,
            label: `Add "${inputValue}"`,
          });
        }

        return filtered;
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      id={id}
      options={options}
      renderOption={(props, option) => <li {...props}>{option.label}</li>}
      sx={sx}
      freeSolo
      renderInput={(params) => <TextField {...params} label={label} />}
    />
  );
}
