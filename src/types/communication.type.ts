import type { ChatConversation, ChatMessage } from "./chat.type";

export interface ConversationListResponse {
  conversations: ChatConversation[];
}

export interface ConversationMessagesResponse {
  messages: ChatMessage[];
  nextCursor: string | null;
}

export interface LecturerReviewItem {
  id: number;
  rating: number;
  comment: string;
  postedDate: string;
  hasComment: boolean;
  isAnswered: boolean;
  courseId: number;
  courseName: string;
  studentName: string;
  studentAvatar: string;
}

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationListResponse {
  data: NotificationItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
