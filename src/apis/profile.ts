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

// lấy thông tin chi tiết
const getUserFullProfileAPI = async () => {
  const res = await authorizedAxiosInstance.get(`${API_ROOT}/v1/users/me`);
  return res.data;
};

interface UserUpdatePayload {
  name: string;
  email: string;
  location?: string;
  phone?: string;
  bio?: string;
}

// Cập nhật thông tin 
const updateProfileAPI = async (data: UserUpdatePayload) => {
  const res = await authorizedAxiosInstance.put(`${API_ROOT}/v1/users/update`, data);
  return res.data;
};
//thay doi mat khau
const changePasswordAPI = async (data: Record<string, string>) => {
  const res = await authorizedAxiosInstance.put(`${API_ROOT}/v1/users/change-password`, data);
  return res.data;
};

// Up ảnh Avatar (Dùng FormData)
const uploadAvatarAPI = async (formData: FormData) => {
  const res = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/avatar`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return res.data;
};

export const profileService = {
  getCoursesByStudentIdAPI,
  getLecturersByStudentIdAPI,
  getUserFullProfileAPI,
  updateProfileAPI,
  changePasswordAPI, 
  uploadAvatarAPI    
};