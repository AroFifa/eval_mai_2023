import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  InputAdornment,
  Radio,
  RadioGroup,
} from "@mui/material";
import { FormInputPropTypes } from "own/components/propTypes/input";

const { forwardRef, useState } = require("react");

const FormInputData = forwardRef(function FormInputData(props, ref) {
  const { onchange, defaultValue, data, adornment, helperText } = props;
  const [isChecked, setIsChecked] = useState(data.data.slice().fill(false));
  const [selectedValues, setSelectedValues] = useState([]);

  const toggleCheckboxValue = (index) => {
    setIsChecked(isChecked.map((v, i) => (i === index ? !v : v)));
  };

  const startAdornment = adornment?.start;
  const endAdornment = adornment?.end;

  const { label, value, orientation } = data;
  const row = orientation === "horizontal" ? true : false;

  const handleChange = (event) => {
    const { value } = event.target;

    ref.current.value = value;
    onchange();
  };
  const handleCheckBoxesChange = (event) => {
    const { value, checked } = event.target;
    const updatedSelectedValues = checked
      ? [...selectedValues, value]
      : selectedValues.filter((val) => val !== value);
    setSelectedValues(updatedSelectedValues);

    ref.current.value = updatedSelectedValues; // Update the ref value
    onchange();
  };
  const groupInput = data.multiple ? (
    <FormGroup ref={ref} row={row} onChange={handleCheckBoxesChange}>
      {data.data.map((option, index) => {
        return (
          <FormControlLabel
            key={index}
            control={
              <Checkbox checked={isChecked[index]} onClick={() => toggleCheckboxValue(index)} />
            }
            label={option[label]}
            value={option[value]}
          />
        );
      })}
    </FormGroup>
  ) : (
    <RadioGroup ref={ref} defaultValue={defaultValue} onChange={handleChange} row={row}>
      {data.data.map((option, index) => (
        <FormControlLabel
          key={index}
          control={<Radio />}
          value={option[value]}
          label={option[label]}
        />
      ))}
    </RadioGroup>
  );
  return (
    <>
      <Box sx={{ display: "flex", alignItems: "flex-start" }} width={"100%"}>
        <InputAdornment position="start" sx={{ color: "action.active", mr: 1, my: 3 }}>
          {startAdornment}
        </InputAdornment>
        <FormControl>
          <FormGroup>
            <FormLabel color="info">{props.label}</FormLabel>
            {groupInput}

            <FormHelperText>{helperText}</FormHelperText>
          </FormGroup>
        </FormControl>
        <InputAdornment position="end" sx={{ color: "action.active", mr: 1, my: 3 }}>
          {endAdornment}
        </InputAdornment>
      </Box>
    </>
  );
});

FormInputData.propTypes = {
  ...FormInputPropTypes,
};

FormInputData.defaultProps = {
  variant: "standard",
  fullWidth: true,
  data: {
    label: "label",
    value: "value",
    orientation: "vertical",
  },
};

export default FormInputData;
