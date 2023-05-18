import { useEffect, useRef, useState } from "react";

// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import MKTypography from "components/MKTypography";
import FormInput from "own/components/form/FormInput";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import magasin_routes from "routes/magasin";
import SimpleFooter from "examples/Footers/SimpleFooter";
import MKAlert from "components/MKAlert";
import { useNavigate } from "react-router-dom";
import { getLocations } from "routes/ws_call";
import { saveSalespoint } from "routes/ws_call";
import MKInput from "components/MKInput";

function SaveSalespoint() {
  const lieuRef = useRef({});
  const nameRef = useRef();
  const navigate = useNavigate();

  const [locationData, setLocationData] = useState([]);
  const fetchData = async () => {
    try {
      const locations = await getLocations();
      setLocationData(locations);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const locationInput = {
    label: "Localisation",
    type: "data",
    placeholder: "lieu",
    ref: lieuRef,

    InputLabelProps: { shrink: true },
    required: true,
    data: {
      data: locationData,
      label: "location_name",
      value: "id",
    },
  };

  const title = "Enregistrement de point de ventes";

  const [error, setError] = useState("");

  const save = async (event) => {
    event.preventDefault();

    await saveSalespoint(lieuRef.current.value, nameRef.current.value)
      .then(() => {
        navigate("/magasin/stores/list");
      })
      .catch((e) => {
        setError(e.message);
      });
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
          <Grid container item xs={12} lg={7} sx={{ mx: "auto" }}>
            <MKBox width="100%" component="form" type="submit" onSubmit={save} autoComplete="off">
              <MKBox p={3}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <FormInput {...locationInput} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MKInput
                      variant="standard"
                      label="Nom du point de vente"
                      placeholder="point de vente"
                      type="text"
                      fullWidth
                      inputRef={nameRef}
                      InputLabelProps={{ shrink: true }}
                      required
                    />
                  </Grid>
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
        </Container>
      </MKBox>
      <MKBox pt={6} px={1} mt={6}>
        <SimpleFooter />
      </MKBox>
    </>
  );
}

export default SaveSalespoint;
