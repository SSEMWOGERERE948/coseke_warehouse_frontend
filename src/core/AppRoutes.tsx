import React from "react";
import { Route, Routes } from "react-router";
import Login from "../pages/Login";
import routes from "./routes";
import Dashboard from "../pages/Dashboard";
import { PrivateRoute } from "./PrivateRoute";
import Files from "../pages/Files";

function AppRoutes() {
  return (
    <Routes>
      <Route path={routes.LOGIN} element={<Login />} />
      <Route path={routes.DASHBOARD} element={<PrivateRoute />}>
        <Route path={routes.DASHBOARD} element={<Dashboard />}>
          <Route path={routes.FILES} element={<PrivateRoute />}>
            <Route path={routes.FILES} element={<Files />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRoutes;
