import authorizedAxiosInstance from "../utils/authorizedAxios";
import { API_ROOT } from "../utils/constants";

export interface PublicLecturerItem {
  id: number;
  firstName?: string;
  lastName?: string;
  email: string;
  phoneNumber?: string;
  avatar?: {
    fileUrl?: string;
  };
  lecturerProfile?: {
    professionalTitle?: string;
    nationality?: string;
    bio?: string;
    totalStudents?: number;
    totalCourses?: number;
    avgRating?: number;
  } | null;
}

export interface PublicLecturerListResponse {
  lecturers: PublicLecturerItem[];
  totalLecturers: number;
  pagination: {
    page: number;
    itemsPerPage: number;
    total: number;
    totalPages: number;
  };
}

export interface PublicLecturerDetailResponse extends PublicLecturerItem {
  lecturerProfile?: {
    gender?: string;
    nationality?: string;
    professionalTitle?: string;
    beginStudies?: string;
    highestDegree?: string;
    totalStudents?: number;
    totalCourses?: number;
    avgRating?: number;
    bio?: string;
    lecturerFile?: {
      fileUrl?: string;
      fileType?: string;
    } | null;
  } | null;
  courses?: Array<{
    id: number;
    name: string;
    thumbnail?: {
      fileUrl?: string;
    } | null;
  }>;
}

export interface RegisterLecturerPayload {
  firstName: string;
  lastName: string;
  dateOfBirth: number;
  lecturerFile: {
    publicId: string;
    fileUrl: string;
    fileSize?: number;
    fileType?: string;
  };
  phoneNumber: string;
  gender: "male" | "female" | "other";
  nationality: string;
  professionalTitle: string;
  beginStudies: number;
  highestDegree:
    | "bachelor"
    | "master"
    | "doctoral"
    | "professor"
    | "phd"
    | "associate_professor"
    | "emeritus_professor";
  bio: string;
}

// Get list students API endpoint
const getMyStudentsAPI = async (lecturerId: number) => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/enrollments/lecturer/${lecturerId}/students`,
  );

  return res.data;
};

const getPublicLecturersAPI = async (params: {
  page: number;
  itemsPerPage: number;
  q?: string;
}) => {
  const res = await authorizedAxiosInstance.get(`${API_ROOT}/v1/users/lecturers`, {
    params,
  });
  return res.data as PublicLecturerListResponse;
};

const getPublicLecturerDetailAPI = async (lecturerId: number) => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/users/lecturers/${lecturerId}`,
  );
  return res.data as PublicLecturerDetailResponse;
};

const uploadLecturerFileAPI = async (file: File) => {
  const formData = new FormData();
  formData.append("files", file);

  const res = await authorizedAxiosInstance.post(
    `${API_ROOT}/v1/users/lecturer-file`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  const data = res.data as {
    public_id?: string;
    secure_url?: string;
  };

  return {
    publicId: data.public_id || "",
    fileUrl: data.secure_url || "",
  };
};

const registerLecturerProfileAPI = async (payload: RegisterLecturerPayload) => {
  const res = await authorizedAxiosInstance.post(
    `${API_ROOT}/v1/users/register-lecturer`,
    payload,
  );
  return res.data;
};

export const lecturerService = {
  getMyStudentsAPI,
  getPublicLecturersAPI,
  getPublicLecturerDetailAPI,
  uploadLecturerFileAPI,
  registerLecturerProfileAPI,
};
