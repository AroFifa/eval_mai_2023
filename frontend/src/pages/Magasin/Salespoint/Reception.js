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
import { useNavigate } from "react-router-dom";
import magasin_routes from "routes/magasin";
import point_ventes_routes from "routes/point_ventes";
import { receiveLaptops } from "routes/ws_call";
import { filterReception } from "routes/ws_call";
export default function Reception() {
  const [selectedRows, setSelectedRows] = useState([]);

  const user = JSON.parse(sessionStorage.getItem("user"));

  const navigate = useNavigate();

  const routes = user.store.id === 1 ? magasin_routes : point_ventes_routes;
  const brand = user.store.id === 1 ? "Magasin central" : "Point de ventes";
  const smallbrand = user.store.id === 1 ? null : user.store.store_name;

  const [error, setError] = useState("");
  const qttRef = useRef([]);
  const q = useRef();
  const isTransfer = user.store.id === 1 ? true : false;

  const [receptions, setReceptions] = useState([]);
  const fetchData = async () => {
    try {
      const data = await filterReception(q.current.value);
      setReceptions(data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  function handleSearch() {
    filterReception(q.current.value)
      .then((data) => {
        setReceptions(data);
      })
      .catch((error) => {
        // Handle any potential errors from the Promise
        console.error(error);
      });
  }

  // console.log(receptions);

  const handleReceive = async (event) => {
    event.preventDefault;

    const today = new Date().toISOString().split("T")[0];

    const transferItems = selectedRows.map((row) => ({
      laptop_id: row,
      qtt: qttRef.current[row].value,
    }));

    await receiveLaptops(isTransfer, today, transferItems)
      .then(() => {
        navigate("/point_vente/transfers/central");
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
        defaultValue={params.row.qtt}
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
      headerName: "Envoyé ",
    },
    {
      field: "qttinput",
      headerName: "Quantité ",
      renderCell: (params) => qttInput(params),
    },
  ];

  const rows = receptions.map((item) => ({
    id: item.id,
    brand_name: item.laptop.brand.brand_name,
    model_name: item.laptop.model_name,
    qtt: item.qtt,
  }));

  return (
    <>
      <DefaultNavbar routes={routes} brand={brand} smallbrand={smallbrand} sticky />
      <MKBox component="section" py={12} minHeight="75vh" marginTop="50px">
        <Grid container item justifyContent="center" xs={10} lg={7} mx="auto" textAlign="center">
          <MKTypography variant="h3" mb={1}>
            Réception des ordinateurs
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
          <form type="submit" onSubmit={(event) => handleReceive(event)}>
            {" "}
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
                Valider la réception
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
