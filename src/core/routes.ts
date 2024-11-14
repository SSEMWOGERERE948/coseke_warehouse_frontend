const LOGIN = "/";
const DASHBOARD = "/dashboard";
const ERRORS: string = `${DASHBOARD}/errors`;
const FILES: string = `${DASHBOARD}/files`;
const FOLDERS: string = `${DASHBOARD}/folders`;
const REQUESTS: string = `${DASHBOARD}/tasks/requests`;
const MYREQUESTS: string = `${DASHBOARD}/tasks/my-requests`;
const PROFILE: string = `${DASHBOARD}/users/profile`;
const USERS: string = `${DASHBOARD}/users/users`;
const ROLESANDPERMISSIONS = `${DASHBOARD}/users/roles-and-permissions/:userId`;
const CASE_STUDIES: string = `${DASHBOARD}/case-studies`;
const ROLES: string = `${DASHBOARD}/roles/:id`;
const SETTINGS: string = "/settings";
const PI: string = `${DASHBOARD}/pi`;
const APPROVED: string = `${DASHBOARD}/tasks/approved`;
const REJECTED: string = `${DASHBOARD}/tasks/rejected`;
const FORGOT_PASSWORD: string = "/forgot-password";
const RESET_PASSWORD: string = "/reset-password";

const routes = {
  LOGIN,
  DASHBOARD,
  PROFILE,
  FILES,
  FOLDERS,
  ERRORS,
  REQUESTS,
  ROLESANDPERMISSIONS,
  USERS,
  SETTINGS,
  MYREQUESTS,
  CASE_STUDIES,
  ROLES,
  PI,
  APPROVED,
  REJECTED,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
};

export default routes;
