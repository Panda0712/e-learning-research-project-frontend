import authorizedAxiosInstance from "../utils/authorizedAxios";
import { API_ROOT } from "../utils/constants";
import { chatService } from "./chat";
import { lecturerCourseService } from "./lecturer/course";
import type {
  ConversationListResponse,
  ConversationMessagesResponse,
  LecturerReviewItem,
  NotificationListResponse,
} from "../types/communication.type";
import type { ReviewAPIData } from "../types/course.type";

const extractCourses = (payload: any): Array<{ id: number; name?: string }> => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.courses)) return payload.courses;
  return [];
};

const extractReviews = (payload: any): ReviewAPIData[] => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.reviews)) return payload.reviews;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
};

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
  options?: {
    page?: number;
    limit?: number;
    rating?: number;
  },
): Promise<LecturerReviewItem[]> => {
  const page = options?.page ?? 1;
  const limit = options?.limit ?? 10;
  const rating = options?.rating;

  const coursesPayload = await lecturerCourseService.getCoursesByLecturerIdAPI(
    lecturerId,
  );
  const courses = extractCourses(coursesPayload);

  if (!Array.isArray(courses) || courses.length === 0) return [];

  const reviewRequests = courses.map(async (course: { id: number; name?: string }) => {
    try {
      const response = await authorizedAxiosInstance.get(
        `${API_ROOT}/v1/course-reviews/course/${Number(course.id)}`,
        {
          params: {
            page,
            limit,
            ...(typeof rating === "number" ? { rating } : {}),
          },
        },
      );

      const rawReviews = extractReviews(response.data);

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
        studentId: review.studentId,
        lecturerReply: review.lecturerReply || null,
        lecturerReplyAt: review.lecturerReplyAt || null,
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

const replyToCourseReviewAPI = async (
  reviewId: number,
  lecturerReply: string,
) => {
  const res = await authorizedAxiosInstance.put(
    `${API_ROOT}/v1/course-reviews/${reviewId}`,
    {
      lecturerReply,
    },
  );
  return res.data;
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
  replyToCourseReviewAPI,
  getLecturerNotificationsAPI,
};
