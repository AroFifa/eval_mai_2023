import { Image, MonitorWeight, PhotoCamera } from "@mui/icons-material";
import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Grid,
  IconButton /* Paper */,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import MKBox from "components/MKBox";
import SimpleFooter from "examples/Footers/SimpleFooter";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import FormGroupInput from "own/components/form/FormGroupInput";
import { useRef, useState } from "react";
import { NumericFormat } from "react-number-format";

import clsx from "clsx";
// import DynamicForm from "own/components/form";
import routes from "routes/routes";
// import { ArgumentAxis, Chart, PieSeries, ValueAxis } from "@devexpress/dx-react-chart-material-ui";
// import FormInputData from "own/components/form/input/FormInputData";
// import bgImage from "assets/images/bg-presentation.jpg";

export default function Template() {
  const [error, setError] = useState(false);
  const [helper, setHelper] = useState("Please select your currency");

  const currencies = [
    {
      value: 5,
      label: "$",
    },
    {
      value: 15,
      label: "€",
    },
    {
      value: 28,
      label: "฿",
    },
    {
      value: 40,
      label: "¥",
    },
  ];

  const data = [
    {
      value: "USD",
      label: "When there is desire, there is gonna be a fame",
    },
    {
      value: "EUR",
      label: "So how will I trust you",
    },
    {
      value: "BTC",
      label: "Why don't you remember",
    },
    {
      value: "JPY",
      label: "Oh I used to say",
    },
  ];

  const value = useRef({});

  function handleClick() {
    console.log(value.current.value);

    const err = value.current.value === "haha" ? true : false;
    setError(err);
    err ? setHelper("error") : setHelper("");
  }

  const element = {
    label: "label",
    placeholder: "placeholder",
    defaultValue: data[0],
    type: "data",
    disabled: false,
    required: false,
    error: error,
    minValue: -8,
    maxValue: 80,
    stepValue: null,
    variant: "standard",
    adornment: {
      start: <MonitorWeight />,
    },
    multiline: { has: false, max: 5, min: 3 },
    onchange: handleClick,
    helperText: helper,
    slider: {
      marks: currencies,
      step: 1,
      track: "normal",
      withInput: true,
    },

    data: {
      data: data,
      label: "label",
      value: "value",
      multiple: false,
      display: "search-select",
      // display: "simple: radio/select/searchselect multiple: select/checkboxes/searchselect",
      orientation: "vertical",
    },
    ref: value,
  };

  const email = useRef([]);
  const passwd = useRef();

  const elements = [
    {
      label: "Email Adress",
      type: "email",
      // defaultValue: "user3@gmail.com",
      placeholder: "email",
      ref: email,
      required: true,

      data: {
        data: data,
      },
    },
    {
      label: "Password",
      type: "password",
      defaultValue: "indro",
      placeholder: "password",
      ref: passwd,
      required: true,
    },
  ];

  elements.push(element);

  console.log(elements);

  const format = (num) => {
    return (
      <NumericFormat
        value={num}
        displayType={"text"}
        decimalScale={2}
        decimalSeparator={"."}
        thousandSeparator={" "}
        fixedDecimalScale={true}
      />
    );
  };

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "firstName", headerName: "First name" },
    { field: "lastName", headerName: "Last name", width: 130 },
    {
      field: "age",
      headerName: "Age",
      type: "number",
      width: 90,
    },
    {
      field: "fullName",
      headerName: "Full name",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 160,
      valueGetter: (params) => `${params.row.firstName || ""} ${params.row.lastName || ""}`,
    },

    {
      field: "salary",
      headerName: "Salary",
      width: 200,
      cellClassName: (params) => {
        if (params.value == null) {
          return "";
        }

        return clsx("cell", {
          mille: params.value > 1000 && params.value < 1000000,
          million: params.value > 1000000 && params.value < 1000000000,
          milliard: params.value > 1000000000,
        });
      },

      // valueGetter: (params) => {
      //   // return format(params.value);
      //   return new Intl.NumberFormat().format(params.value);
      // },
      renderCell: (params) => {
        // const value = params.value;
        // let bgColor = "";

        // if (value > 50000) {
        //   bgColor = "green";
        // } else if (value > 30000) {
        //   bgColor = "yellow";
        // } else {
        //   bgColor = "red";
        // }

        return format(params.value);
        // return <div style={{ backgroundColor: bgColor }}>{value}</div>;
      },
    },
  ];

  console.log(format);

  const rows = [
    {
      id: 1,
      lastName: "Snow",
      firstName: "Jon",
      age: 35,
      status: "Sucess",
      salary: 1500800.256851,
    },
    {
      id: 2,
      lastName: "Lannister",
      firstName: "Cersei",
      age: 42,
      status: "Sucess",
      salary: 1500800.256851,
    },
    {
      id: 3,
      lastName: "Lannister",
      firstName: "Jaime",
      age: 45,
      status: "Sucess",
      salary: 1500800.256851,
    },
    {
      id: 4,
      lastName: "Stark",
      firstName: "Arya",
      age: 16,
      status: "Sucess",
      salary: 1500800.256851,
    },
    {
      id: 5,
      lastName: "Targaryen",
      firstName: "Daenerys",
      age: null,
      status: "Sucess",
      salary: 1500800.256851,
    },
    {
      id: 6,
      lastName: "Melisandre",
      firstName: null,
      age: 150,
      status: "Sucess",
      salary: 150080000.256851,
    },
    {
      id: 7,
      lastName: "Clifford",
      firstName: "Ferrara",
      age: 44,
      status: "Sucess",
      salary: 150080.256851,
    },
    {
      id: 8,
      lastName: "Frances",
      firstName: "Rossini",
      age: 36,
      status: "Sucess",
      salary: 15000.256851,
    },
    {
      id: 9,
      lastName: "Roxie",
      firstName: "Harvey",
      age: 65,
      status: "Sucess",
      salary: 1500800.256851,
    },
  ];

  // const chartdata = [
  //   { argument: "Monday", value: 30 },
  //   { argument: "Tuesday", value: 20 },
  //   { argument: "Wednesday", value: 10 },
  //   { argument: "Thursday", value: 50 },
  //   { argument: "Friday", value: 60 },
  // ];

  const [img, setImg] = useState(null);
  function handleImgChange(event) {
    setImg(URL.createObjectURL(event.target.files[0]));
  }

  return (
    <>
      <DefaultNavbar routes={routes} sticky />
      <MKBox
        minHeight="120px"
        marginTop="50px"
        // width="100%"
        // sx={{
        //   backgroundImage: `url(${bgImage})`,
        //   backgroundSize: "cover",
        //   backgroundPosition: "top",
        //   display: "grid",
        //   placeItems: "center",
        // }}
      ></MKBox>
      <Container>
        <Grid
          container
          minHeight="75vh"
          sx={{
            "& .cell.mille": {
              backgroundColor: "#ff943975",
            },

            "& .cell.million": {
              backgroundColor: "#ff94ff75",
            },

            "& .cell.milliard": {
              backgroundColor: "#12943975",
            },
          }}
        >
          <FormGroupInput gap={5} data={elements} orientation={"vertical"} />

          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 1, pageSize: 4 },
              },
            }}
            pageSizeOptions={[4, 10]}
          />
        </Grid>
        {/* <Grid>
          <Paper>
            <Chart data={chartdata}>
              <ArgumentAxis />
              <ValueAxis />
              <PieSeries valueField="value" argumentField="value" />
            </Chart>
          </Paper>
        </Grid> */}

        <Grid>
          <Card sx={{ maxWidth: 345 }}>
            <CardMedia sx={{ height: 140 }} image={img} />

            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Card
              </Typography>
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <Image />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="priamry text" secondary="secondary text" />
                </ListItem>
              </List>
            </CardContent>
            <CardActions>
              <IconButton color="primary" aria-label="upload picture" component="label">
                <input hidden accept="image/*" onChange={handleImgChange} type="file" />
                <PhotoCamera />
              </IconButton>
            </CardActions>
          </Card>
        </Grid>
      </Container>
      <MKBox pt={6} px={1} mt={6}>
        <SimpleFooter />
      </MKBox>
    </>
  );
}
