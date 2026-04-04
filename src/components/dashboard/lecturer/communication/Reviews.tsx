import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { communicationService } from "../../../../apis/communication";
import Pagination from "../../../ui/Pagination";
import { selectCurrentUser } from "../../../../redux/activeUser/activeUserSlice";
import { useAppSelector } from "../../../../redux/hooks";
import type { LecturerReviewItem } from "../../../../types/communication.type";

const ITEMS_PER_PAGE = 6;

const Reviews = () => {
  const currentUser = useAppSelector(selectCurrentUser);
  const lecturerId = Number(currentUser?.id || 0);

  const [reviews, setReviews] = useState<LecturerReviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [onlyHasComment, setOnlyHasComment] = useState(false);
  const [onlyNotAnswered, setOnlyNotAnswered] = useState(false);
  const [ratingFilter, setRatingFilter] = useState<number | "all">("all");
  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "highest" | "lowest"
  >("newest");

  useEffect(() => {
    if (!Number.isInteger(lecturerId) || lecturerId <= 0) return;

    setIsLoading(true);
    communicationService
      .getLecturerReviewsAPI(lecturerId, {
        page: 1,
        limit: 100,
      })
      .then((items) => {
        setReviews(items);
      })
      .catch(() => {
        setReviews([]);
        toast.error("Cannot load lecturer reviews.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [lecturerId]);

  const filteredReviews = useMemo(() => {
    const next = [...reviews]
      .filter((item) => (onlyHasComment ? item.hasComment : true))
      .filter((item) => (onlyNotAnswered ? !item.lecturerReply : true))
      .filter((item) =>
        ratingFilter === "all" ? true : item.rating === ratingFilter,
      );

    next.sort((a, b) => {
      if (sortBy === "oldest") {
        return (
          new Date(a.postedDate).getTime() - new Date(b.postedDate).getTime()
        );
      }

      if (sortBy === "highest") {
        return b.rating - a.rating;
      }

      if (sortBy === "lowest") {
        return a.rating - b.rating;
      }

      return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
    });

    return next;
  }, [onlyHasComment, onlyNotAnswered, ratingFilter, reviews, sortBy]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredReviews.length / ITEMS_PER_PAGE),
  );

  const paginatedReviews = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredReviews.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [currentPage, filteredReviews]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= rating ? "text-yellow-400" : "text-gray-300"}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const handleSendReply = async () => {
    const reviewId = replyingTo;
    const trimmedReply = replyText.trim();

    if (!reviewId || !trimmedReply) {
      toast.error("Please write a reply first.");
      return;
    }

    try {
      setIsSubmittingReply(true);
      const updated = await communicationService.replyToCourseReviewAPI(
        reviewId,
        trimmedReply,
      );

      setReviews((prev) =>
        prev.map((item) =>
          item.id === reviewId
            ? {
                ...item,
                lecturerReply: updated?.lecturerReply || trimmedReply,
                lecturerReplyAt:
                  updated?.lecturerReplyAt || new Date().toISOString(),
                isAnswered: true,
              }
            : item,
        ),
      );

      setReplyText("");
      setReplyingTo(null);
      toast.success("Reply sent successfully.");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Cannot send reply right now.",
      );
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleCancelReply = () => {
    setReplyText("");
    setReplyingTo(null);
  };

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 font-poppins text-sm text-[#475569]">
          <input
            type="checkbox"
            checked={onlyHasComment}
            onChange={(event) => {
              setOnlyHasComment(event.target.checked);
              setCurrentPage(1);
            }}
            className="h-4 w-4 rounded border-gray-300 bg-white"
          />
          Has a Comment
        </label>
        <label className="flex items-center gap-2 font-poppins text-sm text-[#475569]">
          <input
            type="checkbox"
            checked={onlyNotAnswered}
            onChange={(event) => {
              setOnlyNotAnswered(event.target.checked);
              setCurrentPage(1);
            }}
            className="h-4 w-4 rounded border-gray-300 bg-white"
          />
          Not Answered
        </label>

        <div className="ml-auto flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-poppins text-sm text-[#475569]">Rating:</span>
            <select
              value={ratingFilter}
              onChange={(event) => {
                const nextValue = event.target.value;
                setRatingFilter(
                  nextValue === "all" ? "all" : Number(nextValue),
                );
                setCurrentPage(1);
              }}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 font-poppins text-sm text-[#000000] focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-poppins text-sm text-[#475569]">Sort by:</span>
            <select
              value={sortBy}
              onChange={(event) => {
                setSortBy(event.target.value as typeof sortBy);
                setCurrentPage(1);
              }}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 font-poppins text-sm text-[#000000] focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-[#475569]">
            Loading reviews...
          </div>
        ) : paginatedReviews.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-[#475569]">
            No reviews found.
          </div>
        ) : (
          paginatedReviews.map((review) => (
            <div
              key={review.id}
              className="rounded-xl border border-gray-200 bg-white p-6"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2">{renderStars(review.rating)}</div>
                  <p className="mb-1 font-poppins text-sm text-[#000000]">
                    <span className="text-[#94A3B8]">Course Name:</span>{" "}
                    <span className="font-semibold">{review.courseName}</span>
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-200">
                      <img
                        src={review.studentAvatar}
                        alt={review.studentName}
                        className="h-full w-full object-cover"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                    <div>
                      <p className="font-poppins text-sm font-medium text-[#000000]">
                        {review.studentName}
                      </p>
                      <p className="font-poppins text-xs text-[#475569]">
                        {new Date(review.postedDate).toLocaleString("vi-VN")}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <button
                    onClick={() =>
                      setOpenMenuId(openMenuId === review.id ? null : review.id)
                    }
                    className="text-xl text-[#475569] hover:text-[#000000]"
                  >
                    •••
                  </button>
                  {openMenuId === review.id && (
                    <div className="absolute right-0 top-8 z-10 w-32 overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/5">
                      <button
                        onClick={() => setOpenMenuId(null)}
                        className="flex w-full items-center gap-2 px-4 py-2 font-poppins text-sm text-[#475569] hover:bg-gray-50"
                      >
                        Close
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <p className="mb-4 font-poppins text-sm text-[#475569]">
                {review.comment}
              </p>

              {review.lecturerReply && (
                <div className="mb-4 rounded-xl border border-blue-100 bg-blue-50 p-4">
                  <p className="font-poppins text-sm font-semibold text-[#1D4ED8]">
                    Your reply
                  </p>
                  <p className="mt-2 font-poppins text-sm text-[#334155]">
                    {review.lecturerReply}
                  </p>
                </div>
              )}

              {replyingTo === review.id ? (
                <div className="mt-4">
                  <textarea
                    value={replyText}
                    onChange={(event) => setReplyText(event.target.value)}
                    placeholder="Write your reply to this student"
                    className="mb-3 w-full rounded-lg border border-gray-300 bg-gray-50 p-3 font-poppins text-sm text-[#000000] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={handleCancelReply}
                      className="rounded-lg bg-gray-200 px-4 py-2 font-poppins text-sm font-medium text-[#000000] transition-colors hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSendReply}
                      disabled={isSubmittingReply}
                      className="rounded-lg bg-[#3B82F6] px-4 py-2 font-poppins text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubmittingReply ? "Sending..." : "Send"}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setReplyingTo(review.id);
                    setReplyText(review.lecturerReply || "");
                  }}
                  className="flex items-center gap-2 font-poppins text-sm text-[#FF0000] hover:text-red-700"
                >
                  <span>↩</span> {review.lecturerReply ? "Edit Reply" : "Reply"}
                </button>
              )}
            </div>
          ))
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onChange={setCurrentPage}
        type="secondary"
      />
    </div>
  );
};

export default Reviews;
