/* eslint-disable @typescript-eslint/no-explicit-any */
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { Search, Send, Smile } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "react-toastify";
import { profileService } from "../../apis/profile";
import { selectCurrentUser } from "../../redux/activeUser/activeUserSlice";
import {
  clearConversationUnreadLocally,
  createConversationAPI,
  fetchConversationsAPI,
  fetchMessagesAPI,
  markAsSeenAPI,
  sendDirectMessageAPI,
  setActiveConversation,
} from "../../redux/chat/chatSlice";
import {
  connectChatSocket,
  disconnectChatSocket,
  syncConversationRooms,
} from "../../redux/chat/socket";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { store } from "../../redux/store";
import { useSearchParams } from "react-router-dom";
import { CHAT_SCROLLBAR_CLASS } from "../../utils/constants";

const STUDENT_CHAT_DEFAULTS = {
  page: 1,
  limit: 50,
};

const StudentChatPage = () => {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const currentUser = useAppSelector(selectCurrentUser);
  const { conversations, activeConversationId, messagesByConversation } =
    useAppSelector((state) => state.chat);

  const [lecturers, setLecturers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [isNearLatest, setIsNearLatest] = useState(true);
  const [newMessageDividerId, setNewMessageDividerId] = useState<number | null>(
    null,
  );

  const chatScrollRef = useRef<HTMLDivElement>(null);
  const prevLastMsgIdRef = useRef<number | null>(null);
  const prevConvIdRef = useRef<number | null>(null);
  const prevMsgCountRef = useRef<number>(0);

  const activeConversation = useMemo(
    () => conversations.find((item) => item.id === activeConversationId),
    [conversations, activeConversationId],
  );

  const activeLecturer = useMemo(() => {
    if (!activeConversation) return null;
    return (activeConversation.participants ?? []).find(
      (p) => p.role === "lecturer",
    );
  }, [activeConversation]);

  const currentMessages = activeConversationId
    ? (messagesByConversation[activeConversationId]?.items ?? [])
    : [];
  const lastMessage = currentMessages[currentMessages.length - 1] ?? null;
  const activeConversationFromQuery = Number(
    searchParams.get("conversationId"),
  );

  useEffect(() => {
    connectChatSocket(store);

    return () => {
      disconnectChatSocket();
    };
  }, []);

  useEffect(() => {
    dispatch(fetchConversationsAPI())
      .unwrap()
      .then(() => {
        syncConversationRooms(store);
      })
      .catch(() => {});
  }, [dispatch]);

  useEffect(() => {
    const studentId = Number(currentUser?.id);
    if (!studentId) return;

    const query = new URLSearchParams({
      page: String(STUDENT_CHAT_DEFAULTS.page),
      limit: String(STUDENT_CHAT_DEFAULTS.limit),
      q: "",
    });

    profileService
      .getMyLecturersAPI(`?${query.toString()}`)
      .then((res) => {
        setLecturers(res?.lecturers ?? []);
      })
      .catch((error: any) => {
        toast.error(error?.message || "Cannot get lecturers!");
      });
  }, [currentUser?.id]);

  useEffect(() => {
    if (!activeConversationId) return;
    dispatch(fetchMessagesAPI({ conversationId: activeConversationId }));
    dispatch(markAsSeenAPI(activeConversationId));
  }, [activeConversationId, dispatch]);

  useEffect(() => {
    if (
      Number.isInteger(activeConversationFromQuery) &&
      activeConversationFromQuery > 0 &&
      conversations.some((c) => c.id === activeConversationFromQuery)
    ) {
      dispatch(setActiveConversation(activeConversationFromQuery));
    }
  }, [activeConversationFromQuery, conversations, dispatch]);

  useEffect(() => {
    if (!activeConversationId) return;
    scrollToLatest("auto");
    prevLastMsgIdRef.current = null;
    setNewMessageDividerId(null);
  }, [activeConversationId]);

  useEffect(() => {
    if (!lastMessage) return;

    const prevId = prevLastMsgIdRef.current;
    const isNewIncoming =
      prevId !== null &&
      lastMessage.id !== prevId &&
      Number(lastMessage.senderId) !== Number(currentUser?.id);

    if (isNewIncoming) {
      setNewMessageDividerId(lastMessage.id);
      if (isNearLatest) scrollToLatest("smooth");
    }

    prevLastMsgIdRef.current = lastMessage.id;
  }, [
    lastMessage?.id,
    lastMessage,
    activeConversationId,
    isNearLatest,
    currentUser?.id,
  ]);

  useEffect(() => {
    if (!activeConversationId) return;

    const convChanged = prevConvIdRef.current !== activeConversationId;
    const msgCountIncreased = currentMessages.length > prevMsgCountRef.current;

    if (convChanged || msgCountIncreased) {
      scrollToLatest("auto");
    }

    prevConvIdRef.current = activeConversationId;
    prevMsgCountRef.current = currentMessages.length;
  }, [activeConversationId, currentMessages.length]);

  const filteredLecturers = lecturers.filter((item) =>
    `${item.firstName ?? ""} ${item.lastName ?? ""}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const getConversationUnread = (conversationId?: number) => {
    if (!conversationId) return 0;
    const conversation = conversations.find((c) => c.id === conversationId);
    if (!conversation) return 0;
    const uid = String(currentUser?.id ?? "");
    return conversation.unreadCounts?.[uid] ?? conversation.myUnreadCount ?? 0;
  };

  const selectLecturer = async (lecturerId: number) => {
    const existed = conversations.find(
      (item) => item.lecturerId === lecturerId,
    );
    const currentUserId = Number(currentUser?.id);

    if (existed) {
      dispatch(setActiveConversation(existed.id));

      if (currentUserId > 0) {
        dispatch(
          clearConversationUnreadLocally({
            conversationId: existed.id,
            userId: currentUserId,
          }),
        );
      }

      dispatch(markAsSeenAPI(existed.id));
      return;
    }
    const action = await dispatch(createConversationAPI(lecturerId));
    const created = action?.payload?.conversation;
    if (created?.id) {
      dispatch(setActiveConversation(created.id));
      dispatch(markAsSeenAPI(created.id));
    }
  };

  const onSend = async () => {
    const content = text.trim();
    if (!content) return;

    if (!activeConversationId) {
      toast.error("Please choose a lecturer first.");
      return;
    }

    await dispatch(
      sendDirectMessageAPI({
        conversationId: activeConversationId,
        content,
      }),
    );

    setText("");
    scrollToLatest("smooth");
  };

  const scrollToLatest = (behavior: ScrollBehavior = "smooth") => {
    const el = chatScrollRef.current;
    if (!el) return;

    requestAnimationFrame(() => {
      el.scrollTo({
        top: el.scrollHeight,
        behavior,
      });
    });
  };

  const handleChatScroll = () => {
    const el = chatScrollRef.current;
    if (!el) return;

    const distanceToBottom = el.scrollHeight - el.clientHeight - el.scrollTop;
    setIsNearLatest(distanceToBottom <= 80);
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-4 overflow-hidden">
      <div className="grid h-[calc(100dvh-170px)] min-h-155 grid-cols-12 gap-5 overflow-hidden">
        <div
          className="col-span-4 min-h-0 flex flex-col overflow-hidden rounded-xl border 
        border-gray-200 bg-white"
        >
          <div className="border-b border-gray-200 p-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:outline-none"
                placeholder="Search lecturer"
              />
            </div>
          </div>
          <div className={`min-h-0 flex-1 ${CHAT_SCROLLBAR_CLASS}`}>
            {filteredLecturers.map((lecturer: any) => {
              const convo = conversations.find(
                (item) => item.lecturerId === lecturer.id,
              );
              const isActive = activeConversationId === convo?.id;
              return (
                <button
                  type="button"
                  key={lecturer.id}
                  onClick={() => selectLecturer(lecturer.id)}
                  className={`relative flex w-full items-center gap-3 border-b border-gray-100 p-4 text-left ${isActive ? "bg-blue-50" : "hover:bg-gray-50"}`}
                >
                  <div className="relative">
                    <img
                      src={lecturer?.avatar?.fileUrl || "/avatar1.png"}
                      alt="lecturer-img"
                      className="h-11 w-11 rounded-full object-cover"
                    />
                    {(() => {
                      const unreadCount = getConversationUnread(convo?.id);
                      return unreadCount > 0 ? (
                        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#3b82f6] px-1 text-xs text-white">
                          {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                      ) : null;
                    })()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {`${lecturer.firstName ?? ""} ${lecturer.lastName ?? ""}`}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {convo?.lastMessageContent ?? "Start chatting"}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="col-span-8 min-h-0 flex flex-col rounded-xl overflow-hidden border border-gray-200 bg-white">
          <div className="border-b border-gray-200 p-4">
            {activeLecturer ? (
              <div className="flex items-center gap-3">
                <img
                  src={activeLecturer.avatarUrl || "/avatar1.png"}
                  alt={`${activeLecturer.firstName ?? ""} ${activeLecturer.lastName ?? ""}`.trim()}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {`${activeLecturer.firstName ?? ""} ${activeLecturer.lastName ?? ""}`.trim() ||
                      "Lecturer"}
                  </p>
                  <p className="text-xs text-gray-500">Lecturer</p>
                </div>
              </div>
            ) : (
              <p className="text-sm font-semibold">Select a lecturer</p>
            )}
          </div>

          <div
            id="student-chat-scroll"
            ref={chatScrollRef}
            onScroll={handleChatScroll}
            className={`min-h-0 flex-1 p-4 ${CHAT_SCROLLBAR_CLASS}`}
          >
            <InfiniteScroll
              dataLength={currentMessages.length}
              next={() =>
                activeConversationId &&
                dispatch(
                  fetchMessagesAPI({
                    conversationId: activeConversationId,
                  }),
                )
              }
              hasMore={
                !!(
                  activeConversationId &&
                  messagesByConversation[activeConversationId]?.hasMore
                )
              }
              loader={
                <p className="text-center text-xs text-gray-500">Loading...</p>
              }
              inverse
              scrollableTarget="student-chat-scroll"
              style={{ display: "flex", flexDirection: "column-reverse" }}
            >
              {[...currentMessages].reverse().map((message) => (
                <div key={message.id}>
                  {newMessageDividerId === message.id && (
                    <div className="my-3 flex items-center gap-2">
                      <div className="h-px flex-1 bg-blue-200" />
                      <span className="text-xs font-semibold text-blue-600">
                        New message
                      </span>
                      <div className="h-px flex-1 bg-blue-200" />
                    </div>
                  )}

                  <div
                    className={`mb-3 flex ${Number(message.senderId) === Number(currentUser?.id) ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${Number(message.senderId) === Number(currentUser?.id) ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"}`}
                    >
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}
            </InfiniteScroll>
          </div>

          <div className="border-t border-gray-200 p-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-md p-2 hover:bg-gray-100"
                onClick={() => setShowEmoji((v) => !v)}
              >
                <Smile size={18} />
              </button>
              <input
                disabled={!activeConversationId}
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSend()}
                placeholder={
                  activeConversationId
                    ? "Type a message..."
                    : "Choose a lecturer first..."
                }
              />
              <button
                type="button"
                onClick={onSend}
                disabled={!activeConversationId}
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white"
              >
                <Send size={16} />
              </button>
            </div>
            {showEmoji && (
              <div className="mt-2">
                <Picker
                  data={data}
                  onEmojiSelect={(emoji: any) =>
                    setText((prev) => prev + emoji.native)
                  }
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentChatPage;
