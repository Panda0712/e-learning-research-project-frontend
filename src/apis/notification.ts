import authorizedAxiosInstance from '../utils/authorizedAxios';
import { API_ROOT } from '../utils/constants';

const SETTINGS_STORAGE_KEY = 'lecturer_notification_settings';

const defaultSettings = {
  enrollment: true,
  comment: true,
  assignment: true,
  email: true,
  doNotDisturb: false,
};

const readLocalSettings = () => {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return defaultSettings;
    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {
    return defaultSettings;
  }
};

const writeLocalSettings = (data: Record<string, boolean>) => {
  const next = { ...readLocalSettings(), ...data };
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(next));
  return next;
};

const getNotificationSettingsAPI = async () => {
  try {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/users/notification-settings`);
    const payload = response.data?.data || response.data || {};
    const normalized = { ...defaultSettings, ...payload };
    writeLocalSettings(normalized);
    return normalized;
  } catch {
    return readLocalSettings();
  }
};

const updateNotificationSettingAPI = async (data: Record<string, boolean>) => {
  const next = writeLocalSettings(data);
  try {
    const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/users/notification-settings`, data);
    const payload = response.data?.data || response.data || {};
    const normalized = { ...next, ...payload };
    writeLocalSettings(normalized);
    return normalized;
  } catch {
    return next;
  }
};

export const notificationService = {
  getNotificationSettingsAPI,
  updateNotificationSettingAPI
};
