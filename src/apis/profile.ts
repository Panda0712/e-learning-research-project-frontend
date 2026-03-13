import authorizedAxiosInstance from "../utils/authorizedAxios";
import { API_ROOT } from "../utils/constants";

// handle get list courses by studentId
const getCoursesByStudentIdAPI = async ({
  studentId,
  searchPath,
}: {
  studentId: number;
  searchPath: string;
}) => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/courses/get-courses-by-student-id/${studentId}${searchPath}`,
  );
  return res.data;
};

// handle get list lecturers by studentId
const getLecturersByStudentIdAPI = async ({
  studentId,
  searchPath,
}: {
  studentId: number;
  searchPath: string;
}) => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/courses/list-lecturers-by-student-id/${studentId}${searchPath}`,
  );
  return res.data;
};

export const profileService = {
  getCoursesByStudentIdAPI,
  getLecturersByStudentIdAPI,
};
