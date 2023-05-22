import { Grid } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import MKAlert from "components/MKAlert";
import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import MKInput from "components/MKInput";
import MKTypography from "components/MKTypography";
import SimpleFooter from "examples/Footers/SimpleFooter";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import FormInput from "own/components/form/FormInput";
import { useEffect, useRef, useState } from "react";
import magasin_routes from "routes/magasin";
import point_ventes_routes from "routes/point_ventes";
import { sendLaptops } from "routes/ws_call";
import { searchStocks } from "routes/ws_call";
import { getSalesPoint } from "routes/ws_call";

export default function Transfert() {
  const [selectedRows, setSelectedRows] = useState([]);

  const user = JSON.parse(sessionStorage.getItem("user"));

  const routes = user.store.id === 1 ? magasin_routes : point_ventes_routes;
  const brand = user.store.id === 1 ? "Magasin central" : "Point de ventes";
  const smallbrand = user.store.id === 1 ? null : user.store.store_name;

  const title = user.store.id === 1 ? "Transfert" : "Renvoi";
  const hidden = user.store.id === 1 ? false : true;
  const isTransfer = user.store.id === 1 ? true : false;

  const [error, setError] = useState("");
  const qttRef = useRef([]);
  const dateRef = useRef();
  const storeRef = hidden ? useRef(1) : useRef({});

  const q = useRef();

  const [stocks, setStocks] = useState([]);
  const [salesPoints, setSalesPoints] = useState([]);
  const fetchData = async () => {
    try {
      const data = await searchStocks(q.current.value);
      setStocks(data);
      const stores = await getSalesPoint();
      setSalesPoints(stores);
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

  const salesPointInput = {
    label: "Transférer vers",
    type: "data",
    placeholder: "point de ventes",
    ref: storeRef,
    required: true,

    fullWidth: true,
    data: {
      data: salesPoints,
      label: "store_name",
      value: "id",
    },
  };

  const handleTransfer = async (event) => {
    event.preventDefault();

    const transferItems = selectedRows.map((row) => ({
      laptop_id: row,
      qtt: qttRef.current[row].value,
    }));

    await sendLaptops(isTransfer, dateRef.current.value, storeRef.current.value, transferItems)
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
  ];

  const rows = stocks.map((item) => ({
    id: item.id,
    brand_name: item.laptop.model.brand.brand_name,
    model_name: item.laptop.model.model_name,
    qtt: item.qtt,
  }));

  const today = new Date().toISOString().split("T")[0];
  return (
    <>
      <DefaultNavbar routes={routes} brand={brand} smallbrand={smallbrand} sticky />
      <MKBox component="section" py={12} minHeight="75vh" marginTop="50px">
        <Grid container item justifyContent="center" xs={10} lg={7} mx="auto" textAlign="center">
          <MKTypography variant="h3" mb={1}>
            {title} des ordinateurs
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
          <form type="submit" onSubmit={(event) => handleTransfer(event)}>
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
              {hidden ? (
                <></>
              ) : (
                <Grid item xs={12} md={6}>
                  <FormInput {...salesPointInput} />
                </Grid>
              )}
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
              <MKButton type="submit" variant="gradient" color="dark" fullWidth>
                Transférer
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
