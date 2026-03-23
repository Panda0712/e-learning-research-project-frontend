import authorizedAxiosInstance from '../utils/authorizedAxios';
import { API_ROOT } from '../utils/constants';

export const getAllPayoutsAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/lecturer-payouts`);
  return response.data;
};