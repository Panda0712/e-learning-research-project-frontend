import authorizedAxiosInstance from "../utils/authorizedAxios";
import { API_ROOT } from "../utils/constants";

export type EnrollmentProgressResponse = {
  id: number;
  studentId: number;
  courseId: number;
  progress: number;
  status: string;
  lastAccessedAt?: string | null;
};

const updateMyProgressAPI = async (payload: {
  courseId: number;
  progress: number;
}): Promise<EnrollmentProgressResponse> => {
  const res = await authorizedAxiosInstance.put(
    `${API_ROOT}/v1/enrollments/my/progress`,
    payload,
  );

  return res.data;
};

const getMyProgressByCourseAPI = async (
  courseId: number,
): Promise<EnrollmentProgressResponse> => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/enrollments/my/course/${courseId}/progress`,
  );

  return res.data;
};

export const enrollmentService = {
  updateMyProgressAPI,
  getMyProgressByCourseAPI,
};
