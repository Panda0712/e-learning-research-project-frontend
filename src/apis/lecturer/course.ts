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
  introVideo?: UploadedResource;
  name: string;
  lecturerName: string;
  duration: string;
  level: string;
  overview: string;
  price: number;
  status: "draft" | "pending" | "published" | "rejected";
};

export type CreateCourseWithAssetsInput = {
  introImage: File;
  introVideo?: File;
  payload: Omit<LecturerCoursePayload, "thumbnail" | "introVideo">;
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

const uploadCourseIntroVideoAPI = async (file: File) => {
  const formData = new FormData();
  formData.append("video", file);

  const res = await authorizedAxiosInstance.post(
    `${API_ROOT}/v1/courses/intro-video`,
    formData,
  );
  return mapCloudinaryResource(res.data);
};

const createCourseAPI = async (payload: LecturerCoursePayload) => {
  const res = await authorizedAxiosInstance.post(
    `${API_ROOT}/v1/courses`,
    payload,
  );
  return res.data;
};

const createCourseWithAssetsAPI = async (
  input: CreateCourseWithAssetsInput,
) => {
  const thumbnail = await uploadCourseThumbnailAPI(input.introImage);
  const introVideo = input.introVideo
    ? await uploadCourseIntroVideoAPI(input.introVideo)
    : undefined;

  return createCourseAPI({
    ...input.payload,
    thumbnail,
    introVideo,
  });
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
  const res = await authorizedAxiosInstance.post(
    `${API_ROOT}/v1/courses/faq`,
    payload,
  );
  return res.data;
};

const getCourseFaqByCourseIdAPI = async (courseId: number) => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/courses/faq/get-by-course-id/${courseId}`,
  );
  return res.data;
};

const getCourseCategoriesAPI = async () => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/courses/categories`,
  );
  return res.data;
};

const getCoursesByLecturerIdAPI = async (lecturerId: number) => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/courses/get-courses-by-lecturer-id/${lecturerId}`,
  );
  return res.data;
};

const getMyCoursesAPI = async (params: {
  page?: number;
  itemsPerPage?: number;
  status?: "all" | "draft" | "pending" | "published" | "rejected";
  q?: string;
  sortBy?: "createdAt" | "updatedAt";
}) => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/courses/lecturer/my-courses`,
    { params },
  );
  return res.data;
};

const getCourseByIdForLecturerAPI = async (id: number) => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/courses/lecturer/course/${id}`,
  );
  return res.data;
};

export const lecturerCourseService = {
  uploadCourseThumbnailAPI,
  uploadCourseIntroVideoAPI,
  createCourseAPI,
  createCourseWithAssetsAPI,
  updateCourseAPI,
  createCourseFaqAPI,
  getCourseFaqByCourseIdAPI,
  getCourseCategoriesAPI,
  getCoursesByLecturerIdAPI,
  getMyCoursesAPI,
  getCourseByIdForLecturerAPI,
};
