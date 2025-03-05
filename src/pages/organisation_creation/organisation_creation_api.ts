import { AxiosInstance } from "../../core/baseURL";
import IOrganisationCreation from "../../interfaces/IOrganisationCreation";
import IAssignUserRequest from "../../interfaces/IAssignUserRequest";
import IOrganisationCreationRequest from "../../interfaces/IOrganisationCreationRequest";
import { Organization } from ".";

// ✅ Get all organizations
export const getAllOrganisationCreationService = async () => {
  try {
    const response = await AxiosInstance.get("organizations/all");
    return response.data || []; // Ensure it always returns an array
  } catch (error) {
    console.error("Error fetching organizations:", error);
    return []; // Return empty array on error
  }
};

// ✅ Get organization by ID
export const getOrganisationCreationByIdService = async (id: number) => {
  try {
    const response = await AxiosInstance.get(`api/organizations/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createOrganization = async (organization: Organization) => {
  try {
    const response = await AxiosInstance.post(
      "api/organizations",
      organization,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateOrganization = async (
  id: number,
  updatedOrganization: Organization,
) => {
  try {
    const response = await AxiosInstance.put(
      `api/organizations/${id}`,
      updatedOrganization,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ✅ Update organization by ID
export const updateOrganisationCreationService = async (
  id: number,
  updatedOrganisationCreation: IOrganisationCreation,
) => {
  try {
    const response = await AxiosInstance.put(
      `api/organizations/${id}`,
      updatedOrganisationCreation,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ✅ Delete organization by ID
export const deleteOrganisationCreationService = async (id: number) => {
  try {
    await AxiosInstance.delete(`api/organizations/${id}`);
  } catch (error) {
    throw error;
  }
};

// ✅ Assign a user to an organization (if applicable)
export const assignUserToOrganisationCreationService = async (
  assignUserRequest: IAssignUserRequest,
) => {
  try {
    const response = await AxiosInstance.post(
      "api/organizations/assign-user",
      assignUserRequest,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ✅ Extend the expiry date of an organization
export const extendOrganisationExpiryService = async (
  id: number,
  newExpiryDate: string,
) => {
  try {
    const response = await AxiosInstance.patch(
      `api/organizations/${id}/extend-expiry?newExpiryDate=${newExpiryDate}`,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
