import { Home, Logout } from "@mui/icons-material";
import AboutUs from "pages/LandingPages/AboutUs";
import Presentation from "pages/Presentation";

const routes = [
  {
    name: "Home",
    icon: <Home />,
    route: "/home",
    component: <AboutUs />,
    key: 1,
  },
  {
    name: "Logout",
    icon: <Logout />,
    route: "/logout",
    component: <Presentation />,
    key: 2,
  },
];

export default routes;
