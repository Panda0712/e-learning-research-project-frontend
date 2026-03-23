import authorizedAxiosInstance from "../../utils/authorizedAxios";
import { API_ROOT } from "../../utils/constants";

type CreateModulePayload = {
  courseId: number;
  title: string;
  description: string;
  duration: string;
  totalLessons: number;
};

const createModuleAPI = async (payload: CreateModulePayload) => {
  const res = await authorizedAxiosInstance.post(`${API_ROOT}/v1/modules`, payload);
  return res.data;
};

export const lecturerModuleService = {
  createModuleAPI,
};
