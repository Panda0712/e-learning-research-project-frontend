import authorizedAxiosInstance from "../utils/authorizedAxios";
import { API_ROOT } from "../utils/constants";

const createPaymentLinkAPI = async (orderId: number) => {
  const res = await authorizedAxiosInstance.post(
    `${API_ROOT}/v1/payos/create-payment`,
    { orderId },
  );
  return res.data;
};

const checkPaymentStatusAPI = async (orderId: number) => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/payos/check-status/${orderId}`,
  );
  return res.data;
};

const cancelPaymentAPI = async (orderId: number) => {
  const res = await authorizedAxiosInstance.put(
    `${API_ROOT}/v1/payos/cancel/${orderId}`,
  );
  return res.data;
};

export const payosService = {
  createPaymentLinkAPI,
  checkPaymentStatusAPI,
  cancelPaymentAPI,
};
