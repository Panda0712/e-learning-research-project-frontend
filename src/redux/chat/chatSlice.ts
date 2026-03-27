/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { chatService } from "../../apis/chat";
import type { ChatConversation, ChatMessage } from "../../types/chat.type";

type MessageBucket = {
  items: ChatMessage[];
  nextCursor: string | null;
  hasMore: boolean;
};

type ChatState = {
  conversations: ChatConversation[];
  messagesByConversation: Record<number, MessageBucket>;
  activeConversationId: number | null;
  loadingConversations: boolean;
  loadingMessages: boolean;
  conversationsError: string | null;
  messagesError: string | null;
};

const initialState: ChatState = {
  conversations: [],
  messagesByConversation: {},
  activeConversationId: null,
  loadingConversations: false,
  loadingMessages: false,
  conversationsError: null,
  messagesError: null,
};

export const fetchConversationsAPI = createAsyncThunk(
  "chat/fetchConversationsAPI",
  async () => {
    return await chatService.getConversationsAPI();
  },
);

export const fetchMessagesAPI = createAsyncThunk(
  "chat/fetchMessagesAPI",
  async (payload: { conversationId: number }, { getState }) => {
    const state = getState() as any;
    const bucket = state.chat.messagesByConversation[payload.conversationId];
    const cursor = bucket?.nextCursor;
    if (bucket && cursor === null) {
      return {
        conversationId: payload.conversationId,
        messages: [],
        nextCursor: null,
      };
    }

    const res = await chatService.getMessagesAPI({
      conversationId: payload.conversationId,
      cursor: cursor ?? undefined,
    });

    return {
      conversationId: payload.conversationId,
      messages: res.messages ?? [],
      nextCursor: res.nextCursor ?? null,
    };
  },
);

export const createConversationAPI = createAsyncThunk(
  "chat/createConversationAPI",
  async (recipientId: number) => {
    return await chatService.createConversationAPI(recipientId);
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
    return await chatService.sendDirectMessageAPI(payload);
  },
);

export const markAsSeenAPI = createAsyncThunk(
  "chat/markAsSeenAPI",
  async (conversationId: number) => {
    return await chatService.markAsSeenAPI(conversationId);
  },
);

const upsertConversation = (
  list: ChatConversation[],
  incoming: ChatConversation,
) => {
  const found = list.find((item) => item.id === incoming.id);
  if (!found) return [incoming, ...list];
  return list.map((item) =>
    item.id === incoming.id ? { ...item, ...incoming } : item,
  );
};

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
        conversation: ChatConversation;
        unreadCounts?: Record<string, number>;
      }>,
    ) => {
      const { message, conversation, unreadCounts } = action.payload;
      state.conversations = upsertConversation(state.conversations, {
        ...conversation,
        unreadCounts,
      });

      const current = state.messagesByConversation[message.conversationId] ?? {
        items: [],
        nextCursor: undefined,
        hasMore: true,
      };

      if (!current.items.some((m) => m.id === message.id)) {
        current.items.push(message);
      }

      state.messagesByConversation[message.conversationId] = current;
    },
    receiveSocketConversation: (
      state,
      action: PayloadAction<{
        conversation: ChatConversation;
      }>,
    ) => {
      state.conversations = upsertConversation(
        state.conversations,
        action.payload.conversation,
      );
    },
    receiveReadMessage: (
      state,
      action: PayloadAction<{
        conversation: Pick<
          ChatConversation,
          "id" | "lastMessageId" | "lastMessageAt"
        >;
        seenBy: ChatConversation["seenBy"];
      }>,
    ) => {
      state.conversations = state.conversations.map((item) =>
        item.id === action.payload.conversation.id
          ? {
              ...item,
              ...action.payload.conversation,
              seenBy: action.payload.seenBy,
            }
          : item,
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchConversationsAPI.pending, (state) => {
      state.loadingConversations = true;
      state.conversationsError = null;
    });
    builder.addCase(fetchConversationsAPI.fulfilled, (state, action) => {
      state.loadingConversations = false;
      state.conversations = action.payload?.conversations ?? [];
    });
    builder.addCase(fetchConversationsAPI.rejected, (state) => {
      state.loadingConversations = false;
      state.conversationsError = "Failed to load conversations.";
    });
    builder.addCase(fetchMessagesAPI.pending, (state) => {
      state.loadingMessages = true;
      state.messagesError = null;
    });
    builder.addCase(fetchMessagesAPI.fulfilled, (state, action) => {
      state.loadingMessages = false;
      const { conversationId, messages, nextCursor } = action.payload;
      const prev = state.messagesByConversation[conversationId]?.items ?? [];
      const merged = [...messages, ...prev].filter(
        (msg, idx, arr) => arr.findIndex((m) => m.id === msg.id) === idx,
      );

      state.messagesByConversation[conversationId] = {
        items: merged,
        nextCursor,
        hasMore: !!nextCursor,
      };
    });
    builder.addCase(fetchMessagesAPI.rejected, (state) => {
      state.loadingMessages = false;
      state.messagesError = "Failed to load messages.";
    });
    builder.addCase(createConversationAPI.fulfilled, (state, action) => {
      const conversation = action.payload?.conversation;
      if (conversation)
        state.conversations = upsertConversation(
          state.conversations,
          conversation,
        );
      if (conversation?.id) state.activeConversationId = conversation.id;
    });
    builder.addCase(markAsSeenAPI.fulfilled, (state, action) => {
      const id = state.activeConversationId;
      if (!id) return;
      state.conversations = state.conversations.map((item) =>
        item.id === id
          ? { ...item, myUnreadCount: action.payload?.myUnreadCount ?? 0 }
          : item,
      );
    });
  },
});

export const {
  setActiveConversation,
  receiveSocketMessage,
  receiveSocketConversation,
  receiveReadMessage,
} = chatSlice.actions;

export const chatReducer = chatSlice.reducer;
