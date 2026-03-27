import authorizedAxiosInstance from "../utils/authorizedAxios";
import { API_ROOT } from "../utils/constants";
import { chatService } from "./chat";
import { courseService } from "./course";
import { lecturerService } from "./lecturer";
import type {
  ConversationListResponse,
  ConversationMessagesResponse,
  LecturerReviewItem,
  NotificationListResponse,
} from "../types/communication.type";
import type { ReviewAPIData } from "../types/course.type";

const getLecturerConversationsAPI = async (): Promise<ConversationListResponse> => {
  return await chatService.getConversationsAPI();
};

const getConversationMessagesAPI = async (params: {
  conversationId: number;
  cursor?: string | null;
  limit?: number;
}): Promise<ConversationMessagesResponse> => {
  return await chatService.getMessagesAPI(params);
};

const getLecturerReviewsAPI = async (
  lecturerId: number,
  perCourseLimit = 5,
): Promise<LecturerReviewItem[]> => {
  const courses = await lecturerService.getCoursesByLecturerIdAPI(lecturerId);

  if (!Array.isArray(courses) || courses.length === 0) return [];

  const reviewRequests = courses.map(async (course: { id: number; name?: string }) => {
    try {
      const response = await courseService.getReviewsByCourseIdAPI({
        courseId: Number(course.id),
        params: { page: 1, itemsPerPage: perCourseLimit },
      });

      const rawReviews: ReviewAPIData[] = Array.isArray(response)
        ? response
        : response?.reviews ??
          response?.data ??
          response?.items ??
          [];

      return rawReviews.map((review) => ({
        id: review.id,
        rating: review.rating || 0,
        comment: review.content || "",
        postedDate: review.createdAt || new Date().toISOString(),
        hasComment: !!review.content,
        isAnswered: false,
        courseId: Number(course.id),
        courseName: course.name || "Course",
        studentName: review.studentName || "Student",
        studentAvatar: review.studentAvatar || "/avatar1.png",
      }));
    } catch {
      return [] as LecturerReviewItem[];
    }
  });

  const merged = (await Promise.all(reviewRequests)).flat();

  return merged.sort(
    (a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime(),
  );
};

const getLecturerNotificationsAPI = async (
  userId: number,
  page = 1,
  limit = 10,
): Promise<NotificationListResponse> => {
  const res = await authorizedAxiosInstance.get<NotificationListResponse>(
    `${API_ROOT}/v1/notifications/user/${userId}`,
    {
      params: { page, limit },
    },
  );

  return res.data;
};

export const communicationService = {
  getLecturerConversationsAPI,
  getConversationMessagesAPI,
  getLecturerReviewsAPI,
  getLecturerNotificationsAPI,
};
