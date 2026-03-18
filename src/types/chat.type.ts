export interface ChatParticipant {
  id: number;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  role: "student" | "lecturer";
  joinedAt: string;
  lastReadAt: string | null;
  unreadCount: number;
}

export interface ChatConversation {
  id: number;
  studentId: number;
  lecturerId: number;
  lastMessageId: number | null;
  lastMessageContent: string | null;
  lastMessageSenderId: number | null;
  lastMessageAt: string | null;
  createdAt?: string;
  updatedAt?: string;
  participants: ChatParticipant[];
  seenBy?: Array<{
    id: number;
    firstName: string | null;
    lastName: string | null;
    avatarUrl: string | null;
  }>;
  unreadCounts?: Record<string, number>;
  myUnreadCount?: number;
}

export interface ChatMessage {
  id: number;
  conversationId: number;
  senderId: number;
  content: string | null;
  imgUrl: string | null;
  createdAt: string;
  sender: {
    id: number;
    firstName: string | null;
    lastName: string | null;
    avatarUrl: string | null;
  };
}
