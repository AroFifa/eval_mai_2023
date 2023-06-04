import { Image, Save } from "@mui/icons-material";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Grid,
  IconButton /* Paper */,
  List,
  ListItem,
  ListItemAvatar,
  Typography,
} from "@mui/material";
import MKBox from "components/MKBox";
import MKInput from "components/MKInput";
import SimpleFooter from "examples/Footers/SimpleFooter";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import { useRef, useState } from "react";
import bgImage from "assets/images/no_img.jpg";

import routes from "routes/routes";
export default function UploadImg() {
  const email = useRef([]);
  const passwd = useRef();
  const [result, setResult] = useState();

  const [img, setImg] = useState();
  const [imageDisplay, setImageDisplay] = useState(null);
  function handleImgChange(event) {
    const file = event.target.files[0];
    setImg(file);
    setImageDisplay(file ? URL.createObjectURL(file) : null);
  }
  // const save = async (event) => {
  //   event.preventDefault();

  //   const formData = new FormData();

  //   formData.append("email", email.current.value);
  //   formData.append("passwd", passwd.current.value);
  //   formData.append("image", img);

  //   // for (const [key, value] of formData.entries()) {
  //   //   console.log(`${key}: ${value}`);
  //   // }

  //   try {
  //     const response = await fetch("http://localhost:8080/img/upload", {
  //       method: "POST",
  //       body: formData,
  //     });
  //     const data = await response.json();
  //     setResult("http://localhost:8080/images/" + data.data);
  //     console.log(data);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const saveImg = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    formData.append("img", img);

    try {
      const response = await fetch("http://localhost:8080/images/save", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      setResult(`data:image/octet-stream;base64, ${data.data.imageDisplay}`);
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <DefaultNavbar routes={routes} sticky />
      <MKBox minHeight="120px" marginTop="50px"></MKBox>
      <Container>
        <Grid>
          <img src={result ? result : bgImage} height={"45vh"} width={"45vh"} />
          <MKBox
            component="form"
            encType="multipart/form-data"
            onSubmit={saveImg}
            autoComplete="off"
          >
            <Card>
              <CardMedia
                sx={{ height: "45vh", width: "45vh" }}
                image={imageDisplay ? imageDisplay : bgImage}
              />

              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Card
                </Typography>
                <List>
                  <ListItem>
                    <ListItemAvatar>
                      <IconButton color="primary" aria-label="upload picture" component="label">
                        <input
                          hidden
                          accept="image/*"
                          name="image"
                          onChange={handleImgChange}
                          type="file"
                        />
                        <Image />
                      </IconButton>
                    </ListItemAvatar>

                    <MKBox mb={2}>
                      <MKInput type="email" label="E-mail" inputRef={email} fullWidth />
                    </MKBox>
                    <MKBox mb={2}>
                      <MKInput type="password" label="Password" inputRef={passwd} fullWidth />
                    </MKBox>
                  </ListItem>
                </List>
              </CardContent>
              <CardActions>
                <IconButton color="primary" aria-label="save" type="submit">
                  <Save />
                </IconButton>
              </CardActions>
            </Card>
          </MKBox>
        </Grid>
      </Container>
      <MKBox pt={6} px={1} mt={6}>
        <SimpleFooter />
      </MKBox>
    </>
  );
}
