import { Checkbox, Container, FormControlLabel, FormGroup, Grid } from "@mui/material";
import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import MKTypography from "components/MKTypography";

export default function DynamicForm() {
  return (
    <>
      <MKBox component="dynamicform" py={12}>
        <Container>
          <Grid container item justifyContent="center" xs={10} lg={7} mx="auto" textAlign="center">
            <MKTypography variant="h3" mb={1}>
              Contact Us
            </MKTypography>
          </Grid>
          <Grid container item xs={12}>
            <form method="post">
              <Grid container spacing={3}>
                {/* 



                   */}
                <Grid item xs={12}>
                  <FormGroup>
                    <FormControlLabel control={<Checkbox defaultChecked />} label="Label" />
                    <FormControlLabel required control={<Checkbox />} label="Required" />
                    <FormControlLabel disabled control={<Checkbox />} label="Disabled" />
                  </FormGroup>
                </Grid>
                {/* 




                   */}
              </Grid>

              {/* 





                 */}
              <Grid container item justifyContent="center" xs={12} my={2}>
                <MKButton type="submit" variant="gradient" color="dark" fullWidth>
                  Send Message
                </MKButton>
              </Grid>
              {/* 







                 */}
              {/* </MKBox> */}
            </form>
          </Grid>
        </Container>
      </MKBox>
    </>
  );
}
