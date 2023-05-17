import PropTypes from "prop-types";
export const Multiline = PropTypes.shape({
  has: PropTypes.bool,
  min: PropTypes.number,
  max: PropTypes.number,
  rows: PropTypes.number,
});

export const Adornment = PropTypes.shape({
  start: PropTypes.element,
  end: PropTypes.element,
});

export const Slider = PropTypes.shape({
  marks: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  step: PropTypes.number,
  valueLabelDisplay: PropTypes.oneOf(["auto", "on", "off"]),
  track: PropTypes.oneOf(["normal", "inverted"]),
  withInput: PropTypes.bool,
});

export const DataInput = PropTypes.shape({
  data: PropTypes.array,
  label: PropTypes.string,
  value: PropTypes.string,
  multiple: PropTypes.bool,
  display: PropTypes.oneOf(["select", "search-select", "check"]),
  orientation: PropTypes.oneOf(["horizontal", "vertical"]),
});
export const FormInputPropTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  helperText: PropTypes.string,
  defaultValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
    PropTypes.object,
    PropTypes.array,
  ]),
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  error: PropTypes.bool,
  minValue: PropTypes.number,
  maxValue: PropTypes.number,
  stepValue: PropTypes.number,
  variant: PropTypes.oneOf(["standard", "variant", "outlined", "filled"]),
  adornment: Adornment,
  multiline: Multiline,
  color: PropTypes.oneOf(["error", "info", "primary", "success", "secondary", "warning"]),
  onchange: PropTypes.func,
  fullWidth: PropTypes.bool,
  slider: Slider,
  data: DataInput,
};

export const FormButtonPropTypes = {
  variant: PropTypes.oneOf(["contained", "outlined", "text"]),
  adornment: Adornment,
  label: PropTypes.string,
  onClick: PropTypes.func,
  onSubmit: PropTypes.func,
  icon: PropTypes.element,
  color: PropTypes.oneOf(["error", "success", "info", "primary", "secondary", "warning"]),
  other: PropTypes.object,
};
