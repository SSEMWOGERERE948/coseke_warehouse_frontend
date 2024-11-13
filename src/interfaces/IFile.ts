import IUser from "./IUser";
import IFolder from "./IFolder";
import ICaseStudy from "./ICaseStudy";

export default interface IFile {
  [x: string]: any;
  id?: number;
  pidinfant: string;
  pidmother: string;
  boxNumber: number;
  status: string;
  responsibleUser?: IUser; // User entity relationship
  folder?: IFolder; // Folders entity relationship
  caseStudy?: ICaseStudy; // CaseStudy entity relationship
  createdDate?: number[]; // LocalDateTime in Java can be mapped to a string in TS
  lastModifiedDateTime?: number[];
  lastModifiedBy?: number;
  createdBy: number;
}
