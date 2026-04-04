/* eslint-disable @typescript-eslint/no-explicit-any */
import authorizedAxiosInstance from "../../utils/authorizedAxios";
import { API_ROOT } from "../../utils/constants";

export type CouponStatus = "active" | "expired" | "scheduled";

const toPositiveInt = (value: unknown): number | null => {
  const parsed = Number(value);
  if (Number.isInteger(parsed) && parsed > 0) return parsed;
  return null;
};

const resolveCourseId = (): number | null => {
  try {
    const params = new URLSearchParams(window.location.search);
    const courseIdFromQuery = toPositiveInt(params.get("courseId"));
    if (courseIdFromQuery) return courseIdFromQuery;

    const raw = localStorage.getItem("lecturerCreateCourseContext");
    const parsed = raw ? (JSON.parse(raw) as { courseId?: number }) : {};
    const courseIdFromContext = toPositiveInt(parsed.courseId);
    if (courseIdFromContext) return courseIdFromContext;

    const courseIdFromStorage = toPositiveInt(
      localStorage.getItem("lecturerCreatedCourseId"),
    );
    if (courseIdFromStorage) return courseIdFromStorage;
  } catch {
    return null;
  }

  return null;
};

const requireCourseId = (): number => {
  const courseId = resolveCourseId();
  if (!courseId) {
    throw new Error("Missing courseId. Please save course details first.");
  }
  return courseId;
};

const getCouponsByCourseAPI = async (params?: {
  page?: number;
  limit?: number;
  status?: CouponStatus | "all";
}) => {
  const courseId = requireCourseId();
  const res = await authorizedAxiosInstance.get(`${API_ROOT}/v1/coupons`, {
    params: { ...params, courseId },
  });
  return res.data;
};

const createCouponByCourseAPI = async (payload: {
  name: string;
  description: string;
  status: CouponStatus;
  customerGroup?: string;
  code: string;
  categoryId?: number;
  quantity?: number;
  usesPerCustomer?: number;
  priority?: string;
  actions?: string;
  type: "fixed" | "percentage";
  amount: number;
  startingDate?: string;
  startingTime?: string;
  endingDate?: string;
  endingTime?: string;
  isUnlimited?: boolean;
}) => {
  const courseId = requireCourseId();
  const res = await authorizedAxiosInstance.post(`${API_ROOT}/v1/coupons`, {
    ...payload,
    courseId,
  });
  return res.data;
};

const updateCouponAPI = async (couponId: number, payload: any) => {
  const res = await authorizedAxiosInstance.put(
    `${API_ROOT}/v1/coupons/${couponId}`,
    payload,
  );
  return res.data;
};

const getReviewsByCourseAPI = async (params?: {
  page?: number;
  limit?: number;
  rating?: number;
}) => {
  const courseId = requireCourseId();
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/course-reviews/course/${courseId}`,
    { params },
  );
  return res.data;
};

const getCustomersByCourseForLecturerAPI = async (
  lecturerId: number,
  params?: {
    page?: number;
    limit?: number;
    q?: string;
  },
) => {
  const courseId = requireCourseId();
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/enrollments/lecturer/${lecturerId}/course/${courseId}/students`,
    { params },
  );
  return res.data;
};

const getCommissionsByCourseForLecturerAPI = async (
  lecturerId: number,
  params?: {
    page?: number;
    limit?: number;
    q?: string;
    period?: string;
  },
) => {
  const courseId = requireCourseId();
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/order-items/lecturer/${lecturerId}/course/${courseId}/commissions`,
    { params },
  );
  return res.data;
};

const getCourseCustomersAPI = async (
  courseId: number,
  params?: {
    page?: number;
    itemsPerPage?: number;
    q?: string;
  },
) => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/dashboard/lecturer/courses/${courseId}/customers`,
    { params },
  );
  return res.data;
};

const getCourseCommissionsAPI = async (
  courseId: number,
  params?: {
    page?: number;
    itemsPerPage?: number;
    q?: string;
    period?: "all" | "last-month" | "this-month" | "this-year";
  },
) => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/dashboard/lecturer/courses/${courseId}/commissions`,
    { params },
  );
  return res.data;
};

const getCourseReviewsAPI = async (
  courseId: number,
  params?: { page?: number; itemsPerPage?: number; rating?: number },
) => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/dashboard/lecturer/courses/${courseId}/reviews`,
    { params },
  );
  return res.data;
};

const getCourseCouponsAPI = async (
  courseId: number,
  params?: { page?: number; itemsPerPage?: number; status?: string },
) => {
  const res = await authorizedAxiosInstance.get(`${API_ROOT}/v1/coupons`, {
    params: { ...params, courseId },
  });
  return res.data;
};

const createCourseCouponAPI = async (payload: any) => {
  const res = await authorizedAxiosInstance.post(
    `${API_ROOT}/v1/coupons`,
    payload,
  );
  return res.data;
};

const updateCourseCouponAPI = async (id: number, payload: any) => {
  const res = await authorizedAxiosInstance.put(
    `${API_ROOT}/v1/coupons/${id}`,
    payload,
  );
  return res.data;
};

export const lecturerCourseInsightsService = {
  getCourseCustomersAPI,
  getCourseCommissionsAPI,
  getCourseReviewsAPI,
  getCourseCouponsAPI,
  createCourseCouponAPI,
  updateCourseCouponAPI,

  getCouponsByCourseAPI,
  createCouponByCourseAPI,
  updateCouponAPI,
  getReviewsByCourseAPI,
  getCustomersByCourseForLecturerAPI,
  getCommissionsByCourseForLecturerAPI,
};
