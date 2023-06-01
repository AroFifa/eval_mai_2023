import { Grid } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import SimpleFooter from "examples/Footers/SimpleFooter";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import { useParams } from "react-router-dom";
import point_ventes_routes from "routes/point_ventes";
import { findSales } from "routes/ws_call";

export default function SalesDetails() {
  const [sales, setSales] = useState([]);
  const { year, month } = useParams();

  console.log(year);
  console.log(month);

  const fetchData = async () => {
    try {
      const data = await findSales(year, month);
      setSales(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
    { field: "ref", headerName: "Référence", width: 150 },
    {
      field: "price",
      headerName: "Prix",
      width: 250,
      renderCell: (params) => {
        return format(params.value);
      },
    },
    { field: "qtt", headerName: "Qtt", width: 50 },
    {
      field: "total_price",
      headerName: "Prix total",
      width: 250,
      renderCell: (params) => {
        return format(params.value);
      },
    },
    { field: "store", headerName: "Point de vente", width: 200 },
  ];

  const rows = sales.map((item) => ({
    id: item.id,
    date: item.purchase_date,
    ref: item.laptop.model.model_name,
    qtt: item.qtt,
    price: item.purchase_price,
    total_price: item.purchase_price * item.qtt,
    store: item.store.store_name,
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
            Détails des ventes
          </MKTypography>
        </Grid>
        <Grid
          container
          item
          xs={12}
          lg={10}
          sx={{
            mx: "auto",
          }}
        >
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
