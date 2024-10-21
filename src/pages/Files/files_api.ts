import { AxiosInstance } from "../../core/baseURL";
import IFile from "../../interfaces/IFile";

// Add a new file
export const addFileService = async (file: IFile): Promise<IFile> => {
  try {
    const response = await AxiosInstance.post<IFile>("files/add", file);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to add file");
  }
};

// Get a file by ID
export const getFileByIdService = async (id: number): Promise<IFile> => {
  try {
    const response = await AxiosInstance.get<IFile>(`files/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || `Failed to fetch file with ID: ${id}`,
    );
  }
};

// Get all files
export const getAllFilesService = async (): Promise<IFile[]> => {
  try {
    const response = await AxiosInstance.get<IFile[]>("files/all");
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch files");
  }
};

// Update a file by ID
export const updateFileService = async (
  id: number,
  updatedFile: IFile,
): Promise<IFile> => {
  try {
    const response = await AxiosInstance.put<IFile>(
      `files/update/${id}`,
      updatedFile,
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || `Failed to update file with ID: ${id}`,
    );
  }
};

// Update multiple files
export const updateMultipleFilesService = async (
  files: IFile[],
): Promise<IFile[]> => {
  try {
    const response = await AxiosInstance.put<IFile[]>(
      "files/update-multiple",
      files,
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to update multiple files",
    );
  }
};

// Delete a file by ID
export const deleteFileService = async (id: number): Promise<void> => {
  try {
    await AxiosInstance.delete(`files/delete/${id}`);
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || `Failed to delete file with ID: ${id}`,
    );
  }
};

// Delete multiple files
export const deleteMultipleFilesService = async (
  ids: number[],
): Promise<void> => {
  try {
    await AxiosInstance.delete("files/delete-multiple", { data: ids });
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to delete multiple files",
    );
  }
};

export const checkInFileService = async (id: number): Promise<void> => {
  try {
    await AxiosInstance.post(`files/${id}/check-in`);
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || `Failed to check in file with ID: ${id}`,
    );
  }
};
