import type {
  AdminOverviewResponse,
  DashboardChartQuery,
  DashboardChartsResponse,
  LecturerOverviewResponse,
} from "../types/dashboard.type";
import authorizedAxiosInstance from "../utils/authorizedAxios";
import { API_ROOT } from "../utils/constants";

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

export const dashboardService = {
  getAdminOverviewAPI,
  getLecturerOverviewAPI,
  getAdminChartsAPI,
  getLecturerChartsAPI,
};
