import authorizedAxiosInstance from "../utils/authorizedAxios";
import { API_ROOT } from "../utils/constants";

// Gọi API lấy danh sách học viên của giảng viên
const getMyStudentsAPI = async (lecturerId: number) => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/enrollments/lecturer/${lecturerId}/students`
  );

  return res.data;
};


export const lecturerService = {
  getMyStudentsAPI,
};