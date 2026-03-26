/* eslint-disable @typescript-eslint/no-explicit-any */
import authorizedAxiosInstance from "../utils/authorizedAxios";
import { API_ROOT } from "../utils/constants";

const getHomepageDataAPI = async (params?: {
  popularLimit?: number;
  reviewLimit?: number;
}) => {
  const res = await authorizedAxiosInstance.get(`${API_ROOT}/v1/homepage`, {
    params,
  });
  return {
    ...res.data,
    popularCourses: (res.data.popularCourses || []).map((course: any) => ({
      ...course,
      thumbnail: course.thumbnail ?? course.thumbnailUrl ?? null,
    })),
  };
};

export const homepageService = {
  getHomepageDataAPI,
};
