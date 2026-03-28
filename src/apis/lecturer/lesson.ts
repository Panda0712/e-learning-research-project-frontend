import authorizedAxiosInstance from "../../utils/authorizedAxios";
import { API_ROOT } from "../../utils/constants";
import type { UploadedResource } from "./course";

type CloudinaryUploadResponse = {
  public_id: string;
  secure_url: string;
  bytes?: number;
  format?: string;
  resource_type?: string;
};

const mapCloudinaryResource = (
  data: CloudinaryUploadResponse,
): UploadedResource => ({
  publicId: data.public_id,
  fileUrl: data.secure_url,
  fileSize: data.bytes ?? null,
  fileType: data.format ?? data.resource_type ?? null,
});

const uploadLessonVideoAPI = async (file: File) => {
  const formData = new FormData();
  formData.append("videos", file);

  const res = await authorizedAxiosInstance.post(
    `${API_ROOT}/v1/lessons/uploads/videos`,
    formData,
  );

  const uploaded = (res.data as CloudinaryUploadResponse[])[0];
  return mapCloudinaryResource(uploaded);
};

const uploadLessonFileAPI = async (file: File) => {
  const formData = new FormData();
  formData.append("files", file);

  const res = await authorizedAxiosInstance.post(
    `${API_ROOT}/v1/lessons/uploads/files`,
    formData,
  );

  const uploaded = (res.data as CloudinaryUploadResponse[])[0];
  return mapCloudinaryResource(uploaded);
};

const createLessonAPI = async (payload: {
  moduleId: number;
  title: string;
  description: string;
  note: string;
  duration: string;
  video: UploadedResource;
  resource?: UploadedResource;
}) => {
  const res = await authorizedAxiosInstance.post(
    `${API_ROOT}/v1/lessons`,
    payload,
  );
  return res.data;
};

const getPublicLessonsByModuleIdAPI = async (moduleId: number) => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/lessons/get-by-module-id/${moduleId}`,
  );
  return res.data;
};

const getLearningLessonsByModuleIdAPI = async (moduleId: number) => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/lessons/learning/get-by-module-id/${moduleId}`,
  );
  return res.data;
};

export const lecturerLessonService = {
  uploadLessonVideoAPI,
  uploadLessonFileAPI,
  createLessonAPI,
  getPublicLessonsByModuleIdAPI,
  getLearningLessonsByModuleIdAPI,
};
