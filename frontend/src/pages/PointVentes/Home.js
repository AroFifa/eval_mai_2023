import MKBox from "components/MKBox";
import SimpleFooter from "examples/Footers/SimpleFooter";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import { useEffect, useState } from "react";
import point_ventes_routes from "routes/point_ventes";

export default function Home() {
  const user = JSON.parse(sessionStorage.getItem("user"));

  const [isRedirecting, setIsRedirecting] = useState(false);
  useEffect(() => {
    if (user === null || user.store.category.category_level !== 10) {
      setIsRedirecting(true);
      window.location.href = "/signin";
    }
  }, [user]);

  if (isRedirecting) {
    // Render nothing while the redirect is happening
    return null;
  }
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
