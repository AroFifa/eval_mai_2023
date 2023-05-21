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
import MKAlert from "components/MKAlert";
import MKInput from "components/MKInput";
import { DataGrid } from "@mui/x-data-grid";
import { searchBrands } from "routes/ws_call";
import { saveBrand } from "routes/ws_call";

export default function SaveBrand() {
  const inputRef = useRef();
  const q = useRef();
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const brands = await searchBrands(q.current.value);
      setData(brands);
    } catch (error) {
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

  const title = "Enregistrement d'un Marque";

  const [error, setError] = useState("");

  const save = async (event) => {
    event.preventDefault();

    await saveBrand(inputRef.current.value)
      .then(() => {
        fetchData();
      })
      .catch((e) => {
        setError(e.message);
      });
  };

  const columns = [{ field: "brand_name", headerName: "Marque", width: 300 }];

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
                <MKBox mb={2}>{error ? <MKAlert color="error">{error}</MKAlert> : <></>}</MKBox>
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
              <DataGrid rows={data} columns={columns} />
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