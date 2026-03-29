import type {
  AdminUsersQuery,
  AdminUsersResponse,
} from "../types/adminUser.type";
import authorizedAxiosInstance from "../utils/authorizedAxios";
import { API_ROOT } from "../utils/constants";

const getAdminUsersAPI = async ({
  page,
  itemsPerPage,
  role,
}: AdminUsersQuery): Promise<AdminUsersResponse> => {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("itemsPerPage", String(itemsPerPage));
  if (role) {
    params.set("role", role);
  }

  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/users/admin/users?${params.toString()}`,
  );
  return res.data;
};

const getAdminUserDetailAPI = async (id: number) => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/users/admin/users/${id}`,
  );
  return res.data;
};

const blockAdminUserAPI = async ({ id, blocked }: { id: number; blocked: boolean }) => {
  const res = await authorizedAxiosInstance.patch(
    `${API_ROOT}/v1/users/admin/users/${id}/block`,
    { blocked },
  );
  return res.data;
};

const deleteAdminUserAPI = async (id: number) => {
  const res = await authorizedAxiosInstance.delete(
    `${API_ROOT}/v1/users/admin/users/${id}`,
  );
  return res.data;
};

export const adminUserService = {
  getAdminUsersAPI,
  getAdminUserDetailAPI,
  blockAdminUserAPI,
  deleteAdminUserAPI,
};
