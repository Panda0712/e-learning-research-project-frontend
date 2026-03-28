import authorizedAxiosInstance from "../utils/authorizedAxios";
import { API_ROOT } from "../utils/constants";

// Get list students API endpoint
const getMyStudentsAPI = async (lecturerId: number) => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/enrollments/lecturer/${lecturerId}/students`
  );

  return res.data;
};

export const lecturerService = {
  getMyStudentsAPI,
};
