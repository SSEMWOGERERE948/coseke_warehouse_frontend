export default interface IFolder {
  id?: number; // Optional, assuming it may not be set when creating a new folder
  folderName: string; // The name of the folder
  description?: string; // Optional description of the folder
  createdAt?: Date; // Optional creation date
  updatedAt?: Date; // Optional last updated date
}
