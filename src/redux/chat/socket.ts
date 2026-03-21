/* eslint-disable @typescript-eslint/no-explicit-any */
import { io, Socket } from "socket.io-client";
import { API_ROOT } from "../../utils/constants";
import {
  receiveReadMessage,
  receiveSocketConversation,
  receiveSocketMessage,
} from "./chatSlice";

let socket: Socket | null = null;

export const connectChatSocket = (store: any) => {
  if (socket) return socket;

  socket = io(API_ROOT, {
    withCredentials: true,
    transports: ["websocket"],
  });

  socket.on("new-message", (payload) => {
    store.dispatch(receiveSocketMessage(payload));
  });

  socket.on("new-conversation", (payload) => {
    store.dispatch(receiveSocketConversation(payload));
    if (payload?.conversation?.id) {
      socket?.emit("join-conversation", payload.conversation.id);
    }
  });

  socket.on("read-message", (payload) => {
    store.dispatch(receiveReadMessage(payload));
  });

  return socket;
};

export const disconnectChatSocket = () => {
  if (!socket) return;
  socket.disconnect();
  socket = null;
};

export const getChatSocket = () => socket;
