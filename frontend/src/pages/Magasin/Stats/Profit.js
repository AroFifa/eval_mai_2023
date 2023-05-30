import { EventTracker, HoverState } from "@devexpress/dx-react-chart";
import {
  BarSeries,
  ArgumentAxis,
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
import { getStats } from "routes/ws_call";
import CustomToolbar from "./CustomToolbar";
import theme from "assets/theme";

export default function Profit() {
  const [data, setData] = useState([]);
  const minYear = useRef();
  const maxYear = useRef();
  const fetchData = async () => {
    try {
      const d = await getStats(minYear.current.value, maxYear.current.value, null, "benefit");
      setData(d);
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
    getStats(minYear.current.value, maxYear.current.value, null, "benefit")
      .then((d) => {
        setData(d);
      })
      .catch((error) => {
        // Handle any potential errors from the Promise
        console.error(error);
      });
  }
  const columns = [
    {
      field: "month_name",
      headerName: "Mois",
      width: 150,
      valueGetter: ({ row, value }) => {
        if (row.id === "SUBTOTAL") {
          return row.label;
        }
        return value;
      },
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
      field: "purchase",
      headerName: "Achat",
      width: 200,
      renderCell: (params) => {
        if (params.id === "SUBTOTAL") return format(params.row.purchase);
        return format(params.value);
      },
    },
    {
      field: "loss",
      headerName: "Perte",
      width: 200,
      renderCell: (params) => {
        if (params.id === "SUBTOTAL") return format(params.row.loss);
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
    {
      field: "profit",
      headerName: "Bénéfice",
      width: 200,
      renderCell: (params) => {
        if (params.id === "SUBTOTAL") return format(params.row.profit);
        return format(params.value);
      },
    },
  ];
  var rows = data.map((item) => ({
    id: item.id,
    month_name: item.month.month_name,
    sale: item.sale,
    purchase: item.purchase,
    loss: item.loss,
    commission: item.commission,
    profit: item.profit,
  }));

  const sum_sale = data.reduce((total, item) => total + item.sale, 0);
  const sum_purchase = data.reduce((total, item) => total + item.purchase, 0);
  const sum_loss = data.reduce((total, item) => total + item.loss, 0);
  const sum_commission = data.reduce((total, item) => total + item.commission, 0);
  const sum_profit = data.reduce((total, item) => total + item.profit, 0);
  rows = [
    ...rows,
    {
      id: "SUBTOTAL",
      label: "Somme",
      sale: sum_sale,
      purchase: sum_purchase,
      loss: sum_loss,
      commission: sum_commission,
      profit: sum_profit,
    },
  ];

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
              <MKInput
                variant="outlined"
                label="Min"
                placeholder="année"
                type="number"
                fullWidth
                inputRef={minYear}
                onChange={handleChange}
                // InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <MKInput
                variant="outlined"
                label="Max"
                type="number"
                fullWidth
                placeholder="année"
                inputRef={maxYear}
                onChange={handleChange}
                // InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Paper>
                <Chart data={rows}>
                  <Title text="Bénéfice par mois" />
                  <ArgumentAxis />
                  <ValueAxis />
                  <BarSeries name="Bénéfice" valueField="profit" argumentField="month_name" />
                  <BarSeries name="Vente" valueField="sale" argumentField="month_name" />
                  <BarSeries name="Achat" valueField="purchase" argumentField="month_name" />
                  <BarSeries name="Perte" valueField="loss" argumentField="month_name" />
                  <BarSeries name="Commission" valueField="commission" argumentField="month_name" />
                  <Legend />
                  <EventTracker />
                  <HoverState />
                  <ZoomAndPan />
                  <Tooltip />
                </Chart>
              </Paper>
            </Grid>
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
                getCellClassName={getCellClassName}
                // onRowClick={handleClick}
              />
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
