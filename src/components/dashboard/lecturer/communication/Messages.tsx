/* eslint-disable @typescript-eslint/no-explicit-any */
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import dayjs from "dayjs";
import { Search, Send, Smile } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { selectCurrentUser } from "../../../../redux/activeUser/activeUserSlice";
import {
  fetchMessagesAPI,
  markAsSeenAPI,
  sendDirectMessageAPI,
  setActiveConversation,
} from "../../../../redux/chat/chatSlice";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";

const MOCK_LECTURER_MESSAGES = [
  {
    id: -1,
    senderId: -1,
    content: "Bạn chưa có cuộc trò chuyện nào.",
    createdAt: new Date().toISOString(),
    conversationId: -1,
    sender: {
      id: -1,
      firstName: "System",
      lastName: "",
      avatarUrl: null,
    },
  },
];

const getDisplayName = (user?: {
  firstName?: string | null;
  lastName?: string | null;
}) => {
  const fullName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();
  return fullName || "Student";
};

const Messages = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const chatState = useAppSelector((state) => state.chat);

  const [searchQuery, setSearchQuery] = useState("");
  const [messageText, setMessageText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);

  const activeConversationId = chatState?.activeConversationId ?? null;
  const loadingConversations = chatState?.loadingConversations ?? false;

  const lecturerConversations = useMemo(() => {
    const conversations = chatState?.conversations ?? [];

    return conversations
      .map((conversation) => {
        const student = (conversation.participants ?? []).find(
          (p) => p.role === "student",
        );
        return {
          ...conversation,
          student,
          studentName: getDisplayName(student),
          studentAvatar: student?.avatarUrl || "/avatar1.png",
          unreadCount:
            conversation?.unreadCounts?.[String(currentUser?.id)] ??
            conversation?.myUnreadCount ??
            0,
        };
      })
      .filter((item) => item.student)
      .sort((a, b) => {
        const t1 = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
        const t2 = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
        return t2 - t1;
      });
  }, [chatState?.conversations, currentUser?.id]);

  const filteredConversations = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return lecturerConversations;
    return lecturerConversations.filter((item) =>
      item.studentName.toLowerCase().includes(q),
    );
  }, [lecturerConversations, searchQuery]);

  const selectedConversation = useMemo(
    () =>
      filteredConversations.find((item) => item.id === activeConversationId) ??
      lecturerConversations.find((item) => item.id === activeConversationId) ??
      null,
    [filteredConversations, lecturerConversations, activeConversationId],
  );

  const currentMessages = useMemo(() => {
    if (!activeConversationId) return [];

    const messagesByConversation = chatState?.messagesByConversation ?? {};

    return messagesByConversation[activeConversationId]?.items ?? [];
  }, [activeConversationId, chatState?.messagesByConversation]);

  const hasMore = useMemo(() => {
    if (!activeConversationId) return false;

    const messagesByConversation = chatState?.messagesByConversation ?? {};

    return !!messagesByConversation[activeConversationId]?.hasMore;
  }, [activeConversationId, chatState?.messagesByConversation]);

  useEffect(() => {
    if (!activeConversationId) return;
    dispatch(fetchMessagesAPI({ conversationId: activeConversationId }));
    dispatch(markAsSeenAPI(activeConversationId));
  }, [activeConversationId, dispatch]);

  useEffect(() => {
    if (activeConversationId) return;
    if (lecturerConversations.length === 0) return;
    dispatch(setActiveConversation(lecturerConversations[0].id));
  }, [activeConversationId, lecturerConversations, dispatch]);

  const handleSelectConversation = (conversationId: number) => {
    dispatch(setActiveConversation(conversationId));
  };

  const handleSendMessage = async () => {
    const content = messageText.trim();
    if (!content || !selectedConversation?.id) return;

    await dispatch(
      sendDirectMessageAPI({
        conversationId: selectedConversation.id,
        content,
      }),
    );
    setMessageText("");
    setShowEmoji(false);
  };

  const fetchMoreMessages = async () => {
    if (!selectedConversation?.id) return;
    await dispatch(
      fetchMessagesAPI({
        conversationId: selectedConversation.id,
      }),
    );
  };

  return (
    <div className="flex h-[calc(100vh-250px)] gap-6">
      {/* Left Sidebar - Users List */}
      <div className="w-80 rounded-xl border border-gray-200 bg-white">
        {/* Search */}
        <div className="border-b border-gray-200 p-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search student"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white 
              py-2 pl-10 pr-4 font-poppins text-sm text-[#000000] 
              placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Users List */}
        <div
          className="overflow-y-auto"
          style={{ maxHeight: "calc(100% - 80px)" }}
        >
          {loadingConversations ? (
            <div className="p-4 text-sm text-gray-500">
              Loading conversations...
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-4 text-sm text-gray-500">
              No student has contacted you yet!
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <button
                type="button"
                key={conversation.id}
                onClick={() => handleSelectConversation(conversation.id)}
                className={`w-full cursor-pointer border-b border-gray-100 p-4 
                  text-left transition-colors hover:bg-gray-50 
                  ${selectedConversation?.id === conversation.id ? "bg-blue-50" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={conversation.studentAvatar}
                      alt={conversation.studentName}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    {conversation.unreadCount > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#3b82f6] text-xs text-white">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-poppins text-sm font-medium text-[#000000]">
                      {conversation.studentName}
                    </p>
                    <p className="truncate font-poppins text-xs text-[#475569]">
                      {conversation.lastMessageContent || "Start chatting"}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Right Side - Chat Area */}
      <div className="flex flex-1 flex-col rounded-xl border border-gray-200 bg-white">
        {/* Chat Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <img
              src={selectedConversation?.studentAvatar || "/avatar1.png"}
              alt={selectedConversation?.studentName || "Student"}
              className="h-12 w-12 rounded-full object-cover"
            />
            <div>
              <p className="font-poppins text-base font-semibold text-[#000000]">
                {selectedConversation?.studentName || "Select student"}
              </p>
              <p className="font-poppins text-sm text-[#475569]">Student</p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div id="lecturer-chat-scroll" className="flex-1 overflow-y-auto p-6">
          {!selectedConversation ? (
            <p className="text-sm text-gray-500">
              Choose 1 student to start chatting.
            </p>
          ) : (
            <InfiniteScroll
              dataLength={currentMessages.length}
              next={fetchMoreMessages}
              hasMore={hasMore}
              inverse
              scrollableTarget="lecturer-chat-scroll"
              loader={
                <p className="text-center text-xs text-gray-500">Loading...</p>
              }
              style={{ display: "flex", flexDirection: "column-reverse" }}
            >
              {[
                ...(currentMessages.length
                  ? currentMessages
                  : MOCK_LECTURER_MESSAGES),
              ]
                .reverse()
                .map((message) => {
                  const isOwn =
                    Number(message.senderId) === Number(currentUser?.id);
                  return (
                    <div
                      key={message.id}
                      className={`mb-3 flex ${isOwn ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-md rounded-2xl px-4 py-3 ${isOwn ? "bg-blue-500 text-white" : "bg-white text-[#000000] shadow-sm ring-1 ring-gray-200"}`}
                      >
                        <p className="font-poppins text-sm">
                          {message.content}
                        </p>
                        <p className="mt-1 font-poppins text-xs opacity-80">
                          {dayjs(message.createdAt).format("HH:mm DD/MM")}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </InfiniteScroll>
          )}
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowEmoji((prev) => !prev)}
              className="rounded-lg p-2 hover:bg-gray-100"
            >
              <Smile size={18} />
            </button>

            <input
              type="text"
              placeholder="Type message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1 rounded-lg border border-gray-300 bg-white 
              px-4 py-2.5 font-poppins text-sm text-[#000000] placeholder-gray-400 
              focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="button"
              onClick={handleSendMessage}
              className="rounded-lg bg-[#16a34a] px-4 py-2.5 text-sm 
              font-medium text-white hover:bg-green-600"
            >
              <Send size={16} />
            </button>
          </div>

          {showEmoji && (
            <div className="mt-3">
              <Picker
                data={data}
                onEmojiSelect={(emoji: any) =>
                  setMessageText((prev) => prev + (emoji?.native ?? ""))
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
