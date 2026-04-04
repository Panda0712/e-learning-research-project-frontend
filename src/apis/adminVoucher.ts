import authorizedAxiosInstance from "../utils/authorizedAxios";
import { API_ROOT } from "../utils/constants";

export type VoucherDiscountUnit = "amount" | "percent";
export type VoucherScope = "ALL_COURSES" | "CATEGORY" | "SPECIFIC_COURSE";

export interface VoucherItem {
  id: number;
  name: string;
  code: string;
  scope?: VoucherScope;
  courseId?: number | null;
  scopeCategoryId?: number | null;
  usagePerUser?: number | null;
  course?: { id: number; name?: string | null } | null;
  scopeCategory?: { id: number; name?: string | null } | null;
  description?: string | null;
  status?: string | null;
  categoryId?: number | null;
  discount?: number | null;
  discountUnit?: VoucherDiscountUnit | null;
  usageLimit?: number | null;
  minOrderValue?: number | null;
  maxValue?: number | null;
  amount?: number | null;
  startingDate?: string | null;
  startingTime?: string | null;
  endingDate?: string | null;
  endingTime?: string | null;
  createdAt?: string;
  category?: {
    id: number;
    name: string;
    slug: string;
  } | null;
}

export interface VoucherCategoryItem {
  id: number;
  name: string;
  slug: string;
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export const adminVoucherService = {
  getVouchersAPI: async (params: {
    page: number;
    itemsPerPage: number;
    status?: string;
  }) => {
    const res = await authorizedAxiosInstance.get(`${API_ROOT}/v1/coupons`, {
      params: {
        page: params.page,
        itemsPerPage: params.itemsPerPage,
        ...(params.status ? { status: params.status } : {}),
      },
    });
    return res.data as {
      data: VoucherItem[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    };
  },

  createVoucherAPI: async (payload: {
    name: string;
    discount: number;
    discountUnit: VoucherDiscountUnit;
    code: string;
    scope?: VoucherScope;
    courseId?: number;
    scopeCategoryId?: number;
    usageLimit: number;
    usagePerUser?: number;
    minOrderValue: number;
    description: string;
    status: "active" | "inactive" | "scheduled" | "expired";
    maxValue: number;
    startingDate?: string;
    startingTime?: string;
    categoryId?: number;
    endingDate?: string;
    endingTime?: string;
  }) => {
    const res = await authorizedAxiosInstance.post(`${API_ROOT}/v1/coupons`, payload);
    return res.data;
  },

  updateVoucherAPI: async (
    id: number,
    payload: Partial<{
      name: string;
      discount: number;
      discountUnit: VoucherDiscountUnit;
      code: string;
      scope: VoucherScope;
      courseId: number;
      scopeCategoryId: number;
      usageLimit: number;
      usagePerUser: number;
      minOrderValue: number;
      description: string;
      status: "active" | "inactive" | "scheduled" | "expired";
      maxValue: number;
      startingDate?: string;
      startingTime?: string;
      categoryId?: number;
      endingDate?: string;
      endingTime?: string;
    }>,
  ) => {
    const res = await authorizedAxiosInstance.put(`${API_ROOT}/v1/coupons/${id}`, payload);
    return res.data;
  },

  deleteVoucherAPI: async (id: number) => {
    const res = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/coupons/${id}`);
    return res.data;
  },

  getVoucherCategoriesAPI: async () => {
    const res = await authorizedAxiosInstance.get(`${API_ROOT}/v1/coupons/categories`);
    return (res.data ?? []) as VoucherCategoryItem[];
  },

  createVoucherCategoryAPI: async (payload: { name: string; slug?: string }) => {
    const res = await authorizedAxiosInstance.post(`${API_ROOT}/v1/coupons/categories`, {
      name: payload.name,
      slug: payload.slug || slugify(payload.name),
    });
    return res.data;
  },

  updateVoucherCategoryAPI: async (
    id: number,
    payload: { name?: string; slug?: string },
  ) => {
    const res = await authorizedAxiosInstance.put(`${API_ROOT}/v1/coupons/categories/${id}`, {
      ...payload,
      ...(payload.name && !payload.slug ? { slug: slugify(payload.name) } : {}),
    });
    return res.data;
  },

  deleteVoucherCategoryAPI: async (id: number) => {
    const res = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/coupons/categories/${id}`);
    return res.data;
  },
};
