const LOGIN = "/";
const DASHBOARD = "/dashboard";
const ERRORS: string = `${DASHBOARD}/errors`;
const FILES: string = `${DASHBOARD}/files`;
const FOLDERS: string = `${DASHBOARD}/folders`;
const REQUESTS: string = `${DASHBOARD}/tasks/requests`;
const APPROVALS: string = `${DASHBOARD}/tasks/approvals`;
const PROFILE: string = `${DASHBOARD}/users/profile`;
const USERS: string = `${DASHBOARD}/users/users`;
const ROLESANDPERMISSIONS = `${DASHBOARD}/users/roles-and-permissions/:userId`;
const CASE_STUDIES: string = `${DASHBOARD}/case-studies`;
const SETTINGS: string = "/settings";

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
  APPROVALS,
  CASE_STUDIES,
};

export default routes;
