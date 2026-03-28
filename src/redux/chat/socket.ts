/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { io, Socket } from "socket.io-client";
import { API_ROOT } from "../../utils/constants";
import {
  receiveReadMessage,
  receiveSocketConversation,
  receiveSocketMessage,
} from "./chatSlice";

let socket: Socket | null = null;
let subscribers = 0;
let joinedConversationIds = new Set<number>();

export const syncConversationRooms = (store: any) => {
  if (!socket) return;

  const conversations = store.getState()?.chat?.conversations ?? [];
  conversations.forEach((conversation: { id: number }) => {
    if (!joinedConversationIds.has(conversation.id)) {
      socket?.emit("join-conversation", conversation.id);
      joinedConversationIds.add(conversation.id);
    }
  });
};

export const connectChatSocket = (store: any, accessToken?: string) => {
  subscribers += 1;

  if (socket) {
    syncConversationRooms(store);
    return socket;
  }

  socket = io(API_ROOT, {
    withCredentials: true,
    transports: ["websocket"],
    auth: accessToken ? { token: accessToken } : undefined,
  });

  socket.on("connect", () => {
    joinedConversationIds.clear();
    syncConversationRooms(store);
  });

  socket.on("new-message", (payload) => {
    store.dispatch(receiveSocketMessage(payload));
  });

  socket.on("new-conversation", (payload) => {
    store.dispatch(receiveSocketConversation(payload));
    if (
      payload?.conversation?.id &&
      !joinedConversationIds.has(payload.conversation.id)
    ) {
      socket?.emit("join-conversation", payload.conversation.id);
      joinedConversationIds.add(payload.conversation.id);
    }
  });

  socket.on("read-message", (payload) => {
    store.dispatch(receiveReadMessage(payload));
  });

  return socket;
};

export const disconnectChatSocket = () => {
  subscribers = Math.max(0, subscribers - 1);

  if (subscribers > 0) return;
  if (!socket) return;

  socket.disconnect();
  socket = null;
  joinedConversationIds.clear();
};

export const getChatSocket = () => socket;
