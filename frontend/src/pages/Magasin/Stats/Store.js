import { EventTracker, HoverState, Stack } from "@devexpress/dx-react-chart";
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
import { getMonths } from "routes/ws_call";

function format(num) {
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
}
function renderTooltipContent(info) {
  return (
    <>
      {info.targetItem.series}: {format(info.text)}
    </>
  );
}

export default function StatsStore() {
  const [data, setData] = useState([]);
  const [months, setMonths] = useState([]);
  const minYear = useRef();
  const maxYear = useRef();
  const fetchData = async () => {
    try {
      const d = await getStats(
        minYear.current.value,
        maxYear.current.value,
        "total_price",
        "store"
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

  function handleChange() {
    getStats(minYear.current.value, maxYear.current.value, "total_price", "store")
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
      field: "store_name",
      headerName: "Point de vente",
      width: 200,
      valueGetter: ({ row, value }) => {
        if (row.id === "SUBTOTAL") {
          return row.label;
        }
        return value;
      },
    },

    ...months.map((month) => ({
      field: `month_${month.month_number}`,
      headerName: month.month_name,
      width: 200,
      renderCell: (params) => {
        if (params.id === "SUBTOTAL") {
          return format(params.row[`month_${month.month_number}`]);
        }
        return format(params.value);
      },
    })),
  ];

  var rows = data.map((item) => ({
    id: item.id,
    store_name: item.store.store_name,
    month_1: item.jan,
    month_2: item.feb,
    month_3: item.march,
    month_4: item.apr,
    month_5: item.mai,
    month_6: item.june,
    month_7: item.jul,
    month_8: item.aug,
    month_9: item.sept,
    month_10: item.oct,
    month_11: item.nov,
    month_12: item.dec,
  }));

  const sumValues = rows.reduce((sums, item) => {
    for (let i = 1; i <= 12; i++) {
      const monthKey = `month_${i}`;
      sums[monthKey] = (sums[monthKey] || 0) + item[monthKey];
    }
    return sums;
  }, {});

  rows = [
    ...rows,
    {
      id: "SUBTOTAL",
      label: "Somme",
      ...sumValues,
    },
  ];

  const getCellClassName = ({ row }) => {
    if (row.id === "SUBTOTAL") {
      return "somme";
    }
    return "";
  };
  const barSeries = months.map((month) => (
    <BarSeries
      key={month.month_number}
      name={month.month_name}
      argumentField="store_name"
      valueField={`month_${month.month_number}`}
    />
  ));

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
            <Grid
              item
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

            <Grid item xs={12} md={12}>
              <Paper>
                <Chart rotated data={rows}>
                  <Title text="Ventes par point de ventes" />
                  <ArgumentAxis />
                  <ValueAxis />

                  {barSeries}
                  <Stack />
                  <ZoomAndPan />
                  <Legend />
                  <EventTracker />
                  <HoverState />
                  <Tooltip contentComponent={renderTooltipContent} />
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
