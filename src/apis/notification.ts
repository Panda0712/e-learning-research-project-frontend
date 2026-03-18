import authorizedAxiosInstance from '../utils/authorizedAxios';
import { API_ROOT } from '../utils/constants';

const getNotificationSettingsAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/users/notification-settings`);// nhớ sửa lại đường dẫn
  return response.data;
};

const updateNotificationSettingAPI = async (data: Record<string, boolean>) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/users/notification-settings`, data);// nhớ sửa lại đường dẫn
  return response.data;
};

export const notificationService = {
  getNotificationSettingsAPI,
  updateNotificationSettingAPI
};