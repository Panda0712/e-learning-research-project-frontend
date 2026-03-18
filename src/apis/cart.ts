import authorizedAxiosInstance from "../utils/authorizedAxios";
import { API_ROOT } from "../utils/constants";

// 1. Lấy giỏ hàng
const getCartByUserId = async (userId: number) => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/cart/get-cart-by-user-id/${userId}`
  );
  return res.data;
};

// 2. Thêm vào giỏ hàng
const addToCart = async (data: { userId: number; courseId: number; price: number }) => {
  const res = await authorizedAxiosInstance.post(
    `${API_ROOT}/v1/cart/add-to-cart`, 
    data
  );
  return res.data;
};

// 3. Xóa item khỏi giỏ hàng
const removeItem = async (itemId: number) => {
  const res = await authorizedAxiosInstance.delete(
    `${API_ROOT}/v1/cart/remove-cart-item/${itemId}`
  );
  return res.data;
};

export const cartService = {
  getCartByUserId,
  addToCart,
  removeItem,
};