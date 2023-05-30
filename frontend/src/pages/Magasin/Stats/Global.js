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
import { getStats } from "routes/ws_call";
import CustomToolbar from "./CustomToolbar";
import theme from "assets/theme";

export default function Global() {
  const [data, setData] = useState([]);
  const minYear = useRef();
  const maxYear = useRef();
  const fetchData = async () => {
    try {
      const d = await getStats(minYear.current.value, maxYear.current.value, null, "global");
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
    getStats(minYear.current.value, maxYear.current.value, null, "global")
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
      field: "price",
      headerName: "Prix total",
      width: 200,
      renderCell: (params) => {
        if (params.id === "SUBTOTAL") {
          return format(params.row.price);
        }

        return format(params.value);
      },
    },
    {
      field: "qtt",
      headerName: "Qtt",
      width: 50,
      valueGetter: ({ row, value }) => {
        if (row.id === "SUBTOTAL") {
          return `${row.qtt}`;
        }
        return value;
      },
    },
  ];

  var rows = data.map((item) => ({
    id: item.id,
    month_name: item.month.month_name,
    price: item.price,
    qtt: item.qtt,
  }));
  const sumPrice = data.reduce((total, item) => total + item.price, 0);
  const sumQtt = data.reduce((total, item) => total + item.qtt, 0);
  rows = [...rows, { id: "SUBTOTAL", label: "Somme", price: sumPrice, qtt: sumQtt }];

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
                type="number"
                fullWidth
                inputRef={minYear}
                onChange={handleChange}
                placeholder="année"
                // InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <MKInput
                variant="outlined"
                label="Max"
                type="number"
                fullWidth
                inputRef={maxYear}
                onChange={handleChange}
                placeholder="année"
                // InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Paper>
                <Chart data={rows}>
                  <Title text="Total des ventes par mois" />
                  <ArgumentAxis />
                  <ValueAxis />
                  <BarSeries name="prix" valueField="price" argumentField="month_name" />
                  <Legend />
                  <EventTracker />
                  <HoverState />
                  <Tooltip />
                  <ZoomAndPan />
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
              md={4}
            >
              <DataGrid
                slots={{ toolbar: CustomToolbar }}
                getCellClassName={getCellClassName}
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
