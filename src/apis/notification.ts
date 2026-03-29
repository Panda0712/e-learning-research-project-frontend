import authorizedAxiosInstance from "../utils/authorizedAxios";
import { API_ROOT } from "../utils/constants";

export type NotificationItem = {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: string;
  relatedId?: number | null;
  isRead: boolean;
  createdAt: string;
};

type NotificationListResponse = {
  data: NotificationItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

const getNotificationSettingsAPI = async () => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/users/notification-settings`,
  );
  return response.data;
};

const updateNotificationSettingAPI = async (data: Record<string, boolean>) => {
  const response = await authorizedAxiosInstance.put(
    `${API_ROOT}/v1/users/notification-settings`,
    data,
  );
  return response.data;
};

const getNotificationsByUserIdAPI = async (
  userId: number,
  params?: {
    page?: number;
    limit?: number;
    isRead?: boolean;
  },
): Promise<NotificationListResponse> => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/notifications/user/${userId}`,
    { params },
  );
  return response.data;
};

const getUnreadCountAPI = async (
  userId: number,
): Promise<{ unreadCount: number }> => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/notifications/user/${userId}/unread-count`,
  );
  return response.data;
};

const markAsReadAPI = async (
  notificationId: number,
): Promise<NotificationItem> => {
  const response = await authorizedAxiosInstance.put(
    `${API_ROOT}/v1/notifications/${notificationId}/read`,
  );
  return response.data;
};

const markAllAsReadAPI = async (
  userId: number,
): Promise<{ message: string; count: number }> => {
  const response = await authorizedAxiosInstance.put(
    `${API_ROOT}/v1/notifications/user/${userId}/mark-all-read`,
  );
  return response.data;
};

export const notificationService = {
  getNotificationSettingsAPI,
  updateNotificationSettingAPI,
  getNotificationsByUserIdAPI,
  getUnreadCountAPI,
  markAsReadAPI,
  markAllAsReadAPI,
};
