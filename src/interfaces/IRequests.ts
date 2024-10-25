import IFile from "./IFile";
import IUser from "./IUser";

export interface IRequests {
  id?: number;
  stage?: string;
  state?: string;
  files: IFile;
  user?: IUser;
  reason?: string;
  createdDate?: number[];
  returnDate: number[] | Date;
  lastModifiedDateTime?: number[];
  lastModifiedBy?: number;
  createdBy?: number;
}
