import { AxiosInstance } from "../../core/baseURL";

export const userService = async () => {
  try {
    const response = await AxiosInstance.get("/api/v1/users");
    return response.data; // Return the user data directly
  } catch (error) {
    throw error; // Handle errors appropriately
  }
};
