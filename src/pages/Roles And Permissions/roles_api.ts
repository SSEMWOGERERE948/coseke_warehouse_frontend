import { AxiosInstance } from "../../core/baseURL";
import IDepartment from "../../interfaces/IDepartment";

// Function to create a department
export const createDepartment = async (department: IDepartment) => {
  try {
    const response = await AxiosInstance.post(
      "departments/createDepartment",
      department,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function to get all departments
export const getAllDepartments = async () => {
  try {
    const response = await AxiosInstance.get("departments/");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function to update a department
export const updateDepartment = async (id: number, department: IDepartment) => {
  try {
    const response = await AxiosInstance.put(`departments/${id}`, department);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function to delete a department
export const deleteDepartment = async (id: number) => {
  try {
    await AxiosInstance.delete(`departments/${id}`);
  } catch (error) {
    throw error;
  }
};
