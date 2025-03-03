import IRole from "./IRole";

export default interface IUser {
  organizationId: any;
  permissions: any;
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  phone: string;
  password: string;
  profileImage: any;
  headOfDepartment?: string;
  properties: any;
  persona: string;
  roles: IRole[];
  credentialsNonExpired: boolean;
  accountNonExpired: boolean;
  accountNonLocked: boolean;
}
