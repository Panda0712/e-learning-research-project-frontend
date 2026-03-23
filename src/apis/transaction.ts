import authorizedAxiosInstance from "../utils/authorizedAxios";
import { API_ROOT } from "../utils/constants";

const getAllTransactionsAPI = async () => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/transactions/get-all-transactions`
  );
  return res.data;
};

export const transactionService = {
  getAllTransactionsAPI,
};
