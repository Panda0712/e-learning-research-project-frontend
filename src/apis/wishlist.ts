import authorizedAxiosInstance from "../utils/authorizedAxios";
import { API_ROOT } from "../utils/constants";

const getMyWishlistsAPI = async (page = 1, limit = 10) => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/wishlists/me?page=${page}&limit=${limit}`,
  );
  return res.data;
};

const getWishlistsByUserIdAPI = async (
  userId: number,
  page = 1,
  limit = 10,
) => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/wishlists/user/${userId}?page=${page}&limit=${limit}`,
  );
  return res.data;
};

const checkCourseInMyWishlistAPI = async (courseId: number) => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/wishlists/me/check/${courseId}`,
  );
  return res.data;
};

const removeWishlistItemAPI = async (id: number) => {
  const res = await authorizedAxiosInstance.delete(
    `${API_ROOT}/v1/wishlists/${id}`,
  );
  return res.data;
};

const addToWishlistAPI = async (data: { courseId: number }) => {
  const res = await authorizedAxiosInstance.post(
    `${API_ROOT}/v1/wishlists`,
    data,
  );
  return res.data;
};

const removeWishlistByCourseAPI = async (courseId: number) => {
  const res = await authorizedAxiosInstance.delete(
    `${API_ROOT}/v1/wishlists/me/course/${courseId}`,
  );
  return res.data;
};

export const wishlistService = {
  getMyWishlistsAPI,
  getWishlistsByUserIdAPI,
  removeWishlistItemAPI,
  addToWishlistAPI,
  removeWishlistByCourseAPI,
  checkCourseInMyWishlistAPI,
};
