import authorizedAxiosInstance from '../utils/authorizedAxios';
import { API_ROOT } from '../utils/constants';

export const instructorAdminAPI = {
  fetchRequests: async () => {
    const res = await authorizedAxiosInstance.get(`${API_ROOT}/v1/admin-instructor-requests`);
    return res.data;
  },
  approve: async (id: number) => {
    const res = await authorizedAxiosInstance.put(`${API_ROOT}/v1/admin-instructor-requests/${id}/approve`);
    return res.data;
  },
  reject: async (id: number) => {
    const res = await authorizedAxiosInstance.put(`${API_ROOT}/v1/admin-instructor-requests/${id}/reject`);
    return res.data;
  }
};