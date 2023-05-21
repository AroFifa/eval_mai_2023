import { Logout, Storage, Payment } from "@mui/icons-material";
import SignOut from "pages/Authentication/Signout";
import Transfert from "pages/Magasin/LapTop/Transfert";
import Reception from "pages/Magasin/Salespoint/Reception";
import ListSales from "pages/PointVentes/List";
import Sale from "pages/PointVentes/Vente";

const point_ventes_routes = [
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
            component: <Reception />,
          },
          {
            name: "Renvoi",
            route: "/point_vente/transfers/central",
            component: <Transfert />,
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
            component: <Sale />,
          },
          {
            name: "Liste",
            route: "/point_vente/sales",
            component: <ListSales />,
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
