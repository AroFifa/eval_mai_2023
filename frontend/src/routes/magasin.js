import { Laptop, Logout, Category, Store, Dashboard } from "@mui/icons-material";
import SignOut from "pages/Authentication/Signout";
import SaveLaptop from "pages/Magasin/LapTop/Save";
import ListLaptop from "pages/Magasin/LapTop/List";
import EmployeeAffectation from "pages/Magasin/Salespoint/EmployeeAffectation";
import Purchase from "pages/Magasin/LapTop/Purchase";
import Transfert from "pages/Magasin/LapTop/Transfert";
import ListSalespoint from "pages/Magasin/Salespoint/List";
import SaveSalespoint from "pages/Magasin/Salespoint/Save";
import Reception from "pages/Magasin/Salespoint/Reception";
import Global from "pages/Magasin/Stats/Global";
import Profit from "pages/Magasin/Stats/Profit";
import StatsStore from "pages/Magasin/Stats/Store";
import SaveCpu from "pages/Magasin/Model/SaveCpu";
import SaveBrand from "pages/Magasin/Model/SaveBrand";
import SaveModel from "pages/Magasin/Model/SaveModel";
import Commission from "pages/Magasin/Stats/Commission";
import StoreCommission from "pages/Magasin/Stats/StoreCommission";

const magasin_routes = [
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
            component: <Purchase />,
          },
        ],
      },
      {
        name: "Transfert",
        collapse: [
          {
            name: "Transfert",
            route: "/magasin/laptops/transfer",
            component: <Transfert />,
          },
          {
            name: "Réception",
            route: "/magasin/laptops/reception",
            component: <Reception />,
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
            component: <SaveModel />,
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
            component: <SaveBrand />,
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
            component: <SaveCpu />,
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
            component: <SaveSalespoint />,
          },
          {
            name: "Listes",
            route: "/magasin/stores/list",
            component: <ListSalespoint />,
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
    name: "Statistique",
    icon: <Dashboard />,
    columns: 1,
    rowsPerColumn: 2,
    collapse: [
      {
        name: "Total des ventes par mois",
        collapse: [
          {
            name: "Global",
            route: "/magasin/stats/global",
            component: <Global />,
          },
          {
            name: "Par point de ventes",
            route: "/magasin/stats/sstore",
            component: <StatsStore />,
          },
        ],
      },
      {
        name: "Commission",
        collapse: [
          {
            name: "Bénéfice mensuel",
            route: "/magasin/stats/profit",
            component: <Profit />,
          },
          {
            name: "Par point de vente",
            route: "/magasin/commissions/store",
            component: <StoreCommission />,
          },
          {
            name: "Palier",
            route: "/magasin/commissions/level",
            component: <Commission />,
          },
        ],
      },
    ],
    key: 6,
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
