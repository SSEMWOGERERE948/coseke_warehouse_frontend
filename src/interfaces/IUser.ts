import IRole from "./IRole";

export default interface IUser {
  id: number;
  firstname: string;
  lastname: string;
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
