import React from "react";
import { Route, Routes } from "react-router";
import Login from "../pages/Login";
import routes from "./routes";
import Dashboard from "../pages/Dashboard";
import { PrivateRoute } from "./PrivateRoute";
import Files from "../pages/Files";
import Folders from "../pages/Folders";
import Approvals from "../pages/Approvals";
import Requests from "../pages/Requests";
import Profile from "../pages/profile";
import Users from "../pages/users";
import RolesAndPermissions from "../pages/Roles And Permissions";
import CaseStudies from "../pages/case_studies";
import { FileProvider } from "../pages/Folders/FileContext";
import UserRoles from "../pages/roles";

function AppRoutes() {
  return (
    <FileProvider>
      <Routes>
        <Route path={routes.LOGIN} element={<Login />} />
        <Route path={routes.DASHBOARD} element={<PrivateRoute />}>
          <Route path={routes.DASHBOARD} element={<Dashboard />}>
            <Route path={routes.FILES} element={<PrivateRoute />}>
              <Route path={routes.FILES} element={<Files />} />
            </Route>
            <Route path={routes.FOLDERS} element={<PrivateRoute />}>
              <Route path={routes.FOLDERS} element={<Folders />} />
            </Route>
            <Route path={routes.APPROVALS} element={<PrivateRoute />}>
              <Route path={routes.APPROVALS} element={<Approvals />} />
            </Route>
            <Route path={routes.REQUESTS} element={<PrivateRoute />}>
              <Route path={routes.REQUESTS} element={<Requests />} />
            </Route>
            <Route path={routes.PROFILE} element={<PrivateRoute />}>
              <Route path={routes.PROFILE} element={<Profile />} />
            </Route>
            <Route path={routes.USERS} element={<PrivateRoute />}>
              <Route path={routes.USERS} element={<Users />} />
            </Route>
            <Route
              path={`${routes.ROLESANDPERMISSIONS}`}
              element={<PrivateRoute />}
            >
              <Route
                path={`${routes.ROLESANDPERMISSIONS}`}
                element={<RolesAndPermissions />}
              />
            </Route>
          </Route>
        </Route>
        <Route
          path="/roles-and-permissions/:userId"
          element={<RolesAndPermissions />}
        />
        <Route path={routes.CASE_STUDIES} element={<PrivateRoute />}>
          <Route path={routes.CASE_STUDIES} element={<CaseStudies />} />
        </Route>
        <Route path="/case-studies" element={<CaseStudies />} />

        <Route path="/roles/:id" element={<UserRoles />} />

        <Route path={routes.ROLES} element={<PrivateRoute />}>
          <Route path={routes.ROLES} element={<UserRoles />} />
        </Route>
      </Routes>
    </FileProvider>
  );
}

export default AppRoutes;
