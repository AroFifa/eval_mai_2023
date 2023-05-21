import MKBox from "components/MKBox";
import SimpleFooter from "examples/Footers/SimpleFooter";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import point_ventes_routes from "routes/point_ventes";

export default function Home() {
  const user = JSON.parse(sessionStorage.getItem("user"));

  const navigate = useNavigate();
  useEffect(() => {
    if (user === null || user.store.category.category_level !== 10) {
      navigate("/signin");
    }
  }, [user]);
  return (
    <>
      <DefaultNavbar
        routes={point_ventes_routes}
        brand={"Point de ventes"}
        smallbrand={user?.store.store_name}
        sticky
      />
      <MKBox minHeight="75vh" marginTop="50px"></MKBox>
      <MKBox pt={6} px={1} mt={6}>
        <SimpleFooter />
      </MKBox>
    </>
  );
}
