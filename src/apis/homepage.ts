import authorizedAxiosInstance from "../utils/authorizedAxios";
import { API_ROOT } from "../utils/constants";

const getHomepageDataAPI = async (params?: {
  popularLimit?: number;
  reviewLimit?: number;
}) => {
  const res = await authorizedAxiosInstance.get(`${API_ROOT}/v1/homepage`, {
    params,
  });
  return res.data;
};

export const homepageService = {
  getHomepageDataAPI,
};
