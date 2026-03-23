import authorizedAxiosInstance from "../utils/authorizedAxios";
import { API_ROOT } from "../utils/constants";

const getCoursesAPI = async ({ searchPath }: { searchPath: string }) => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/courses${searchPath}`,
  );
  return res.data;
};

const getCourseByIdAPI = async (id: number) => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/courses/get-course-by-id/${id}`,
  );
  return res.data;
};

const getCourseCategoriesAPI = async () => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/courses/categories`,
  );
  return res.data;
};

const getCourseFaqsByCourseIdAPI = async (courseId: number) => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/courses/faq/get-by-course-id/${courseId}`,
  );
  return res.data;
};

const getCoursesByCategoryIdAPI = async (categoryId: number) => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/courses/get-courses-by-category-id/${categoryId}`,
  );
  return res.data;
};

const getModulesByCourseIdAPI = async (courseId: number) => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/modules/get-by-course-id/${courseId}`,
  );
  return res.data;
};

const getLessonsByModuleIdAPI = async (moduleId: number) => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/lessons/get-by-module-id/${moduleId}`,
  );
  return res.data;
};

const getReviewsByCourseIdAPI = async ({
  courseId,
  params,
}: {
  courseId: number;
  params?: { limit?: number; page?: number; itemsPerPage?: number };
}) => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/reviews/by-course/${courseId}`,
    { params },
  );
  return res.data;
};

const getResourceByIdAPI = async (resourceId: number) => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/resources/${resourceId}`,
  );
  return res.data;
};

export const courseService = {
  getCoursesAPI,
  getCourseByIdAPI,
  getCourseCategoriesAPI,
  getCourseFaqsByCourseIdAPI,
  getCoursesByCategoryIdAPI,
  getModulesByCourseIdAPI,
  getLessonsByModuleIdAPI,
  getReviewsByCourseIdAPI,
  getResourceByIdAPI,
};
