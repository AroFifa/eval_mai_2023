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
import { Container, Grid, Paper } from "@mui/material";
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

export default function StatsStore() {
  const [data, setData] = useState([]);
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
    { field: "store_name", headerName: "Point de vente", width: 200 },

    {
      field: "jan",
      headerName: "Janvier",
      width: 200,
      renderCell: (params) => {
        return format(params.value);
      },
    },
    {
      field: "feb",
      headerName: "Février",
      width: 200,
      renderCell: (params) => {
        return format(params.value);
      },
    },
    {
      field: "march",
      headerName: "Mars",
      width: 200,
      renderCell: (params) => {
        return format(params.value);
      },
    },
    {
      field: "apr",
      headerName: "Avril",
      width: 200,
      renderCell: (params) => {
        return format(params.value);
      },
    },
    {
      field: "mai",
      headerName: "Mai",
      width: 200,
      renderCell: (params) => {
        return format(params.value);
      },
    },
    {
      field: "june",
      headerName: "Juin",
      width: 200,
      renderCell: (params) => {
        return format(params.value);
      },
    },
    {
      field: "jul",
      headerName: "Juillet",
      width: 200,
      renderCell: (params) => {
        return format(params.value);
      },
    },
    {
      field: "aug",
      headerName: "Août",
      width: 200,
      renderCell: (params) => {
        return format(params.value);
      },
    },
    {
      field: "sept",
      headerName: "Septembre",
      width: 200,
      renderCell: (params) => {
        return format(params.value);
      },
    },
    {
      field: "oct",
      headerName: "Octobre",
      width: 200,
      renderCell: (params) => {
        return format(params.value);
      },
    },
    {
      field: "nov",
      headerName: "Novembre",
      width: 200,
      renderCell: (params) => {
        return format(params.value);
      },
    },
    {
      field: "dec",
      headerName: "Décembre",
      width: 200,
      renderCell: (params) => {
        return format(params.value);
      },
    },
  ];
  const rows = data.map((item) => ({
    id: item.id,
    store_name: item.store.store_name,
    jan: item.jan,
    feb: item.feb,
    march: item.march,
    apr: item.apr,
    mai: item.mai,
    june: item.june,
    jul: item.jul,
    aug: item.aug,
    sept: item.sept,
    oct: item.oct,
    nov: item.nov,
    dec: item.dec,
  }));

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
            <Grid item xs={12} md={12}>
              <DataGrid
                slots={{ toolbar: CustomToolbar }}
                rows={rows}
                columns={columns}
                // onRowClick={handleClick}
              />
            </Grid>

            <Grid item xs={12} md={12}>
              <Paper>
                <Chart rotated data={rows}>
                  <Title text="Ventes par point de ventes" />
                  <ArgumentAxis />
                  <ValueAxis />
                  <BarSeries name="Janvier" argumentField="store_name" valueField="jan" />
                  <BarSeries name="Février" argumentField="store_name" valueField="feb" />
                  <BarSeries name="Mars" argumentField="store_name" valueField="march" />
                  <BarSeries name="Avril" argumentField="store_name" valueField="apr" />
                  <BarSeries name="Mai" argumentField="store_name" valueField="mai" />
                  <BarSeries name="Juin" argumentField="store_name" valueField="june" />
                  <BarSeries name="Juillet" argumentField="store_name" valueField="jul" />
                  <BarSeries name="Août" argumentField="store_name" valueField="aug" />
                  <BarSeries name="Septembre" argumentField="store_name" valueField="sept" />
                  <BarSeries name="Octobre" argumentField="store_name" valueField="oct" />
                  <BarSeries name="Novembre" argumentField="store_name" valueField="nov" />
                  <BarSeries name="Décembre" argumentField="store_name" valueField="dec" />

                  <Stack />
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
