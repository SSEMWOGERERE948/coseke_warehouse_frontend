import { Navigate, Outlet } from "react-router";
import { isAuthenticated } from "../utils/helpers";
import { getCurrentUser } from "../utils/helpers";
import IUser from "../interfaces/IUser";
import routes from "./routes";

export const permissionList = (): IUser => {
  const currentUser = getCurrentUser();
  return currentUser;
};

export const PrivateRoute = ({ permission }: { permission?: string }) => {
  const permisionsList = permissionList();

  const permissions: string[] = permisionsList?.role?.activities;

  return isAuthenticated() || permission && permissions.indexOf(permission) !== -1 ? (
    <Outlet />
  ) : isAuthenticated() || permission && permissions.indexOf(permission!) === -1 ? (
    <Navigate to={routes.ERRORS} />
  ) : (
    <Navigate to="/" />
  );
};
