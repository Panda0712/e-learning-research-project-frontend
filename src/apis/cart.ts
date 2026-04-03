import authorizedAxiosInstance from "../utils/authorizedAxios";
import { API_ROOT } from "../utils/constants";

const getCartByUserId = async (userId: number) => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/carts/get-cart-by-user-id/${userId}`,
  );
  return res.data;
};

const addToCart = async (data: {
  userId: number;
  courseId: number;
  price: number;
}) => {
  const res = await authorizedAxiosInstance.post(
    `${API_ROOT}/v1/carts/add-to-cart`,
    data,
  );
  return res.data;
};

const removeItem = async (itemId: number) => {
  const res = await authorizedAxiosInstance.delete(
    `${API_ROOT}/v1/carts/remove-cart-item/${itemId}`,
  );
  return res.data;
};

export const cartService = {
  getCartByUserId,
  addToCart,
  removeItem,
};
