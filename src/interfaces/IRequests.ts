import IFile from "./IFile";
import IUser from "./IUser";

export interface IRequests {
  id?: number;
  stage?: string;
  files: IFile;
  user?: IUser;
  createdDate?: number[];
  returnDate: Date;
  lastModifiedDateTime?: number[];
  lastModifiedBy?: number;
  createdBy?: number;
}
