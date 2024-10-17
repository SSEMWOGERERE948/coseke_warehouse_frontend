import { AxiosInstance } from "../../core/baseURL";
import { IRequests } from "../../interfaces/IRequests";

export const createRequest = async (
  requests: IRequests,
): Promise<IRequests> => {
  const response = await AxiosInstance.post<IRequests>("/requests", requests);
  return response.data;
};

export const changeStage = async (
  requestId: number,
  newStage: string,
): Promise<IRequests> => {
  const response = await AxiosInstance.patch<IRequests>(
    `/requests/${requestId}/stage`,
    null,
    {
      params: { newStage },
    },
  );
  return response.data;
};

export const approveRequest = async (requestId: number): Promise<IRequests> => {
  const response = await AxiosInstance.patch<IRequests>(
    `/requests/${requestId}/approve`,
  );
  return response.data;
};

export const getRequestById = async (requestId: number): Promise<IRequests> => {
  const response = await AxiosInstance.get<IRequests>(`/requests/${requestId}`);
  return response.data;
};

export const getAllRequests = async (): Promise<IRequests[]> => {
  const response = await AxiosInstance.get<IRequests[]>("/requests");
  return response.data;
};
