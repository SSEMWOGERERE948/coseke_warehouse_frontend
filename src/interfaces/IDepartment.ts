import { MouseEvent } from "react";
import IUser from "./IUser";

export default interface IDepartment {
  id?: number;
  departmentName: string;
  users?: IUser[];
  createdDate?: number[];
  lastModifiedDateTime?: number[];
  lastModifiedBy?: number;
  createdBy?: number;
}
