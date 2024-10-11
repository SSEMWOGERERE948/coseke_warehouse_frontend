import { AxiosInstance } from "../../core/baseURL";
import IFile from "../../interfaces/IFile";

// Add a new file
export const addFileService = async (file: IFile) => {
  try {
    const response = await AxiosInstance.post("/api/v1/files/add", file);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get a file by ID
export const getFileByIdService = async (id: number) => {
  try {
    const response = await AxiosInstance.get(`/api/v1/files/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get all files
export const getAllFilesService = async () => {
  try {
    const response = await AxiosInstance.get("/api/v1/files/all");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update a file by ID
export const updateFileService = async (id: number, updatedFile: IFile) => {
  try {
    const response = await AxiosInstance.put(
      `/api/v1/files/update/${id}`,
      updatedFile,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update multiple files
export const updateMultipleFilesService = async (files: IFile[]) => {
  try {
    const response = await AxiosInstance.put(
      "/api/v1/files/update-multiple",
      files,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete a file by ID
export const deleteFileService = async (id: number) => {
  try {
    const response = await AxiosInstance.delete(`/api/v1/files/delete/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete multiple files
export const deleteMultipleFilesService = async (ids: number[]) => {
  try {
    const response = await AxiosInstance.delete(
      "/api/v1/files/delete-multiple",
      { data: ids },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
