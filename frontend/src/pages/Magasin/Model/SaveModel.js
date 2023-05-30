import { useEffect, useRef, useState } from "react";

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
import { getModel } from "routes/ws_call";
import { saveModel } from "routes/ws_call";
import { getCpus } from "routes/ws_call";
import { getBrands } from "routes/ws_call";
import FormInput from "own/components/form/FormInput";
import { Alert, Snackbar } from "@mui/material";

export default function SaveModel() {
  const [snackbar, setSnackbar] = useState(null);
  const handleCloseSnackbar = () => setSnackbar(null);

  const brand_idRef = useRef({});
  const nameRef = useRef();
  const cpu_idRef = useRef({});
  const screenRef = useRef();
  const ramRef = useRef();
  const diskRef = useRef();

  const q = useRef();
  const [data, setData] = useState([]);
  const [brandData, setBrandData] = useState([]);
  const [cpuData, setCpuData] = useState([]);

  const fetchData = async () => {
    try {
      const models = await getModel(q.current.value);
      setData(models);
      const brands = await getBrands();
      setBrandData(brands);
      const cpus = await getCpus();
      setCpuData(cpus);
    } catch (error) {
      setSnackbar({ children: error, severity: "error" });
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  console.log(data);
  function handleSearch() {
    fetchData();
  }

  const title = "Enregistrement d'un Modèle";

  const save = async (event) => {
    event.preventDefault();

    await saveModel(
      brand_idRef.current.value,
      nameRef.current.value,
      cpu_idRef.current.value,
      screenRef.current.value,
      ramRef.current.value,
      diskRef.current.value
    )
      .then(() => {
        setSnackbar({ children: "Modèle enregistré", severity: "success" });
        fetchData();
      })
      .catch((e) => {
        setSnackbar({ children: e.message, severity: "error" });
      });
  };

  const columns = [
    { field: "model_name", headerName: "Référence", width: 300 },
    { field: "cpu_name", headerName: "Processeur", width: 150 },
    { field: "screen", headerName: "Ecran", width: 100 },
    { field: "ram", headerName: "Ram", width: 150 },
    { field: "disk", headerName: "Stockage", width: 150 },
  ];

  const rows = data.map((item) => ({
    id: item.id,
    model_name: item.model_name,
    cpu_name: item.cpu.cpu_name,
    screen: item.screen_size,
    ram: item.ram_size,
    disk: item.disk_size,
  }));

  const brandInput = {
    label: "Marque",
    type: "data",
    placeholder: "Marque",
    ref: brand_idRef,
    required: true,

    data: {
      data: brandData,
      label: "brand_name",
      value: "id",
    },
  };

  const cpuInput = {
    label: "Processeur",
    type: "data",
    placeholder: "cpu",
    ref: cpu_idRef,
    required: true,

    data: {
      data: cpuData,
      label: "cpu_name",
      value: "id",
    },
  };
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
                    <FormInput {...brandInput} />
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <MKInput
                      variant="standard"
                      label="Modèle"
                      type="text"
                      inputRef={nameRef}
                      placeholder="référence"
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <FormInput {...cpuInput} />
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <MKInput
                      variant="standard"
                      label="Ram"
                      type="number"
                      inputRef={ramRef}
                      InputProps={{ inputProps: { min: 0 } }}
                      placeholder="Go"
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <MKInput
                      variant="standard"
                      label="Capacité de stockage"
                      type="number"
                      inputRef={diskRef}
                      InputProps={{ inputProps: { min: 0 } }}
                      placeholder="Go"
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <MKInput
                      variant="standard"
                      label="Ecran"
                      type="number"
                      inputRef={screenRef}
                      placeholder="pouce"
                      fullWidth
                      required
                      InputProps={{ inputProps: { min: 0, step: "any" } }}
                    />
                  </Grid>

                  <Grid container item justifyContent="center" xs={12} my={2}>
                    <MKButton type="submit" variant="gradient" color="dark" fullWidth>
                      Enregistrer
                    </MKButton>
                  </Grid>
                </MKBox>
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
              <DataGrid rows={rows} columns={columns} />
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
