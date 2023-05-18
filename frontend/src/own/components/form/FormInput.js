import { MenuItem, TextField } from "@mui/material";
import { forwardRef, useState } from "react";
import { FormInputPropTypes } from "../propTypes/input";
import FormInputNumber from "./input/FormInputNumber";
import FormSelectSearch from "./FormSelectSearch";
import FormInputData from "./input/FormInputData";

const FormInput = forwardRef(function FormInput(props, ref) {
  const {
    onchange,
    data,
    multiline,
    minValue,
    maxValue,
    stepValue,
    adornment,
    defaultValue,
    ...otherProps
  } = props;
  const inputProps = { min: minValue, max: maxValue, step: stepValue };

  const startAdornment = adornment?.start;
  const endAdornment = adornment?.end;

  const {
    label = "label",
    value = "value",
    multiple = false,
    display = "search-select" /* orientation */,
  } = data || {};
  // const rows = orientation === "horizontal" ? false : true;
  const change = onchange ? onchange : () => {};

  const [datavalue, setDatavalue] = useState([]);
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setDatavalue(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );

    ref.current.value = value;
    change();
  };

  const handleSelectChange = (event) => {
    const {
      target: { value },
    } = event;
    ref.current.value = value;
    change();
  };

  const defaultV =
    props.type === "data" ? (defaultValue ? defaultValue : multiple ? [] : "") : defaultValue;
  const datadisplay =
    props.type === "data" && display === "select"
      ? multiple
        ? {
            select: true,
            SelectProps: { multiple: true, value: datavalue, onChange: handleChange },
            data: data.data,
          }
        : {
            data: data.data,
            select: true,
          }
      : { select: false, data: [] };

  if (props.type === "number" && props.slider != null)
    return <FormInputNumber {...props} ref={ref} />;
  else if (props.type === "data") {
    if (display === "search-select") return <FormSelectSearch {...props} ref={ref} />;
    else if (display === "check") return <FormInputData {...props} ref={ref} />;
  }

  return (
    <TextField
      sx={{ minWidth: "fit-content" }}
      inputRef={ref}
      multiline={multiline?.has}
      rows={multiline?.rows}
      maxRows={multiline?.max}
      minRows={multiline?.min}
      InputProps={{ inputProps, startAdornment: startAdornment, endAdornment: endAdornment }}
      onChange={handleSelectChange}
      {...otherProps}
      defaultValue={defaultV}
      {...datadisplay}
    >
      {datadisplay.data ? <MenuItem value={multiple ? [] : ""} disabled></MenuItem> : <></>}
      {datadisplay.data.map((option) => (
        <MenuItem key={option[value]} value={option[value]}>
          {option[label]}
        </MenuItem>
      ))}
    </TextField>
  );
});

FormInput.propTypes = {
  ...FormInputPropTypes,
};

FormInput.defaultProps = {
  variant: "standard",
  fullWidth: true,
};
export default FormInput;
