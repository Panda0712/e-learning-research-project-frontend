import authorizedAxiosInstance from "../utils/authorizedAxios";
import { API_ROOT } from "../utils/constants";
import type {
  ChangePasswordPayload,
  UpdateProfilePayload,
} from "./../types/user.type";

// handle get my courses API
const getMyCoursesAPI = async (searchPath = "") => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/courses/my-courses${searchPath}`,
  );
  return res.data;
};

// handle get my lecturers API
const getMyLecturersAPI = async (searchPath = "") => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/courses/my-lecturers${searchPath}`,
  );
  return res.data;
};

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

// get user profile data API
const getUserFullProfileAPI = async () => {
  const res = await authorizedAxiosInstance.get(`${API_ROOT}/v1/users/me`);
  return res.data;
};

// Update profile API
const updateProfileAPI = async (data: UpdateProfilePayload) => {
  const res = await authorizedAxiosInstance.put(
    `${API_ROOT}/v1/users/update`,
    data,
  );
  return res.data;
};

// Change password API
const changePasswordAPI = async (data: ChangePasswordPayload) => {
  const res = await authorizedAxiosInstance.put(`${API_ROOT}/v1/users/update`, {
    currentPassword: data.currentPassword,
    newPassword: data.newPassword,
  });
  return res.data;
};

// Upload avatar API
const uploadAvatarAPI = async (formData: FormData) => {
  const res = await authorizedAxiosInstance.post(
    `${API_ROOT}/v1/users/avatar`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return res.data;
};

export const profileService = {
  getMyCoursesAPI,
  getMyLecturersAPI,
  getCoursesByStudentIdAPI,
  getLecturersByStudentIdAPI,
  getUserFullProfileAPI,
  updateProfileAPI,
  changePasswordAPI,
  uploadAvatarAPI,
};
