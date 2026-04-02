import authorizedAxiosInstance from "../utils/authorizedAxios";
import { API_ROOT } from "../utils/constants";

interface CreatePayoutPayload {
  lecturerId: number;
  payoutAccountId: number;
  amount: number;
  currency?: string;
  payoutMethod?: string;
  transactionId?: number;
}

export const getAllPayoutsAPI = async () => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/lecturer-payouts`,
  );
  return response.data;
};

export const getPayoutsByLecturerIdAPI = async (
  lecturerId: number | string,
  params?: { page?: number; limit?: number; status?: string },
) => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/lecturer-payouts/lecturer/${lecturerId}`,
    { params },
  );
  return response.data;
};

export const createPayoutAPI = async (payload: CreatePayoutPayload) => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/v1/lecturer-payouts`,
    payload,
  );
  return response.data;
};

export const payoutAdminService = {
  getAllPayoutsAPI,
  getPayoutsByLecturerIdAPI,
  createPayoutAPI,
};
