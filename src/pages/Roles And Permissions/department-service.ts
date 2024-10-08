import { AxiosInstance } from "../../core/baseURL";

export interface Department {
  id?: number;
  name: string;
  addedDate?: string;
  modifiedDate?: string;
}

export const departmentService = {
  createDepartment: async (department: Department) => {
    try {
      const response = await AxiosInstance.post(
        "departments/createDepartment",
        department,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAllDepartments: async () => {
    try {
      const response = await AxiosInstance.get("departments/");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateDepartment: async (id: number, department: Department) => {
    try {
      const response = await AxiosInstance.put(`departments/${id}`, department);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteDepartment: async (id: number) => {
    try {
      await AxiosInstance.delete(`departments/${id}`);
    } catch (error) {
      throw error;
    }
  },
};
