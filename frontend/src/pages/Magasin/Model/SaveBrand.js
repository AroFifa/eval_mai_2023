import { useCallback, useEffect, useRef, useState } from "react";

// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import MKTypography from "components/MKTypography";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import magasin_routes from "routes/magasin";
import SimpleFooter from "examples/Footers/SimpleFooter";
import MKInput from "components/MKInput";
import { DataGrid } from "@mui/x-data-grid";
import { searchBrands } from "routes/ws_call";
import { saveBrand } from "routes/ws_call";
import { Alert, Snackbar } from "@mui/material";
import { updateBrand } from "routes/ws_call";

export default function SaveBrand() {
  const [snackbar, setSnackbar] = useState(null);

  const handleCloseSnackbar = () => setSnackbar(null);
  const processRowUpdate = useCallback(async (newRow) => {
    // Make the HTTP request to save in the backend
    const response = await updateBrand(newRow.id, newRow.brand_name);
    setSnackbar({ children: "Marque modifié", severity: "success" });
    return response;
  }, []);

  const handleProcessRowUpdateError = useCallback((error) => {
    setSnackbar({ children: error.message, severity: "error" });
  }, []);

  const inputRef = useRef();
  const q = useRef();
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const brands = await searchBrands(q.current.value);
      setData(brands);
    } catch (error) {
      setSnackbar({ children: error, severity: "error" });

      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  function handleSearch() {
    fetchData();
  }

  const title = "Enregistrement d'un Marque";

  const save = async (event) => {
    event.preventDefault();

    await saveBrand(inputRef.current.value)
      .then(() => {
        setSnackbar({ children: "Marque enregistré", severity: "success" });

        fetchData();
      })
      .catch((e) => {
        setSnackbar({ children: e.message, severity: "error" });
      });
  };

  const columns = [{ field: "brand_name", headerName: "Marque", width: 300, editable: true }];

  return (
    <>
      <DefaultNavbar routes={magasin_routes} brand={"Magasin centrale"} sticky />
      <MKBox component="section" py={12} minHeight="75vh" marginTop="50px">
        <Container>
          <Grid container item justifyContent="center" xs={10} lg={7} mx="auto" textAlign="center">
            <MKTypography variant="h3" mb={1}>
              {title}
            </MKTypography>
          </Grid>
          <Grid container item sx={{ mx: "auto" }} spacing={2}>
            <Grid item xs={12} md={4}>
              <MKBox width="100%" component="form" type="submit" onSubmit={save} autoComplete="off">
                <MKBox p={3}>
                  <Grid item xs={12} md={8}>
                    <MKInput
                      variant="standard"
                      label="Marque"
                      type="text"
                      inputRef={inputRef}
                      placeholder="marque"
                      fullWidth
                      required
                    />
                  </Grid>

                  <Grid container item justifyContent="center" xs={12} my={2}>
                    <MKButton type="submit" variant="gradient" color="dark" fullWidth>
                      Enregistrer
                    </MKButton>
                  </Grid>
                </MKBox>
              </MKBox>
            </Grid>
            <Grid item xs={12} md={8}>
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
              <DataGrid
                rows={data}
                columns={columns}
                processRowUpdate={processRowUpdate}
                onProcessRowUpdateError={handleProcessRowUpdateError}
              />
              {!!snackbar && (
                <Snackbar
                  open
                  anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                  onClose={handleCloseSnackbar}
                  autoHideDuration={6000}
                >
                  <Alert {...snackbar} onClose={handleCloseSnackbar} />
                </Snackbar>
              )}
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
