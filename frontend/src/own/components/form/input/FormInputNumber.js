import {
  Box,
  FormControl,
  FormGroup,
  FormHelperText,
  FormLabel,
  Input,
  InputAdornment,
  Slider,
} from "@mui/material";
import { FormInputPropTypes } from "own/components/propTypes/input";

const { forwardRef, useState } = require("react");

const FormInputNumber = forwardRef(function FormInputNumber(props, ref) {
  const { onchange, label, minValue, maxValue, defaultValue, adornment, helperText, slider } =
    props;

  const startAdornment = adornment?.start;
  const endAdornment = adornment?.end;

  const { marks = true, valueLabelDisplay = "auto", track, step, withInput = false } = slider;
  const [value, setValue] = useState(defaultValue);

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);

    ref.current.value = newValue;
    onchange(event);
  };

  const handleInputChange = (event) => {
    setValue(event.target.value === "" ? "" : Number(event.target.value));

    ref.current.value = event.target.value;
    onchange(event);
  };

  const handleBlur = () => {
    if (value < minValue) {
      setValue(minValue);
      ref.current.value = minValue;
    } else if (value > maxValue) {
      setValue(maxValue);
      ref.current.value = maxValue;
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "flex-start" }} width={"100%"}>
      <InputAdornment position="start" sx={{ color: "action.active", mr: 1, my: 3 }}>
        {startAdornment}
      </InputAdornment>
      <FormControl fullWidth>
        <FormGroup>
          <FormLabel color="info">{label}</FormLabel>
          <Slider
            placeholder="placeholder"
            defaultValue={defaultValue}
            value={typeof value === "number" ? value : null}
            // getAriaValueText={valuetext}
            step={step}
            valueLabelDisplay={valueLabelDisplay}
            marks={marks}
            ref={ref}
            min={minValue}
            max={maxValue}
            // {...otherProps}
            onChange={handleSliderChange}
            track={track}
          />
          {withInput ? (
            <Input
              value={value}
              size="small"
              onChange={handleInputChange}
              onBlur={handleBlur}
              inputProps={{
                step: step,
                min: minValue,
                max: maxValue,
                type: "number",
                "aria-labelledby": "input-slider",
              }}
            />
          ) : (
            <></>
          )}
          <FormHelperText>{helperText}</FormHelperText>
        </FormGroup>
      </FormControl>
      <InputAdornment position="end" sx={{ color: "action.active", mr: 1, my: 3 }}>
        {endAdornment}
      </InputAdornment>
    </Box>
  );
});
FormInputNumber.propTypes = {
  ...FormInputPropTypes,
};

FormInputNumber.defaultProps = {
  defaultValue: 0,
  slider: {
    marks: true,
    step: 1,
    valueLabelDisplay: "auto",
    track: "normal",
    withInput: false,
  },
};

export default FormInputNumber;
