import authorizedAxiosInstance from "../utils/authorizedAxios";
import { API_ROOT } from "../utils/constants";

const PAGE_LIMIT = 30;

const getConversationsAPI = async () => {
  const res = await authorizedAxiosInstance.get(`${API_ROOT}/v1/conversations`);
  return res.data;
};

const createConversationAPI = async (recipientId: number) => {
  const res = await authorizedAxiosInstance.post(
    `${API_ROOT}/v1/conversations`,
    { recipientId },
  );
  return res.data;
};

const getMessagesAPI = async (params: {
  conversationId: number;
  cursor?: string | null;
  limit?: number;
}) => {
  const query = new URLSearchParams();
  query.set("limit", String(params.limit ?? PAGE_LIMIT));
  if (params.cursor) query.set("cursor", params.cursor);

  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/conversations/${params.conversationId}/messages${query.toString()}`,
  );
  return res.data;
};

const markAsSeenAPI = async (conversationId: number) => {
  const res = await authorizedAxiosInstance.patch(
    `${API_ROOT}/v1/conversations/${conversationId}/seen`,
  );
  return res.data;
};

const sendDirectMessageAPI = async (payload: {
  conversationId?: number;
  recipientId?: number;
  content?: string;
  imgUrl?: string;
}) => {
  const res = await authorizedAxiosInstance.post(
    `${API_ROOT}/v1/messages/direct`,
    payload,
  );
  return res.data;
};

export const chatService = {
  getConversationsAPI,
  createConversationAPI,
  getMessagesAPI,
  markAsSeenAPI,
  sendDirectMessageAPI,
};
