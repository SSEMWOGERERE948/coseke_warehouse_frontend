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
  const response = await AxiosInstance.put<IRequests>(
    `/requests/${requestId}/stage`,
    null,
    {
      params: { newStage },
    },
  );
  return response.data;
};

export const approveRequest = async (requestId: number): Promise<IRequests> => {
  const response = await AxiosInstance.put<IRequests>(
    `/requests/${requestId}/approve`,
  );
  return response.data;
};

export const rejectRequest = async (
  requestId: number,
  reason: string,
): Promise<IRequests> => {
  const response = await AxiosInstance.put<IRequests>(
    `/requests/${requestId}/reject`,
    null,
    { params: { reason } },
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

export const getRequestsService = async (isAdmin: boolean) => {
  try {
    const response = await AxiosInstance.get(
      `/files/requests?isAdmin=${isAdmin}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching requests:", error);
    throw error;
  }
};

export const approveRequestService = async (requestId: number) => {
  try {
    const response = await AxiosInstance.post(`/files/${requestId}/approve`);
    console.log(`✅ Request ${requestId} approved:`, response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      `❌ Error approving request ${requestId}:`,
      error.response?.data || error.message,
    );
    throw new Error(
      error.response?.data?.message || `Failed to approve request ${requestId}`,
    );
  }
};
