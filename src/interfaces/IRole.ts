export default interface IRole {
  id: number;
  name: string;
  permissions: Array<string>;
  activities: any;
  user: any;
  department?: string;
}
