import { Route, Routes } from "react-router";
import Approvals from "../pages/Approvals";
import Dashboard from "../pages/Dashboard";
import Files from "../pages/Files";
import Folders from "../pages/Folders";
import { FileProvider } from "../pages/Folders/FileContext";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import Requests from "../pages/Requests";
import RolesAndPermissions from "../pages/Roles And Permissions";
import Users from "../pages/users";
import { PrivateRoute } from "./PrivateRoute";
import routes from "./routes";

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
      </Routes>
    </FileProvider>
  );
}

export default AppRoutes;
