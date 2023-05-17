import { Button, IconButton } from "@mui/material";
import { FormButtonPropTypes } from "../propTypes/input";

export default function FormButton(props) {
  const { variant, icon, adornment, onClick, onSubmit, label, color, other } = props;

  const startAdornment = adornment?.start;
  const endAdornment = adornment?.end;
  const click = onClick ? onClick : () => {};
  const submit = onSubmit ? onSubmit : () => {};

  return icon ? (
    <>
      <IconButton {...other} color={color} onClick={click} onSubmit={submit}>
        {icon}
      </IconButton>
    </>
  ) : (
    <>
      <Button
        color={color}
        variant={variant}
        startIcon={startAdornment}
        endIcon={endAdornment}
        onClick={click}
        onSubmit={submit}
        {...other}
      >
        {label}
      </Button>
    </>
  );
}

FormButton.propTypes = {
  ...FormButtonPropTypes,
};

FormButton.defaultProps = {
  variant: "contained",
  label: "Button",
};
