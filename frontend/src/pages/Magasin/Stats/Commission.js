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
import MKAlert from "components/MKAlert";
import MKInput from "components/MKInput";
import { DataGrid } from "@mui/x-data-grid";
import { Alert, Snackbar } from "@mui/material";
import { updateCommission } from "routes/ws_call";
import { getCommissions } from "routes/ws_call";
import { saveCommissions } from "routes/ws_call";

export default function Commission() {
  const [snackbar, setSnackbar] = useState(null);

  const handleCloseSnackbar = () => setSnackbar(null);
  const processRowUpdate = useCallback(async (newRow) => {
    // Make the HTTP request to save in the backend
    const response = await updateCommission(newRow.id, newRow.min, newRow.max, newRow.commission);
    setSnackbar({ children: "Commission modifié", severity: "success" });
    return response;
  }, []);

  const handleProcessRowUpdateError = useCallback((error) => {
    setSnackbar({ children: error.message, severity: "error" });
  }, []);

  const minRef = useRef();
  const maxRef = useRef();
  const comRef = useRef();

  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const commissions = await getCommissions();
      console.log(commissions);
      setData(commissions);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const title = "Palier de commissions";

  const [error, setError] = useState("");

  const save = async (event) => {
    event.preventDefault();

    await saveCommissions(minRef.current.value, maxRef.current.value, comRef.current.value)
      .then(() => {
        fetchData();
      })
      .catch((e) => {
        setError(e.message);
      });
  };

  const columns = [
    { field: "min", headerName: "Total min", width: 300, editable: true },
    { field: "max", headerName: "Total max", width: 300, editable: true },
    { field: "commission", headerName: "Commission (%)", width: 150, editable: true },
  ];

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
            <Grid item xs={12} md={12}>
              <MKBox width="100%" component="form" type="submit" onSubmit={save} autoComplete="off">
                <MKBox p={3}>
                  <Grid item xs={12} md={3}>
                    <MKInput
                      variant="standard"
                      label="Min"
                      type="number"
                      inputRef={minRef}
                      placeholder="prix min"
                      InputProps={{ inputProps: { step: "any" } }}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <MKInput
                      variant="standard"
                      label="Max"
                      type="number"
                      inputRef={maxRef}
                      InputProps={{ inputProps: { step: "any" } }}
                      placeholder="prix max"
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <MKInput
                      variant="standard"
                      label="Commission"
                      type="number"
                      inputRef={comRef}
                      placeholder="%"
                      InputProps={{ inputProps: { step: "any" } }}
                      fullWidth
                      required
                    />
                  </Grid>

                  <Grid container item justifyContent="center" xs={12} my={2}>
                    <MKButton type="submit" variant="gradient" color="dark" fullWidth>
                      Ajouter
                    </MKButton>
                  </Grid>
                </MKBox>
                <MKBox mb={2}>{error ? <MKAlert color="error">{error}</MKAlert> : <></>}</MKBox>
              </MKBox>
            </Grid>
            <Grid item xs={12} md={12}>
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
