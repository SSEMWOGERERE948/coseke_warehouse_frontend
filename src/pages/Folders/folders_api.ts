import { AxiosInstance } from "../../core/baseURL";
import IFolder from "../../interfaces/IFolder";
import { getCurrentUser } from "../../utils/helpers";

interface AssignFolderToDepartmentRequest {
  departmentId: number;
  folderIds: number[];
}

export const addFolderService = async (folder: IFolder) => {
  try {
    const response = await AxiosInstance.post("folders/add", folder);
    return response.data;
  } catch (error) {
    throw error;
  }
};

//get folder by id
export const getFolderByIdService = async (id: number) => {
  try {
    const response = await AxiosInstance.get(`folders/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// get all folders
export const getAllFoldersService = async () => {
  try {
    const currentUser = getCurrentUser();
    const id = currentUser?.id;
    const response = await AxiosInstance.get(`folders/all/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

//Update folder
export const updateFolderService = async (
  id: number,
  updatedFolder: IFolder,
) => {
  try {
    const response = await AxiosInstance.put(
      `folders/update/${id}`,
      updatedFolder,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

//update multiple folders
export const updateMultipleFoldersService = async (folders: IFolder[]) => {
  try {
    const response = await AxiosInstance.put(
      "folders/update-multiple",
      folders,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

//Delete folder
export const deleteFolderService = async (id: number) => {
  try {
    const response = await AxiosInstance.delete(`folders/delete/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

//Delete multiple folders
export const deleteMultipleFoldersService = async (ids: number[]) => {
  try {
    const response = await AxiosInstance.delete("folders/delete-multiple", {
      data: ids,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const assignFoldersToDepartmentService = async (
  payload: AssignFolderToDepartmentRequest,
) => {
  try {
    const response = await AxiosInstance.post("/folders/assign", payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};
