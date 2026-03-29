import authorizedAxiosInstance from "../utils/authorizedAxios";
import { API_ROOT } from "../utils/constants";

export interface AdminCourseListQuery {
  page?: number;
  itemsPerPage?: number;
  q?: string;
  status?: "all" | "active" | "pending" | "rejected";
}

interface AdminCourseResource {
  fileUrl?: string | null;
  fileType?: string | null;
}

interface AdminCourseLesson {
  id: number;
  title?: string;
  description?: string | null;
  note?: string | null;
  duration?: string | null;
  createdAt?: string;
  lessonFileId?: number | null;
  lessonFile?: AdminCourseResource | null;
  lessonVideo?: AdminCourseResource | null;
  quizzes?: Array<{ id: number }>;
}

interface AdminCourseModule {
  id: number;
  title?: string;
  description?: string | null;
  lessons?: AdminCourseLesson[];
}

interface AdminCourseDetail {
  id: number;
  status?: string;
  thumbnail?: { fileUrl?: string | null } | null;
  modules?: AdminCourseModule[];
}

export interface AdminLessonDetailResponse {
  course: AdminCourseDetail;
  module: AdminCourseModule;
  moduleIndex: number;
  lesson: AdminCourseLesson;
}

const getAdminCoursesAPI = async (params: AdminCourseListQuery) => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/courses/admin/list`,
    {
      params,
    },
  );
  return res.data;
};

const getAdminCourseByIdAPI = async (id: number) => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/courses/admin/${id}`,
  );
  return res.data;
};

const getAdminLessonDetailAPI = async (
  courseId: number,
  lessonId: number,
): Promise<AdminLessonDetailResponse> => {
  const course = (await getAdminCourseByIdAPI(courseId)) as AdminCourseDetail;

  const modules = Array.isArray(course?.modules) ? course.modules : [];

  for (let moduleIndex = 0; moduleIndex < modules.length; moduleIndex++) {
    const module = modules[moduleIndex];
    const lessons = Array.isArray(module?.lessons) ? module.lessons : [];
    const lesson = lessons.find((item) => Number(item?.id) === lessonId);

    if (lesson) {
      return {
        course,
        module,
        moduleIndex,
        lesson,
      };
    }
  }

  throw new Error("Lesson not found in this course");
};

const approveCourseAPI = async (id: number) => {
  const res = await authorizedAxiosInstance.put(
    `${API_ROOT}/v1/courses/approve-course/${id}`,
  );
  return res.data;
};

const rejectCourseAPI = async (id: number) => {
  const res = await authorizedAxiosInstance.put(
    `${API_ROOT}/v1/courses/reject-course/${id}`,
  );
  return res.data;
};

const disableCourseAPI = async (id: number) => {
  const res = await authorizedAxiosInstance.delete(
    `${API_ROOT}/v1/courses/${id}`,
  );
  return res.data;
};

export const adminCourseService = {
  getAdminCoursesAPI,
  getAdminCourseByIdAPI,
  getAdminLessonDetailAPI,
  approveCourseAPI,
  rejectCourseAPI,
  disableCourseAPI,
};
