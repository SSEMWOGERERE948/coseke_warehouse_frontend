import IFile from "./IFile";
import IUser from "./IUser";

export interface IRequests {
  id: number; // ✅ Required request ID
  state: string; // ✅ Status (Checked Out, Available, etc.)
  files: IFile; // ✅ Required: The file being requested
  user: IUser; // ✅ Required: Requesting user
  reason?: string; // 📝 Optional reason for request
  checkedOutBy?: number; // 🆕 Stores the user ID of the person who checked out the file
  createdDate?: number[] | Date; // 📅 Date when request was made
  returnDate?: number[] | Date; // 📅 Optional return date
  lastModifiedDateTime?: number[] | Date; // 📅 Last update timestamp
  lastModifiedBy?: number; // 👤 ID of user who last modified the request
  createdBy?: number; // 👤 ID of user who created the request
}
