import authorizedAxiosInstance from "../utils/authorizedAxios";
import { API_ROOT } from "../utils/constants";

export interface CreateOrderBody {
  studentId: number;
  paymentMethod?: string;
  couponCode?: string;
  items?: Array<{
    courseId: number;
    quantity: number;
    price: number;
  }>;
}

const createOrderAPI = async (payload: CreateOrderBody) => {
  const res = await authorizedAxiosInstance.post(
    `${API_ROOT}/v1/orders`,
    payload,
  );
  return res.data;
};

export const orderService = {
  createOrderAPI,
};
