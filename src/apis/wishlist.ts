import authorizedAxiosInstance from "../utils/authorizedAxios";
import { API_ROOT } from "../utils/constants";


const getWishlistsByUserIdAPI = async (userId: number, page = 1, limit = 10) => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/wishlist/user/${userId}?page=${page}&limit=${limit}`
  );
  return res.data;
};

// Xóa khỏi Wishlist
const removeWishlistItemAPI = async (id: number) => {
  const res = await authorizedAxiosInstance.delete(
    `${API_ROOT}/v1/wishlist/${id}`
  );
  return res.data;
};

const addToWishlistAPI = async (data: { userId: number; courseId: number }) => {
  const res = await authorizedAxiosInstance.post(`${API_ROOT}/v1/wishlist`, data);
  return res.data;
};

export const wishlistService = {
  getWishlistsByUserIdAPI,
  removeWishlistItemAPI,
  addToWishlistAPI,
};