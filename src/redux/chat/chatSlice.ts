/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { chatService } from "../../apis/chat";

export type ChatSeenUser = {
  id: number;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
};

export type ChatParticipant = {
  id: number;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  role: "student" | "lecturer";
  joinedAt: string;
  lastReadAt: string | null;
  unreadCount: number;
};

export type ChatConversation = {
  id: number;
  studentId: number;
  lecturerId: number;
  lastMessageId: number | null;
  lastMessageContent: string | null;
  lastMessageSenderId: number | null;
  lastMessageAt: string | null;
  createdAt?: string;
  updatedAt?: string;
  participants?: ChatParticipant[];
  seenBy?: ChatSeenUser[];
  unreadCounts?: Record<string, number>;
  myUnreadCount?: number;
};

export type ChatMessage = {
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
};

type MessageBucket = {
  items: ChatMessage[];
  nextCursor: number | null | undefined;
  hasMore: boolean;
};

type ChatState = {
  conversations: ChatConversation[];
  messagesByConversation: Record<number, MessageBucket>;
  activeConversationId: number | null;
  loadingConversations: boolean;
  loadingMessages: boolean;
};

const initialState: ChatState = {
  conversations: [],
  messagesByConversation: {},
  activeConversationId: null,
  loadingConversations: false,
  loadingMessages: false,
};

const upsertConversation = (
  list: ChatConversation[],
  incoming: ChatConversation,
) => {
  const exists = list.some((c) => c.id === incoming.id);
  if (!exists) return [incoming, ...list];

  return list.map((c) => (c.id === incoming.id ? { ...c, ...incoming } : c));
};

const sortConversations = (list: ChatConversation[]) => {
  return [...list].sort((a, b) => {
    const t1 = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
    const t2 = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
    return t2 - t1;
  });
};

const mergeUniqueMessages = (older: ChatMessage[], newer: ChatMessage[]) => {
  const merged = [...older, ...newer];
  const map = new Map<number, ChatMessage>();

  merged.forEach((msg) => {
    map.set(msg.id, msg);
  });

  return Array.from(map.values()).sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
};

export const fetchConversationsAPI = createAsyncThunk(
  "chat/fetchConversationsAPI",
  async () => {
    const res = await chatService.getConversationsAPI();
    return res;
  },
);

export const fetchMessagesAPI = createAsyncThunk(
  "chat/fetchMessagesAPI",
  async (payload: { conversationId: number }, { getState }) => {
    const state = getState() as { chat: ChatState };
    const bucket = state.chat.messagesByConversation[payload.conversationId];
    const cursor = bucket?.nextCursor;

    if (bucket && cursor === null) {
      return {
        conversationId: payload.conversationId,
        messages: [] as ChatMessage[],
        nextCursor: null as number | null,
      };
    }

    const res = await chatService.getMessagesAPI({
      conversationId: payload.conversationId,
      cursor: typeof cursor === "number" ? cursor : undefined,
      limit: 30,
    });

    return {
      conversationId: payload.conversationId,
      messages: (res?.messages ?? []) as ChatMessage[],
      nextCursor: (res?.nextCursor ?? null) as number | null,
    };
  },
);

export const createConversationAPI = createAsyncThunk(
  "chat/createConversationAPI",
  async (recipientId: number) => {
    const res = await chatService.createConversationAPI(recipientId);
    return res;
  },
);

export const sendDirectMessageAPI = createAsyncThunk(
  "chat/sendDirectMessageAPI",
  async (payload: {
    conversationId?: number;
    recipientId?: number;
    content?: string;
    imgUrl?: string;
  }) => {
    const res = await chatService.sendDirectMessageAPI(payload);
    return res;
  },
);

