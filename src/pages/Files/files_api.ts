import { AxiosInstance } from "../../core/baseURL";
import IFile from "../../interfaces/IFile";

// Add a new file
export const addFileService = async (file: IFile) => {
  try {
    const response = await AxiosInstance.post("files/add", file);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get a file by ID
export const getFileByIdService = async (id: number) => {
  try {
    const response = await AxiosInstance.get(`files/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get all files
export const getAllFilesService = async () => {
  try {
    const response = await AxiosInstance.get("files/all");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update a file by ID
export const updateFileService = async (id: number, updatedFile: IFile) => {
  try {
    const response = await AxiosInstance.put(`files/update/${id}`, updatedFile);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update multiple files
export const updateMultipleFilesService = async (files: IFile[]) => {
  try {
    const response = await AxiosInstance.put("files/update-multiple", files);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete a file by ID
export const deleteFileService = async (id: number) => {
  try {
    const response = await AxiosInstance.delete(`files/delete/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete multiple files
export const deleteMultipleFilesService = async (ids: number[]) => {
  try {
    const response = await AxiosInstance.delete("files/delete-multiple", {
      data: ids,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
