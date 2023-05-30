import SimpleFooter from "examples/Footers/SimpleFooter";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import { useRef } from "react";
import { signIn } from "routes/ws_call";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Snackbar } from "@mui/material";

export default function Signin() {
  const [snackbar, setSnackbar] = useState(null);
  const handleCloseSnackbar = () => setSnackbar(null);

  const navigate = useNavigate();
  const email = useRef();
  const passwd = useRef();

  const signin = async (e) => {
    e.preventDefault();

    try {
      const data = await signIn(email.current.value, passwd.current.value);

      sessionStorage.setItem("user", JSON.stringify(data));
      if (data.store.category.category_level === 0) navigate("/magasin");
      else if (data.store.category.category_level === 10) navigate("/salespoint");
    } catch (error) {
      setSnackbar({ children: error.message, severity: "error" });
    }
  };

  return (
    <>
      <MKBox
        position="absolute"
        top={0}
        left={0}
        zIndex={1}
        width="100%"
        minHeight="100vh"
        sx={{
          backgroundImage: ({ functions: { linearGradient, rgba }, palette: { gradients } }) =>
            `${linearGradient(
              rgba(gradients.dark.main, 0.6),
              rgba(gradients.dark.state, 0.6)
            )}, url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <MKBox px={1} width="100%" height="100vh" mx="auto" position="relative" zIndex={2}>
        <Grid container spacing={1} justifyContent="center" alignItems="center" height="100%">
          <Grid item xs={11} sm={9} md={5} lg={4} xl={3}>
            <Card>
              <MKBox
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                mx={2}
                mt={-3}
                p={2}
                mb={1}
                textAlign="center"
              >
                <MKTypography variant="h4" fontWeight="medium" color="white" mt={1}>
                  Authentification
                </MKTypography>
              </MKBox>
              <MKBox pt={4} pb={3} px={3}>
                <form onSubmit={signin}>
                  <MKBox>
                    <MKBox mb={2}>
                      <MKInput type="email" label="E-mail" inputRef={email} fullWidth />
                    </MKBox>
                    <MKBox mb={2}>
                      <MKInput type="password" inputRef={passwd} label="Mot de passe" fullWidth />
                    </MKBox>
                    <MKBox mt={4} mb={1}>
                      <MKButton
                        type="submit"
                        variant="gradient"
                        onSubmit={signin}
                        color="info"
                        fullWidth
                      >
                        se connecter
                      </MKButton>
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
                </form>
              </MKBox>
            </Card>
          </Grid>
        </Grid>
      </MKBox>
      <MKBox width="100%" position="absolute" zIndex={2} bottom="1.625rem">
        <SimpleFooter />
      </MKBox>
    </>
  );
}
