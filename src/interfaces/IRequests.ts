import IFile from "./IFile";
import IUser from "./IUser";

export interface IRequests {
  id: number;
  stage: string;
  files: IFile;
  user?: IUser;
  createdDate: Date;
  lastModifiedDateTime?: Date;
  lastModifiedBy?: number;
  createdBy: number;
}
