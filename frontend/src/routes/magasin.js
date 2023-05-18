import { Laptop, Logout, Home as HomeIcon, Category, Store } from "@mui/icons-material";
import Home from "../pages/Magasin/Home";
import SignOut from "pages/Authentication/Signout";
import SaveLaptop from "pages/Magasin/LapTop/Save";
import ListLaptop from "pages/Magasin/LapTop/List";
import EmployeeAffectation from "pages/Magasin/Salespoint/EmployeeAffectation";

const magasin_routes = [
  {
    name: "Home",
    icon: <HomeIcon />,
    route: "/magasin/home",
    component: <Home />,
    key: 1,
  },
  {
    name: "Gestion de Laptop",
    icon: <Laptop />,
    columns: 1,
    rowsPerColumn: 2,
    collapse: [
      {
        name: "Gestion",
        collapse: [
          {
            name: "Enregistrement",
            route: "/magasin/laptops/save",
            component: <SaveLaptop />,
          },
          {
            name: "Listes",
            route: "/magasin/laptops/list",
            component: <ListLaptop />,
          },
        ],
      },
      {
        name: "Achat",
        collapse: [
          {
            name: "Achat",
            route: "/magasin/laptops/purchase",
            component: <Home />,
          },
          {
            name: "Prix de ventes",
            route: "/magasin/laptops/price",
            component: <Home />,
          },
        ],
      },
      {
        name: "Transfert",
        collapse: [
          {
            name: "Transfert",
            route: "/magasin/laptops/transfer",
            component: <Home />,
          },
        ],
      },
    ],
    key: 2,
  },
  {
    name: "Données de référence",
    icon: <Category />,
    collapse: [
      {
        name: "Modèle",
        dropdown: true,
        collapse: [
          {
            name: "Enregistrement",
            route: "/magasin/model/models/save",
            component: <Home />,
          },
          {
            name: "Listes",
            route: "/magasin/model/models/list",
            component: <Home />,
          },
        ],
      },
      {
        name: "Marque",
        dropdown: true,
        collapse: [
          {
            name: "Enregistrement",
            route: "/magasin/model/brands/save",
            component: <Home />,
          },
          {
            name: "Listes",
            route: "/magasin/model/brands/list",
            component: <Home />,
          },
        ],
      },
      {
        name: "Processeur",
        dropdown: true,
        collapse: [
          {
            name: "Enregistrement",
            route: "/magasin/model/cpus/save",
            component: <Home />,
          },
          {
            name: "Listes",
            route: "/magasin/model/cpus/list",
            component: <Home />,
          },
        ],
      },

      {
        name: "Ecran",
        dropdown: true,
        collapse: [
          {
            name: "Enregistrement",
            route: "/magasin/model/screens/save",
            component: <Home />,
          },
          {
            name: "Listes",
            route: "/magasin/model/screens/list",
            component: <Home />,
          },
        ],
      },

      {
        name: "Ram",
        dropdown: true,
        collapse: [
          {
            name: "Enregistrement",
            route: "/magasin/model/rams/save",
            component: <Home />,
          },
          {
            name: "Listes",
            route: "/magasin/model/rams/list",
            component: <Home />,
          },
        ],
      },

      {
        name: "Disque",
        dropdown: true,
        collapse: [
          {
            name: "Enregistrement",
            route: "/magasin/model/disks/save",
            component: <Home />,
          },
          {
            name: "Listes",
            route: "/magasin/model/disks/list",
            component: <Home />,
          },
        ],
      },
    ],
    key: 3,
  },
  {
    name: "Gestion des points de ventes",
    icon: <Store />,
    columns: 1,
    rowsPerColumn: 2,
    collapse: [
      {
        name: "Point de ventes",
        collapse: [
          {
            name: "Enregistrement",
            route: "/magasin/stores/save",
            component: <Home />,
          },
          {
            name: "Listes",
            route: "/magasin/stores/list",
            component: <Home />,
          },
        ],
      },
      {
        name: "Employés",
        collapse: [
          {
            name: "Affectation",
            route: "/magasin/employees/affect",
            component: <EmployeeAffectation />,
          },
        ],
      },
    ],
    key: 4,
  },
  {
    name: "Logout",
    icon: <Logout />,
    route: "/magasin/logout",
    component: <SignOut />,
    key: 5,
  },
];

export default magasin_routes;
