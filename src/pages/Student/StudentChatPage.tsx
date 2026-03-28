/* eslint-disable @typescript-eslint/no-explicit-any */
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { Search, Send, Smile } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "react-toastify";
import { profileService } from "../../apis/profile";
import { selectCurrentUser } from "../../redux/activeUser/activeUserSlice";
import {
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

const STUDENT_CHAT_DEFAULTS = {
  page: 1,
  limit: 50,
};

const StudentChatPage = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const { conversations, activeConversationId, messagesByConversation } =
    useAppSelector((state) => state.chat);

  const [lecturers, setLecturers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);

  const activeConversation = useMemo(
    () => conversations.find((item) => item.id === activeConversationId),
    [conversations, activeConversationId],
  );

  const currentMessages = activeConversationId
    ? (messagesByConversation[activeConversationId]?.items ?? [])
    : [];

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

  const filteredLecturers = lecturers.filter((item) =>
    `${item.firstName ?? ""} ${item.lastName ?? ""}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const selectLecturer = async (lecturerId: number) => {
    const existed = conversations.find(
      (item) => item.lecturerId === lecturerId,
    );
    if (existed) {
      dispatch(setActiveConversation(existed.id));
      return;
    }
    const action = await dispatch(createConversationAPI(lecturerId));
    const created = action?.payload?.conversation;
    if (created?.id) dispatch(setActiveConversation(created.id));
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
  };

  return (
    <div className="mx-auto h-[calc(100vh-140px)] max-w-7xl p-6">
      <div className="grid h-full grid-cols-12 gap-5">
        <div className="col-span-4 rounded-xl border border-gray-200 bg-white">
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
          <div className="h-[calc(100%-70px)] overflow-y-auto">
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
                  className={`flex w-full items-center gap-3 border-b border-gray-100 p-4 text-left ${isActive ? "bg-blue-50" : "hover:bg-gray-50"}`}
                >
                  <img
                    src={lecturer?.avatar?.fileUrl || "/avatar1.png"}
                    alt="lecturer-img"
                    className="h-11 w-11 rounded-full object-cover"
                  />
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

        <div className="col-span-8 flex flex-col rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-200 p-4 text-sm font-semibold">
            {activeConversation ? "Conversation" : "Select a lecturer"}
          </div>

          <div id="student-chat-scroll" className="flex-1 overflow-y-auto p-4">
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
              {[...currentMessages].reverse().map((message) => {
                const isOwn =
                  Number(message.senderId) === Number(currentUser?.id);
                return (
                  <div
                    key={message.id}
                    className={`mb-3 flex ${isOwn ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${isOwn ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"}`}
                    >
                      {message.content}
                    </div>
                  </div>
                );
              })}
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
