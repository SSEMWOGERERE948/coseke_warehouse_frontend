export default interface IRole {
  id: number;
  roleName: string;
  permissions: Array<string>;
  activities: any;
  user: any;
  department?: string;
}
