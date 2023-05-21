import MKBox from "components/MKBox";
import SimpleFooter from "examples/Footers/SimpleFooter";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import magasin_routes from "routes/magasin";

export default function Home() {
  const user = JSON.parse(sessionStorage.getItem("user"));

  const navigate = useNavigate();

  useEffect(() => {
    if (user === null || user.store.category.category_level !== 0) {
      navigate("/signin");
    }
  }, [user]);

  return (
    <>
      <DefaultNavbar routes={magasin_routes} brand={"Magasin centrale"} sticky />
      <MKBox minHeight="75vh" marginTop="50px"></MKBox>
      <MKBox pt={6} px={1} mt={6}>
        <SimpleFooter />
      </MKBox>
    </>
  );
}
