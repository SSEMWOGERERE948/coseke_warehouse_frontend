import { ILoginState } from "../../interfaces/ILoginState";
import { AxiosInstance } from "../../core/baseURL";

export const loginService = async (body: ILoginState) => {
  try {
    const response = await AxiosInstance.post("/auth/authenticate", body);
    return response.data;
  } catch (error) {
    throw error;
  }
};
