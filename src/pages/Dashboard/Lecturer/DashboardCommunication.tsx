import { useEffect, useState } from "react";
import Messages from "../../../components/dashboard/lecturer/communication/Messages";
import Reviews from "../../../components/dashboard/lecturer/communication/Reviews";
import { communicationService } from "../../../apis/communication";
import { permissions } from "../../../configs/rbacConfig";
import { usePermission } from "../../../hooks/usePermission";
import { selectCurrentUser } from "../../../redux/activeUser/activeUserSlice";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { connectChatSocket } from "../../../redux/chat/socket";
import { store } from "../../../redux/store";
import { fetchConversationsAPI } from "../../../redux/chat/chatSlice";
import type { LecturerReviewItem } from "../../../types/communication.type";
import { ACCOUNT_ROLES } from "../../../utils/constants";

const DashboardCommunication = () => {
  const [activeTab, setActiveTab] = useState<"reviews" | "messages">("reviews");
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const { hasPermission } = usePermission(currentUser?.role || "");

  const [reviews, setReviews] = useState<LecturerReviewItem[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState<string | null>(null);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    if (!currentUser?.id) return;
    connectChatSocket(store);
    dispatch(fetchConversationsAPI());
  }, [dispatch, currentUser?.id]);

  useEffect(() => {
    const fetchCommunicationData = async () => {
      if (!currentUser?.id) return;

      try {
        setReviewsLoading(true);
        setReviewsError(null);

        const [reviewData, notificationData] = await Promise.all([
          communicationService.getLecturerReviewsAPI(Number(currentUser.id), 10),
          communicationService.getLecturerNotificationsAPI(Number(currentUser.id), 1, 10),
        ]);

        setReviews(reviewData);
        const unread = notificationData.data.filter((item) => !item.isRead).length;
        setUnreadNotifications(unread);
      } catch (error: any) {
        setReviewsError(error?.message || "Failed to load communication data.");
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchCommunicationData();
  }, [currentUser?.id]);

  if (
    currentUser?.role !== ACCOUNT_ROLES.LECTURER ||
    !hasPermission(permissions.VIEW_DASHBOARD_LECTURER)
  ) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] p-8">
        <h1 className="mb-6 font-inter text-4xl font-bold text-[#000000]">
          Communication
        </h1>
        <div className="rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-700">
          You do not have permission to view this section.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-inter text-4xl font-bold text-[#000000]">
          Communication
        </h1>
        <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
          Unread notifications: {unreadNotifications}
        </span>
      </div>

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
      {activeTab === "reviews" && (
        <Reviews
          reviews={reviews}
          loading={reviewsLoading}
          error={reviewsError}
          onRetry={async () => {
            if (!currentUser?.id) return;
            try {
              setReviewsLoading(true);
              setReviewsError(null);
              const reviewData = await communicationService.getLecturerReviewsAPI(
                Number(currentUser.id),
                10,
              );
              setReviews(reviewData);
            } catch (error: any) {
              setReviewsError(error?.message || "Failed to load communication data.");
            } finally {
              setReviewsLoading(false);
            }
          }}
        />
      )}
      {activeTab === "messages" && <Messages />}
    </div>
  );
};

export default DashboardCommunication;
