import authorizedAxiosInstance from "../utils/authorizedAxios";
import { API_ROOT } from "../utils/constants";

export interface CouponPreviewPayload {
  code: string;
  courseIds: number[];
}

export interface CouponPreviewResponse {
  couponCode: string;
  discountAmount: number;
  originalTotal: number;
  finalTotal: number;
  eligibleCourseIds: number[];
  coupon?: {
    name?: string;
    discountUnit?: string;
    discount?: number;
  };
}

export interface CouponListItem {
  id: number;
  name: string;
  code: string;
  status?: "active" | "inactive" | "scheduled" | "expired";
  scope?: "ALL_COURSES" | "CATEGORY" | "SPECIFIC_COURSE";
  courseId?: number | null;
  scopeCategoryId?: number | null;
  discount?: number | null;
  discountUnit?: "amount" | "percent" | null;
  amount?: number | null;
  minOrderValue?: number | null;
  maxValue?: number | null;
  usageLimit?: number | null;
  usedCount?: number | null;
  remainingUsages?: number | null;
  usagePerUser?: number | null;
  startingDate?: string | null;
  endingDate?: string | null;
}

export interface CouponListResponse {
  data: CouponListItem[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const previewCouponAPI = async (payload: CouponPreviewPayload) => {
  const res = await authorizedAxiosInstance.post(
    `${API_ROOT}/v1/coupons/preview`,
    payload,
  );
  return res.data as CouponPreviewResponse;
};

const getCouponsAPI = async (params?: {
  page?: number;
  itemsPerPage?: number;
  status?: "all" | "active" | "inactive" | "scheduled" | "expired";
}) => {
  const res = await authorizedAxiosInstance.get(`${API_ROOT}/v1/coupons`, {
    params,
  });
  return res.data as CouponListResponse;
};

export const couponService = {
  previewCouponAPI,
  getCouponsAPI,
};
