import { Autocomplete, FormControl, Popper, TextField } from "@mui/material";
import { FormInputPropTypes } from "../propTypes/input";

const { forwardRef } = require("react");

const FormSelectSearch = forwardRef(function FormSelectSearch(props, ref) {
  const { onchange, data, multiline, minValue, maxValue, stepValue, adornment, ...otherProps } =
    props;
  const inputProps = { min: minValue, max: maxValue, step: stepValue };

  const startAdornment = adornment?.start;
  const endAdornment = adornment?.end;

  const { defaultValue, ...other } = otherProps;

  const change = onchange ? onchange : () => {};

  const { label: datalabel = "label", value: datavalue = "value", multiple = false } = data || {};
  const handleChange = (event, value) => {
    if (Array.isArray(value)) {
      const selectedValues = value.map((item) => item[datavalue]);

      ref.current.value = selectedValues;
    } else {
      ref.current.value = value ? value[datavalue] : null;
    }
    change();
  };

  const PopperMy = function (props) {
    return <Popper {...props} style={{ minWidth: "fit-content" }} />;
  };
  return (
    <FormControl>
      <Autocomplete
        disablePortal
        multiple={multiple}
        options={data.data}
        sx={{ minWidth: "fit-content", width: "350%" }}
        getOptionLabel={(option) => option[datalabel]}
        onChange={(event, value) => handleChange(event, value)}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        defaultValue={defaultValue}
        PopperComponent={PopperMy}
        renderInput={(params) => (
          <TextField
            multiline={multiline?.has}
            rows={multiline?.rows}
            maxRows={multiline?.max}
            minRows={multiline?.min}
            sx={{ minWidth: "fit-content" }}
            InputProps={{
              inputProps,
              startAdornment: startAdornment,
              endAdornment: endAdornment,
            }}
            {...params}
            {...other}
          />
        )}
      />
    </FormControl>
  );
});

FormSelectSearch.propTypes = {
  ...FormInputPropTypes,
};
FormSelectSearch.defaultProps = {
  variant: "standard",
  fullWidth: true,
};
export default FormSelectSearch;
