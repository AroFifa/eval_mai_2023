import { Grid } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import MKBox from "components/MKBox";
import MKInput from "components/MKInput";
import MKTypography from "components/MKTypography";
import SimpleFooter from "examples/Footers/SimpleFooter";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import { useEffect, useRef, useState } from "react";
import { NumericFormat } from "react-number-format";
import point_ventes_routes from "routes/point_ventes";
import { getSales } from "routes/ws_call";
import clsx from "clsx";

export default function ListSales() {
  const q = useRef();
  const minRef = useRef();
  const maxRef = useRef();

  const [sales, setSales] = useState([]);
  const fetchData = async () => {
    try {
      const data = await getSales(q.current.value, minRef.current.value, maxRef.current.value);
      setSales(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  function handleSearch() {
    getSales(q.current.value, minRef.current.value, maxRef.current.value)
      .then((data) => {
        setSales(data);
      })
      .catch((error) => {
        // Handle any potential errors from the Promise
        console.error(error);
      });
  }
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
    { field: "date", headerName: "Date", width: 150 },
    { field: "ref", headerName: "Référence", width: 350 },
    {
      field: "price",
      headerName: "Prix",
      width: 300,
      renderCell: (params) => {
        return format(params.value);
      },
      cellClassName: (params) => {
        if (params.value == null) {
          return "";
        }

        return clsx("cell", {
          m1: params.value > 1000000 && params.value < 2000000,
          m2: params.value > 2000000 && params.value < 3000000,
          m3: params.value > 3000000,
        });
      },
    },
    { field: "qtt", headerName: "Qtt", width: 50 },
  ];

  const rows = sales.map((item) => ({
    id: item.id,
    date: item.purchase_date,
    ref: item.laptop.model.model_name,
    qtt: item.qtt,
    price: item.purchase_price,
  }));
  const user = JSON.parse(sessionStorage.getItem("user"));

  return (
    <>
      <DefaultNavbar
        routes={point_ventes_routes}
        brand={"Point de ventes"}
        smallbrand={user?.store.store_name}
        sticky
      />
      <MKBox component="section" py={12} minHeight="75vh" marginTop="50px">
        <Grid container item justifyContent="center" xs={10} lg={7} mx="auto" textAlign="center">
          <MKTypography variant="h3" mb={1}>
            Liste des ventes
          </MKTypography>
        </Grid>
        <Grid
          container
          item
          xs={12}
          lg={7}
          sx={{
            mx: "auto",
            "& .cell.m1": {
              backgroundColor: "#ff943975",
            },

            "& .cell.m2": {
              backgroundColor: "#ff94ff75",
            },

            "& .cell.m3": {
              backgroundColor: "#12943975",
            },
          }}
        >
          <Grid container style={{ marginBottom: "20px" }} spacing={2}>
            <Grid item xs={12} md={6}>
              <MKInput
                variant="standard"
                label="Référence"
                type="search"
                inputRef={q}
                placeholder="modèle"
                InputLabelProps={{ shrink: true }}
                fullWidth
                onChange={handleSearch}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <MKInput
                variant="outlined"
                label="Prix min"
                type="number"
                fullWidth
                inputRef={minRef}
                onChange={handleSearch}
                placeholder="min"
                InputProps={{ inputProps: { min: 0, step: "any" } }}
                // InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <MKInput
                variant="outlined"
                label="Prix max"
                type="number"
                fullWidth
                inputRef={maxRef}
                onChange={handleSearch}
                InputProps={{ inputProps: { min: 0, step: "any" } }}
                placeholder="max"
                // InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10]}
          />
        </Grid>
      </MKBox>
      <MKBox pt={6} px={1} mt={6}>
        <SimpleFooter />
      </MKBox>
    </>
  );
}
