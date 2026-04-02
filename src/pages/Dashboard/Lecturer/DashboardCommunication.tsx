import { useEffect, useState } from "react";
import Messages from "../../../components/dashboard/lecturer/communication/Messages";
import Reviews from "../../../components/dashboard/lecturer/communication/Reviews";
import { fetchConversationsAPI } from "../../../redux/chat/chatSlice";
import {
  connectChatSocket,
  disconnectChatSocket,
  syncConversationRooms,
} from "../../../redux/chat/socket";
import { useAppDispatch } from "../../../redux/hooks";
import { store } from "../../../redux/store";
import { useSearchParams } from "react-router-dom";

const DashboardCommunication = () => {
  const [activeTab, setActiveTab] = useState<"reviews" | "messages">("reviews");
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    connectChatSocket(store);
    dispatch(fetchConversationsAPI())
      .unwrap()
      .then(() => {
        syncConversationRooms(store);
      })
      .catch(() => {});

    return () => {
      disconnectChatSocket();
    };
  }, [dispatch]);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "messages") {
      setActiveTab("messages");
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-8">
      {/* Header */}
      <h1 className="mb-6 font-inter text-4xl font-bold text-[#000000]">
        Communication
      </h1>

      {/* Tabs */}
      <div className="mb-6 flex gap-8 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("reviews")}
          className={`pb-3 font-poppins text-sm font-medium transition ${
            activeTab === "reviews"
              ? "border-b-2 border-[#3B82F6] text-[#3B82F6]"
              : "text-[#475569] hover:text-[#000000]"
          }`}
        >
          Reviews
        </button>
        <button
          onClick={() => setActiveTab("messages")}
          className={`pb-3 font-poppins text-sm font-medium transition ${
            activeTab === "messages"
              ? "border-b-2 border-[#3B82F6] text-[#3B82F6]"
              : "text-[#475569] hover:text-[#000000]"
          }`}
        >
          Messages
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "reviews" && <Reviews />}
      {activeTab === "messages" && <Messages />}
    </div>
  );
};

export default DashboardCommunication;
