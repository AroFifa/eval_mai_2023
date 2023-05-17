import { Logout, Home as HomeIcon, Storage, Payment } from "@mui/icons-material";
import Home from "pages/PointVentes/Home";
import SignOut from "pages/Authentication/Signout";

const point_ventes_routes = [
  {
    name: "Home",
    icon: <HomeIcon />,
    route: "/point_vente/home",
    component: <Home />,
    key: 1,
  },
  {
    name: "Magasin central",
    icon: <Storage />,
    columns: 1,
    rowsPerColumn: 2,
    collapse: [
      {
        name: "Mouvement de LapTop",
        collapse: [
          {
            name: "Réception",
            route: "/point_vente/transfers/valid",
            component: <Home />,
          },
          {
            name: "Renvoi",
            route: "/point_vente/transfers/central",
            component: <Home />,
          },
        ],
      },
    ],
    key: 2,
  },
  {
    name: "Vente de LapTop",
    icon: <Payment />,
    columns: 1,
    rowsPerColumn: 2,
    collapse: [
      {
        name: "Vente",
        collapse: [
          {
            name: "Vente",
            route: "/point_vente/laptop/sale",
            component: <Home />,
          },
        ],
      },
    ],
    key: 2,
  },
  {
    name: "Logout",
    icon: <Logout />,
    route: "/point_vente/logout",
    component: <SignOut />,
    key: 4,
  },
];

export default point_ventes_routes;
