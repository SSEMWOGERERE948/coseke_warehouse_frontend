import { AxiosInstance } from "../../core/baseURL";
import IStorageLocation from "../../interfaces/IStorageLocation";
import { getCurrentUser } from "../../utils/helpers";

// Function to create a storage location
export const createStorageLocation = async (
  storageLocation: IStorageLocation,
  parentId?: number,
) => {
  try {
    const response = await AxiosInstance.post(
      `storage-locations/create`,
      storageLocation,
      { params: { parentId } }, // Pass parentId if provided
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function to get all storage locations
export const getAllStorageLocations = async () => {
  try {
    const response = await AxiosInstance.get(`storage-locations/all`);
    console.log("Fetched storage locations data:", response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function to get a single storage location by ID
export const getStorageLocationById = async (id: number) => {
  try {
    const response = await AxiosInstance.get(`storage-locations/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function to update a storage location
export const updateStorageLocation = async (
  id: number,
  storageLocation: IStorageLocation,
) => {
  try {
    const response = await AxiosInstance.put(
      `storage-locations/${id}`,
      storageLocation,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function to delete a storage location
export const deleteStorageLocation = async (id: number) => {
  try {
    await AxiosInstance.delete(`storage-locations/${id}`);
  } catch (error) {
    throw error;
  }
};

// Function to assign folders to a storage location
export const assignFoldersToStorageLocation = async (
  locationId: number,
  folderIds: number[],
) => {
  try {
    const response = await AxiosInstance.post(
      `storage-locations/assign-folders`,
      folderIds,
      { params: { locationId } },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create a new organization
export const createOrganization = async (organization: { name: string }) => {
  try {
    const response = await AxiosInstance.post(
      "organizations/create",
      organization,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get all organizations
export const getAllOrganizations = async () => {
  try {
    const response = await AxiosInstance.get("organizations/all");
    console.log("Fetched organizations:", response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get a single organization by ID
export const getOrganizationById = async (id: number) => {
  try {
    const response = await AxiosInstance.get(`organizations/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update an organization
export const updateOrganization = async (
  id: number,
  organization: { name: string },
) => {
  try {
    const response = await AxiosInstance.put(
      `organizations/${id}`,
      organization,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete an organization
export const deleteOrganization = async (id: number) => {
  try {
    await AxiosInstance.delete(`organizations/${id}`);
  } catch (error) {
    throw error;
  }
};
