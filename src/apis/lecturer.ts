import authorizedAxiosInstance from "../utils/authorizedAxios";
import { API_ROOT } from "../utils/constants";

// Get list students API endpoint
const getMyStudentsAPI = async (lecturerId: number) => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/enrollments/lecturer/${lecturerId}/students`
  );

  return res.data;
};

export interface LecturerListItem {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  role: string;
  avatar?: {
    fileUrl?: string;
  };
}

export interface LecturerListResponse {
  lecturers: LecturerListItem[];
  totalLecturers: number;
}

interface GetLecturersParams {
  studentId: number;
  page: number;
  itemsPerPage: number;
  q?: string;
}

const getLecturersAPI = async ({
  studentId,
  page,
  itemsPerPage,
  q = "",
}: GetLecturersParams): Promise<LecturerListResponse> => {
  const query = new URLSearchParams({
    page: String(page),
    itemsPerPage: String(itemsPerPage),
    q,
  });

  const res = await authorizedAxiosInstance.get<LecturerListResponse>(
    `${API_ROOT}/v1/courses/list-lecturers-by-student-id/${studentId}?${query.toString()}`,
  );

  return res.data;
};

const getLecturerByIdAPI = async ({
  studentId,
  lecturerId,
}: {
  studentId: number;
  lecturerId: number;
}): Promise<LecturerListItem | null> => {
  const res = await getLecturersAPI({
    studentId,
    page: 1,
    itemsPerPage: 1000,
  });

  return res.lecturers.find((lecturer) => lecturer.id === lecturerId) ?? null;
};

const getCoursesByLecturerIdAPI = async (lecturerId: number) => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/courses/get-courses-by-lecturer-id/${lecturerId}`,
  );

  return res.data;
};


export const lecturerService = {
  getMyStudentsAPI,
  getLecturersAPI,
  getLecturerByIdAPI,
  getCoursesByLecturerIdAPI,
};
