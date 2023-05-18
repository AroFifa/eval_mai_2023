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
import { useLocation } from "react-router-dom";
import MKAlert from "components/MKAlert";
import { updateLaptop } from "routes/ws_call";
import { getModelsByBrand } from "routes/ws_call";
import { getBrands } from "routes/ws_call";

export default function UpdateLaptop() {
  const location = useLocation();
  const data = location.state;

  const defaultBrand = data.model.brand;
  const defaultModel = data.model;
  const brandRef = useRef(defaultBrand);
  const modelRef = useRef(defaultModel);

  const [brandData, setBrandData] = useState([]);
  const [modelData, setmodelData] = useState([]);
  const fetchData = async () => {
    try {
      const brands = await getBrands();
      setBrandData(brands);

      const models = await getModelsByBrand(defaultBrand.id);
      setmodelData(models);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  function onbrandchange() {
    getModelsByBrand(brandRef.current.value)
      .then((models) => {
        setmodelData(models);
      })
      .catch((error) => {
        // Handle any potential errors from the Promise
        console.error(error);
      });
  }

  const brandInput = {
    label: "Marque",
    type: "data",
    placeholder: "Marque",
    ref: brandRef,
    defaultValue: defaultBrand,
    onchange: onbrandchange,

    data: {
      data: brandData,
      label: "brand_name",
      value: "id",
    },
  };
  const modelInput = {
    label: "Modèle",
    type: "data",
    placeholder: "Référence",
    ref: modelRef,
    defaultValue: defaultModel,
    required: true,

    fullWidth: true,
    data: {
      data: modelData,
      label: "model_name",
      value: "id",
    },
  };

  const title = "Modification";
  const [error, setError] = useState("");

  const update = async (event) => {
    event.preventDefault();

    await updateLaptop(data.id, modelRef.current.value)
      .then(() => {
        window.location.replace("/magasin/laptops/list");
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
            <MKBox width="100%" component="form" type="submit" onSubmit={update} autoComplete="off">
              <MKBox p={3}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <FormInput {...brandInput} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormInput {...modelInput} />
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
