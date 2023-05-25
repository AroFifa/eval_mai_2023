import { Grid } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import MKAlert from "components/MKAlert";
import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import MKInput from "components/MKInput";
import MKTypography from "components/MKTypography";
import SimpleFooter from "examples/Footers/SimpleFooter";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import { useEffect, useRef, useState } from "react";
import { NumericFormat } from "react-number-format";
import point_ventes_routes from "routes/point_ventes";
import { saleLaptops } from "routes/ws_call";
import { searchStocks } from "routes/ws_call";

export default function Sale() {
  const [selectedRows, setSelectedRows] = useState([]);

  const user = JSON.parse(sessionStorage.getItem("user"));

  const routes = point_ventes_routes;
  const brand = "Point de ventes";
  const smallbrand = user.store.store_name;

  const [error, setError] = useState("");
  const qttRef = useRef([]);
  const dateRef = useRef();

  const q = useRef();

  const [stocks, setStocks] = useState([]);
  const fetchData = async () => {
    try {
      const data = await searchStocks(q.current.value);
      setStocks(data);
    } catch (error) {
      console.error(error);
    }
  };

  function handleSearch() {
    fetchData();
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleSales = async (event) => {
    event.preventDefault();

    const transferItems = selectedRows.map((row) => ({
      item_id: row,
      qtt: qttRef.current[row].value,
    }));

    await saleLaptops(dateRef.current.value, transferItems)
      .then(() => {
        fetchData();
      })
      .catch((e) => {
        setError(e.message);
      });
  };

  const qttInput = (params) => {
    const rowChecked = selectedRows.includes(parseInt(params.row.id));

    return rowChecked ? (
      <MKInput
        variant="standard"
        label="Qtt"
        type="number"
        inputRef={(ref) => (qttRef.current[parseInt(params.row.id)] = ref)}
        placeholder="qtt"
        defaultValue={1}
        InputLabelProps={{ shrink: true }}
        InputProps={{ inputProps: { min: 1, max: params.row.qtt } }}
        fullWidth
        required
      />
    ) : (
      <></>
    );
  };

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
    { field: "brand_name", headerName: "Brand", width: 150 },
    { field: "model_name", headerName: "Model", width: 300 },
    {
      field: "qtt",
      headerName: "Disponible ",
    },
    {
      field: "qttinput",
      headerName: "Quantité ",
      renderCell: (params) => qttInput(params),
    },
    {
      field: "prix",
      headerName: "Prix unitaire",
      width: 200,

      renderCell: (params) => {
        return format(params.value);
      },
    },
  ];

  const rows = stocks.map((item) => ({
    id: item.id,
    brand_name: item.laptop.model.brand.brand_name,
    model_name: item.laptop.model.model_name,
    qtt: item.qtt,
    prix: item.laptop.sales_price,
  }));

  const today = new Date().toISOString().split("T")[0];
  return (
    <>
      <DefaultNavbar routes={routes} brand={brand} smallbrand={smallbrand} sticky />
      <MKBox component="section" py={12} minHeight="75vh" marginTop="50px">
        <Grid container item justifyContent="center" xs={10} lg={7} mx="auto" textAlign="center">
          <MKTypography variant="h3" mb={1}>
            Vente des ordinateurs
          </MKTypography>
        </Grid>
        <Grid container item xs={12} lg={7} sx={{ mx: "auto" }}>
          <MKInput
            variant="standard"
            label="Recherche"
            type="search"
            inputRef={q}
            placeholder="pattern"
            InputLabelProps={{ shrink: true }}
            fullWidth
            onChange={handleSearch}
          />
        </Grid>
        <Grid container item xs={12} lg={7} sx={{ mx: "auto" }}>
          <form type="submit" onSubmit={(event) => handleSales(event)}>
            {" "}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <MKInput
                  variant="standard"
                  label="Date"
                  type="date"
                  defaultValue={today}
                  fullWidth
                  inputRef={dateRef}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
            </Grid>
            <DataGrid
              rows={rows}
              columns={columns}
              disableRowSelectionOnClick
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              pageSizeOptions={[5, 10]}
              checkboxSelection
              onRowSelectionModelChange={(newRowSelectionModel) => {
                setSelectedRows(newRowSelectionModel);
              }}
              rowSelectionModel={selectedRows}
            />
            <Grid container item justifyContent="center" xs={12} my={2}>
              <MKButton type="submit" variant="gradient" color="success" fullWidth>
                Vendu
              </MKButton>
            </Grid>
          </form>
          <MKBox mb={2}>{error ? <MKAlert color="error">{error}</MKAlert> : <></>}</MKBox>
        </Grid>
      </MKBox>
      <MKBox pt={6} px={1} mt={6}>
        <SimpleFooter />
      </MKBox>
    </>
  );
}
