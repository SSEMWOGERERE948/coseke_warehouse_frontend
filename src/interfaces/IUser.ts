import IRole from "./IRole";

export default interface IUser {
  permissions: any;
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  profileImage: any;
  headOfDepartment?: string;
  properties: any;
  persona: string;
  role: IRole;
  credentialsNonExpired: boolean;
  accountNonExpired: boolean;
  accountNonLocked: boolean;
}
