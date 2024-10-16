import { AxiosInstance } from "../../core/baseURL";
import ICaseStudy from "../../interfaces/ICaseStudy";
import ICaseStudyRequest from "../../interfaces/ICaseStudyRequest";
import IAssignUserRequest from "../../interfaces/IAssignUserRequest";
// Get all case studies
export const getAllCaseStudiesService = async () => {
  try {
    const response = await AxiosInstance.get("case-studies/all");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get case study by ID
export const getCaseStudyByIdService = async (id: number) => {
  try {
    const response = await AxiosInstance.get(`case-studies/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update case study by ID
export const updateCaseStudyService = async (
  id: number,
  updatedCaseStudy: ICaseStudy,
) => {
  try {
    const response = await AxiosInstance.put(
      `case-studies/update/${id}`,
      updatedCaseStudy,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete case study by ID
export const deleteCaseStudyService = async (id: number) => {
  try {
    const response = await AxiosInstance.delete(`case-studies/delete/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create a new case study
export const createCaseStudyService = async (
  caseStudyRequest: ICaseStudyRequest,
) => {
  try {
    const response = await AxiosInstance.post(
      "case-studies/create-cases",
      caseStudyRequest,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Assign user to case study
export const assignUserToCaseStudyService = async (
  assignUserRequest: IAssignUserRequest,
) => {
  try {
    const response = await AxiosInstance.post(
      "case-studies/assign-user",
      assignUserRequest,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
