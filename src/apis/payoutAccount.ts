import authorizedAxiosInstance from '../utils/authorizedAxios';
import { API_ROOT } from '../utils/constants';

interface CreateAccountPayload {
  lecturerId: string | number;
  cardType?: string;
  cardNumber: string;
  cardExpireDate?: Date;
  cardCVV?: number;
  cardHolderName?: string;
  isDefault?: boolean;
}

const getAccountsAPI = async (lecturerId: number | string) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/lecturer-payout-accounts/lecturer/${lecturerId}`);
  return response.data;
};

const createAccountAPI = async (data: CreateAccountPayload) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/lecturer-payout-accounts`, data);
  return response.data;
};

const setDefaultAccountAPI = async (
  id: number | string,
  lecturerId: number | string,
) => {
  const response = await authorizedAxiosInstance.put(
    `${API_ROOT}/v1/lecturer-payout-accounts/${id}/default`,
    { lecturerId },
  );
  return response.data;
};

const deleteAccountAPI = async (id: number | string) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/lecturer-payout-accounts/${id}`);
  return response.data;
};

export const payoutAccountService = {
  getAccountsAPI,
  createAccountAPI,
  setDefaultAccountAPI,
  deleteAccountAPI
};
