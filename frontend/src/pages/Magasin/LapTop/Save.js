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
import { getBrands } from "routes/ws_call";
import { getModelsByBrand } from "routes/ws_call";
import MKAlert from "components/MKAlert";
import { saveLaptop } from "routes/ws_call";
import { useNavigate } from "react-router-dom";
import MKInput from "components/MKInput";

function SaveLaptop() {
  const brandRef = useRef({});
  const modelRef = useRef({});
  const priceRef = useRef();
  const navigate = useNavigate();

  const [brandData, setBrandData] = useState([]);
  const [modelData, setmodelData] = useState([]);
  const fetchData = async () => {
    try {
      const brands = await getBrands();
      setBrandData(brands);
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
    required: true,

    fullWidth: true,
    data: {
      data: modelData,
      label: "model_name",
      value: "id",
    },
  };

  const title = "Enregistrement d'un ordintateur";

  const [error, setError] = useState("");

  const save = async (event) => {
    event.preventDefault();

    await saveLaptop(priceRef.current.value, modelRef.current.value)
      .then(() => {
        navigate("/magasin/laptops/list");
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
                    <FormInput {...brandInput} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormInput {...modelInput} />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={8}>
                    <MKInput
                      variant="standard"
                      label="Prix"
                      type="number"
                      inputRef={priceRef}
                      placeholder="montant"
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ inputProps: { min: 1, step: "any" } }}
                      fullWidth
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

export default SaveLaptop;
