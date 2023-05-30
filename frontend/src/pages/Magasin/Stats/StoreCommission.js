import { EventTracker, HoverState } from "@devexpress/dx-react-chart";
import {
  ArgumentAxis,
  BarSeries,
  Chart,
  Legend,
  Title,
  Tooltip,
  ValueAxis,
  ZoomAndPan,
} from "@devexpress/dx-react-chart-material-ui";

import { Container, Grid, Paper, lighten } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import MKBox from "components/MKBox";
import MKInput from "components/MKInput";
import SimpleFooter from "examples/Footers/SimpleFooter";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import { useEffect, useRef } from "react";
import { useState } from "react";
import { NumericFormat } from "react-number-format";
import magasin_routes from "routes/magasin";
import CustomToolbar from "./CustomToolbar";
import { getStoreCommissions } from "routes/ws_call";
import { getMonths } from "routes/ws_call";
import FormInput from "own/components/form/FormInput";
import theme from "assets/theme";

export default function StoreCommission() {
  const [data, setData] = useState([]);
  const [months, setMonths] = useState([]);
  const monthRef = useRef({});
  const yearRef = useRef();
  const fetchData = async () => {
    try {
      const d = await getStoreCommissions(
        monthRef.current.value ? monthRef.current.value : "",
        yearRef.current.value
      );
      setData(d);
      const m = await getMonths();
      setMonths(m);
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

  function handleChange() {
    fetchData();
  }
  const columns = [
    {
      field: "year",
      headerName: "Année",
      width: 200,
      valueGetter: ({ row, value }) => {
        if (row.id === "SUBTOTAL") {
          return row.label;
        }
        return value;
      },
      colSpan: ({ row }) => {
        if (row.id === "SUBTOTAL") {
          return 2;
        }
      },
    },
    {
      field: "month",
      headerName: "Mois",
      width: 200,
    },
    {
      field: "sale",
      headerName: "Vente",
      width: 200,
      renderCell: (params) => {
        if (params.id === "SUBTOTAL") return format(params.row.sale);
        return format(params.value);
      },
    },
    {
      field: "commission",
      headerName: "Commission",
      width: 200,
      renderCell: (params) => {
        if (params.id === "SUBTOTAL") return format(params.row.commission);
        return format(params.value);
      },
    },

    { field: "store_name", headerName: "Point de vente", width: 200 },
  ];
  var rows = data.map((item) => ({
    id: item.id,
    store_name: item.store.store_name,
    month: item.month.month_name,
    year: item.year,
    sale: item.sale,
    commission: item.commission,
  }));

  const monthInput = {
    label: "Mois",
    type: "data",
    placeholder: "mois",
    ref: monthRef,
    onchange: handleChange,
    fullWidth: true,
    data: {
      data: months,
      label: "month_name",
      value: "id",
    },
  };
  const sumCommission = data.reduce((total, item) => total + item.commission, 0);
  const sumSale = data.reduce((total, item) => total + item.sale, 0);
  rows = [...rows, { id: "SUBTOTAL", label: "Somme", sale: sumSale, commission: sumCommission }];

  const getCellClassName = ({ row }) => {
    if (row.id === "SUBTOTAL") {
      return "somme";
    }
    return "";
  };

  return (
    <>
      <DefaultNavbar routes={magasin_routes} brand={"Magasin centrale"} sticky />

      <MKBox component="section" py={{ xs: 3, md: 12 }}>
        <Container>
          <Grid container style={{ marginBottom: "20px" }} spacing={2}>
            <Grid item xs={12} md={3}>
              <FormInput {...monthInput} />
            </Grid>
            <Grid item xs={12} md={3}>
              <MKInput
                variant="outlined"
                label="Année"
                type="number"
                fullWidth
                inputRef={yearRef}
                onChange={handleChange}
                placeholder="année"
                // InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid
              sx={{
                "& .somme": {
                  backgroundColor: lighten(theme.palette.info.main, 0.9),
                  "&:hover": {
                    backgroundColor: lighten(theme.palette.info.main, 0.8),
                  },
                  "&.Mui-selected": {
                    backgroundColor: lighten(theme.palette.info.main, 0.7),
                    "&:hover": {
                      backgroundColor: lighten(theme.palette.info.main, 0.6),
                    },
                  },
                },
              }}
              item
              xs={12}
              md={12}
            >
              <DataGrid
                slots={{ toolbar: CustomToolbar }}
                rows={rows}
                columns={columns}
                hideFooter={rows.length > 100 ? false : true}
                initialState={
                  rows.length > 100
                    ? {
                        // Set initialState only when rows.length <= 100
                        pagination: {
                          paginationModel: { page: 0, pageSize: 20 },
                        },
                      }
                    : undefined
                }
                getCellClassName={getCellClassName}
                // onRowClick={handleClick}
              />
            </Grid>

            <Grid item xs={12} md={12}>
              <Paper>
                <Chart rotated data={rows}>
                  <Title text="Commission par point de ventes" />
                  <ArgumentAxis />
                  <ValueAxis />
                  <BarSeries name="Vente" argumentField="store_name" valueField="sale" />
                  <BarSeries name="Commission" argumentField="store_name" valueField="commission" />

                  <ZoomAndPan />
                  <Legend />
                  <EventTracker />
                  <HoverState />
                  <Tooltip />
                </Chart>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </MKBox>

      <MKBox pt={6} px={1} mt={6}>
        <SimpleFooter />
      </MKBox>
    </>
  );
}
