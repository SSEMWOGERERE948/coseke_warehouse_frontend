import IUser from "./IUser";
import IFolder from "./IFolder";
import ICaseStudy from "./ICaseStudy";

export default interface IFile {
  id?: number; // Optional since it will be generated
  PIDInfant: string;
  PIDMother: string;
  boxNumber: number;
  status: string;
  responsibleUser?: IUser; // User entity relationship
  folder?: IFolder; // Folders entity relationship
  caseStudy?: ICaseStudy; // CaseStudy entity relationship
  createdDate?: string; // LocalDateTime in Java can be mapped to a string in TS
  lastModifiedDateTime?: string;
  lastModifiedBy?: number;
  createdBy: number;
}
