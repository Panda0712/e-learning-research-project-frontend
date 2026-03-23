import authorizedAxiosInstance from "../../utils/authorizedAxios";
import { API_ROOT } from "../../utils/constants";

type CloudinaryUploadResponse = {
  public_id: string;
  secure_url: string;
  bytes?: number;
  format?: string;
  resource_type?: string;
};

export type UploadedResource = {
  publicId: string;
  fileUrl: string;
  fileSize?: number | null;
  fileType?: string | null;
};

export type LecturerCoursePayload = {
  categoryId: number;
  thumbnail: UploadedResource;
  name: string;
  lecturerName: string;
  duration: string;
  level: string;
  overview: string;
  price: number;
  status: "draft" | "pending" | "published" | "rejected";
};

const mapCloudinaryResource = (
  data: CloudinaryUploadResponse,
): UploadedResource => ({
  publicId: data.public_id,
  fileUrl: data.secure_url,
  fileSize: data.bytes ?? null,
  fileType: data.format ?? data.resource_type ?? null,
});

const uploadCourseThumbnailAPI = async (file: File) => {
  const formData = new FormData();
  formData.append("images", file);

  const res = await authorizedAxiosInstance.post(
    `${API_ROOT}/v1/courses/thumbnail`,
    formData,
  );

  return mapCloudinaryResource(res.data as CloudinaryUploadResponse);
};

const createCourseAPI = async (payload: LecturerCoursePayload) => {
  const res = await authorizedAxiosInstance.post(`${API_ROOT}/v1/courses`, payload);
  return res.data;
};

const updateCourseAPI = async (
  id: number,
  payload: Partial<LecturerCoursePayload>,
) => {
  const res = await authorizedAxiosInstance.put(
    `${API_ROOT}/v1/courses/${id}`,
    payload,
  );
  return res.data;
};

const createCourseFaqAPI = async (payload: {
  courseId: number;
  question: string;
  answer: string;
}) => {
  const res = await authorizedAxiosInstance.post(`${API_ROOT}/v1/courses/faq`, payload);
  return res.data;
};

const getCourseCategoriesAPI = async () => {
  const res = await authorizedAxiosInstance.get(`${API_ROOT}/v1/courses/categories`);
  return res.data;
};

const getCoursesByLecturerIdAPI = async (lecturerId: number) => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/courses/get-courses-by-lecturer-id/${lecturerId}`,
  );
  return res.data;
};

export const lecturerCourseService = {
  uploadCourseThumbnailAPI,
  createCourseAPI,
  updateCourseAPI,
  createCourseFaqAPI,
  getCourseCategoriesAPI,
  getCoursesByLecturerIdAPI,
};
