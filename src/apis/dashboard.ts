import type {
  AdminOverviewResponse,
  DashboardChartQuery,
  DashboardChartsResponse,
  LecturerOverviewResponse,
} from "../types/dashboard.type";
import authorizedAxiosInstance from "../utils/authorizedAxios";
import { API_ROOT } from "../utils/constants";

export interface AdminUserListQuery {
  page: number;
  itemsPerPage: number;
  role?: "lecturer" | "student";
}

export interface AdminUserListItem {
  id: number;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  phoneNumber?: string | null;
  dateOfBirth?: string | null;
  role: string;
  isVerified: boolean;
  isBlocked: boolean;
  createdAt: string;
  avatar?: {
    fileUrl?: string;
  } | null;
  totalCourses: number;
  totalEnrollments: number;
  totalTransactions: number;
}

export interface AdminUserListResponse {
  users: AdminUserListItem[];
  totalUsers: number;
  page: number;
  itemsPerPage: number;
  totalPages: number;
}

export interface AdminUserDetailResponse {
  profile: {
    id: number;
    firstName?: string | null;
    lastName?: string | null;
    email: string;
    phoneNumber?: string | null;
    dateOfBirth?: string | null;
    role: string;
    createdAt: string;
    isVerified: boolean;
    isBlocked: boolean;
    avatar?: { fileUrl?: string } | null;
    lecturerProfile?: {
      gender?: string | null;
      nationality?: string | null;
      professionalTitle?: string | null;
      highestDegree?: string | null;
      bio?: string | null;
      isActive?: boolean;
    } | null;
  };
  courses: Array<{
    id: number;
    name: string;
    status?: string | null;
    price?: number | null;
    totalStudents?: number | null;
    createdAt: string;
  }>;
  enrolledCourses: Array<{
    id: number;
    status?: string | null;
    progress?: number | null;
    createdAt: string;
    lastAccessedAt?: string | null;
    course: {
      id: number;
      name: string;
      status?: string | null;
      price?: number | null;
      lecturerName?: string | null;
    };
  }>;
  transactions: Array<{
    id: number;
    amount?: number | null;
    paymentMethod?: string | null;
    status?: string | null;
    gatewayReference?: string | null;
    createdAt: string;
  }>;
}

const getAdminOverviewAPI = async () => {
  const res = await authorizedAxiosInstance.get<AdminOverviewResponse>(
    `${API_ROOT}/v1/dashboard/admin/overview`,
  );
  return res.data;
};

const getAdminChartsAPI = async (params: DashboardChartQuery) => {
  const res = await authorizedAxiosInstance.get<DashboardChartsResponse>(
    `${API_ROOT}/v1/dashboard/admin/charts`,
    { params },
  );
  return res.data;
};

const getLecturerOverviewAPI = async () => {
  const res = await authorizedAxiosInstance.get<LecturerOverviewResponse>(
    `${API_ROOT}/v1/dashboard/lecturer/overview`,
  );
  return res.data;
};

const getLecturerChartsAPI = async (params: DashboardChartQuery) => {
  const res = await authorizedAxiosInstance.get<DashboardChartsResponse>(
    `${API_ROOT}/v1/dashboard/lecturer/charts`,
    { params },
  );
  return res.data;
};

const getAdminUsersAPI = async (params: AdminUserListQuery) => {
  const res = await authorizedAxiosInstance.get<AdminUserListResponse>(
    `${API_ROOT}/v1/users/admin/list`,
    { params },
  );
  return res.data;
};

const getAdminUserDetailAPI = async (userId: number) => {
  const res = await authorizedAxiosInstance.get<AdminUserDetailResponse>(
    `${API_ROOT}/v1/users/admin/${userId}/detail`,
  );
  return res.data;
};

const blockAdminUserAPI = async ({
  userId,
  blocked,
}: {
  userId: number;
  blocked: boolean;
}) => {
  const res = await authorizedAxiosInstance.patch(
    `${API_ROOT}/v1/users/admin/${userId}/block`,
    { blocked },
  );
  return res.data;
};

const deleteAdminUserAPI = async (userId: number) => {
  const res = await authorizedAxiosInstance.delete(
    `${API_ROOT}/v1/users/admin/${userId}`,
  );
  return res.data;
};

export const dashboardService = {
  getAdminOverviewAPI,
  getLecturerOverviewAPI,
  getAdminChartsAPI,
  getLecturerChartsAPI,
  getAdminUsersAPI,
  getAdminUserDetailAPI,
  blockAdminUserAPI,
  deleteAdminUserAPI,
};
