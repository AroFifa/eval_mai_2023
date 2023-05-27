/**
=========================================================
* Material Kit 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-kit-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useEffect } from "react";

// react-router components
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// Material Kit 2 React themes
import theme from "assets/theme";
import Presentation from "layouts/pages/presentation";

// Material Kit 2 React routes
import routes from "routes";
import routesR from "routes/routes";
import magasin_routes from "routes/magasin";
import Signin from "pages/Authentication/Signin";
import point_ventes_routes from "routes/point_ventes";
import Template from "own/Template";
import UpdateLaptop from "pages/Magasin/LapTop/Update";
import UpdateSalespoint from "pages/Magasin/Salespoint/Update";
import Reception from "pages/Magasin/Salespoint/Reception";
import CustomPaginationGrid from "pages/Datagrid/CustomPagination";

export default function App() {
  const { pathname } = useLocation();

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }

      return null;
    });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        {getRoutes(routes)}
        {getRoutes(routesR)}
        {getRoutes(magasin_routes)}
        {getRoutes(point_ventes_routes)}
        <Route path="/signin" element={<Signin />} />
        <Route path="/magasin" element={<Navigate to={"/laptops/save"} />} />
        <Route path="/salespoint" element={<Reception />} />
        <Route path="/" element={<Navigate to="/signin" />} />

        <Route path="/presentation" element={<Presentation />} />
        <Route path="/index" element={<Template />} />
        <Route path="/magasin/laptops/:id" element={<UpdateLaptop />} />
        <Route path="/datagrid/custompagination" element={<CustomPaginationGrid />} />
        <Route path="/magasin/salespoint/:id" element={<UpdateSalespoint />} />
      </Routes>
    </ThemeProvider>
  );
}
