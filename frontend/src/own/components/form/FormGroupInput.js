import { FormGroup, FormLabel } from "@mui/material";
import PropTypes from "prop-types";
import FormInput from "./FormInput";
import FormButton from "./FormButton";
// import { Alarm } from "@mui/icons-material";

export default function FormGroupInput(props) {
  const row = props.orientation === "horizontal" ? true : false;
  const sx = row
    ? {
        display: "grid",
        gridTemplateColumns: "repeat(" + props.col + ", 1fr)",
        gap: props.gap,
      }
    : { padding: props.gap };

  const btn = {
    label: "Valider",
    color: "success",
    other: { type: "reset" },
    onSubmit: () => {
      console.log("submitted");
    },
    // icon: <Alarm />,

    // adornment: {
    //   start: <MonitorWeight />,
    // },
  };
  return (
    <form>
      <FormGroup row={row} sx={sx}>
        <FormLabel> {props.title}</FormLabel>
        {props.data?.map((item, index) => (
          <FormInput {...item} key={index} />
        ))}

        <FormButton {...btn} />
      </FormGroup>
    </form>
  );
}

FormGroupInput.propTypes = {
  data: PropTypes.array,
  col: PropTypes.number,
  gap: PropTypes.number,
  title: PropTypes.string,
  orientation: PropTypes.oneOf(["horizontal", "vertical"]),
};

FormGroupInput.defaultProps = {
  col: 3,
  orientation: "horizontal",
  gap: 0.2,
};
