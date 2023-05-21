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
import { purchaseLaptops } from "routes/ws_call";
import { searchLaptop } from "routes/ws_call";

export default function Purchase() {
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState([]);

  const [error, setError] = useState("");
  const qttRef = useRef([]);
  const priceRef = useRef([]);
  const dateRef = useRef();

  const q = useRef();

  const [laptops, setLaptops] = useState([]);
  const fetchData = async () => {
    try {
      const data = await searchLaptop(q.current.value);
      setLaptops(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  function handleSearch() {
    searchLaptop(q.current.value)
      .then((data) => {
        setLaptops(data);
      })
      .catch((error) => {
        // Handle any potential errors from the Promise
        console.error(error);
      });
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handlePurchase = async (event) => {
    event.preventDefault();
    console.log(event);

    const purchaseItems = selectedRows.map((row) => ({
      laptop_id: row,
      qtt: qttRef.current[row].value,
      price: priceRef.current[row].value,
    }));

    await purchaseLaptops(dateRef.current.value, purchaseItems)
      .then(() => {
        navigate("/magasin/laptops/transfer");
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
        InputProps={{ inputProps: { min: 1 } }}
        fullWidth
        required
      />
    ) : (
      <></>
    );
  };

  const priceInput = (params) => {
    const rowChecked = selectedRows.includes(parseInt(params.row.id));

    return rowChecked ? (
      <MKInput
        variant="standard"
        label="Montant"
        type="number"
        inputRef={(ref) => (priceRef.current[parseInt(params.row.id)] = ref)}
        placeholder="prix"
        InputLabelProps={{ shrink: true }}
        InputProps={{ inputProps: { min: 0, step: "any" } }}
        fullWidth
        required
      />
    ) : (
      <></>
    );
  };

  const columns = [
    { field: "brand_name", headerName: "Brand", width: 150 },
    { field: "model_name", headerName: "Model", width: 200 },

    {
      field: "qtt",
      headerName: "Quantité ",
      renderCell: (params) => qttInput(params),
    },

    {
      field: "price",
      headerName: "Prix unitaire",
      width: 200,
      renderCell: (params) => priceInput(params),
    },
  ];

  const rows = laptops.map((item) => ({
    id: item.id,
    brand_name: item.model.brand.brand_name,
    model_name: item.model.model_name,
    screen_size: item.model.screen_size,
    cpu_name: item.model.cpu.cpu_name,
    ram_value: item.model.ram_size,
    disk_size: item.model.disk_size,
  }));

  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      <DefaultNavbar routes={magasin_routes} brand={"Magasin centrale"} sticky />
      <MKBox component="section" py={12} minHeight="75vh" marginTop="50px">
        <Grid container item justifyContent="center" xs={10} lg={7} mx="auto" textAlign="center">
          <MKTypography variant="h3" mb={1}>
            Achat des ordinateurs
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
          <form type="submit" onSubmit={(event) => handlePurchase(event)}>
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
              <MKButton type="submit" variant="gradient" color="dark" fullWidth>
                Acheter
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