export const markAsSeenAPI = createAsyncThunk(
  "chat/markAsSeenAPI",
  async (conversationId: number) => {
    const res = await chatService.markAsSeenAPI(conversationId);
    return { ...res, conversationId };
  },
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveConversation: (state, action: PayloadAction<number | null>) => {
      state.activeConversationId = action.payload;
    },
    receiveSocketMessage: (
      state,
      action: PayloadAction<{
        message: ChatMessage;
        conversation: Partial<ChatConversation> & { id: number };
        unreadCounts?: Record<string, number>;
      }>,
    ) => {
      const { message, conversation, unreadCounts } = action.payload;

      const oldConversation =
        state.conversations.find((c) => c.id === conversation.id) ?? null;

      const mergedConversation: ChatConversation = {
        ...(oldConversation ?? {
          id: conversation.id,
          studentId: 0,
          lecturerId: 0,
          lastMessageId: null,
          lastMessageContent: null,
          lastMessageSenderId: null,
          lastMessageAt: null,
        }),
        ...conversation,
        unreadCounts: unreadCounts ?? oldConversation?.unreadCounts,
      };

      state.conversations = sortConversations(
        upsertConversation(state.conversations, mergedConversation),
      );

      const current = state.messagesByConversation[message.conversationId] ?? {
        items: [],
        nextCursor: undefined,
        hasMore: true,
      };

      state.messagesByConversation[message.conversationId] = {
        ...current,
        items: mergeUniqueMessages(current.items, [message]),
      };
    },
    receiveSocketConversation: (
      state,
      action: PayloadAction<{
        conversation: ChatConversation;
      }>,
    ) => {
      state.conversations = sortConversations(
        upsertConversation(state.conversations, action.payload.conversation),
      );
    },
    receiveReadMessage: (
      state,
      action: PayloadAction<{
        conversation: {
          id: number;
          lastMessageId: number | null;
          lastMessageAt: string | null;
        };
        seenBy: ChatSeenUser[];
        member: {
          userId: number;
          unreadCount: number;
          lastReadAt: string | null;
        };
      }>,
    ) => {
      const { conversation, seenBy, member } = action.payload;

      state.conversations = state.conversations.map((c) => {
        if (c.id !== conversation.id) return c;

        const nextUnreadCounts = {
          ...(c.unreadCounts ?? {}),
          [String(member.userId)]: member.unreadCount,
        };

        return {
          ...c,
          lastMessageId: conversation.lastMessageId,
          lastMessageAt: conversation.lastMessageAt,
          seenBy,
          unreadCounts: nextUnreadCounts,
          myUnreadCount:
            state.activeConversationId === c.id
              ? member.unreadCount
              : c.myUnreadCount,
        };
      });
    },

    resetChatState: () => initialState,
  },

  extraReducers: (builder) => {
    builder.addCase(fetchConversationsAPI.pending, (state) => {
      state.loadingConversations = true;
    });

    builder.addCase(fetchConversationsAPI.fulfilled, (state, action) => {
      state.loadingConversations = false;
      state.conversations = sortConversations(
        action.payload?.conversations ?? [],
      );
    });

    builder.addCase(fetchConversationsAPI.rejected, (state) => {
      state.loadingConversations = false;
    });

    builder.addCase(fetchMessagesAPI.pending, (state) => {
      state.loadingMessages = true;
    });

    builder.addCase(fetchMessagesAPI.fulfilled, (state, action) => {
      state.loadingMessages = false;

      const { conversationId, messages, nextCursor } = action.payload;
      const current = state.messagesByConversation[conversationId] ?? {
        items: [],
        nextCursor: undefined,
        hasMore: true,
      };

      state.messagesByConversation[conversationId] = {
        items: mergeUniqueMessages(messages, current.items),
        nextCursor,
        hasMore: nextCursor !== null,
      };
    });

    builder.addCase(fetchMessagesAPI.rejected, (state) => {
      state.loadingMessages = false;
    });

    builder.addCase(createConversationAPI.fulfilled, (state, action) => {
      const conversation = action.payload?.conversation as
        | ChatConversation
        | undefined;
      if (!conversation) return;

      state.conversations = sortConversations(
        upsertConversation(state.conversations, conversation),
      );
      state.activeConversationId = conversation.id;
    });

    builder.addCase(markAsSeenAPI.fulfilled, (state, action) => {
      const conversationId = action.payload?.conversationId as number;
      const myUnreadCount = action.payload?.myUnreadCount;

      if (!conversationId || typeof myUnreadCount !== "number") return;

      state.conversations = state.conversations.map((c) => {
        if (c.id !== conversationId) return c;

        const nextUnreadCounts = {
          ...(c.unreadCounts ?? {}),
        };

        return {
          ...c,
          unreadCounts: nextUnreadCounts,
          myUnreadCount,
        };
      });
    });
  },
});

export const {
  setActiveConversation,
  receiveSocketMessage,
  receiveSocketConversation,
  receiveReadMessage,
  resetChatState,
} = chatSlice.actions;

export const chatReducer = chatSlice.reducer;

export const selectChatState = (state: any): ChatState => state.chat;
export const selectChatConversations = (state: any): ChatConversation[] =>
  state.chat.conversations ?? [];
export const selectActiveConversationId = (state: any): number | null =>
  state.chat.activeConversationId ?? null;
export const selectMessagesByConversation = (state: any) =>
  state.chat.messagesByConversation ?? {};
