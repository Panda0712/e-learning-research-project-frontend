/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { communicationService } from "../../../../apis/communication";
import { selectCurrentUser } from "../../../../redux/activeUser/activeUserSlice";
import { useAppSelector } from "../../../../redux/hooks";
import type { LecturerReviewItem } from "../../../../types/communication.type";

type Review = LecturerReviewItem;

const formatRelativeDate = (isoDate: string) => {
  const t = new Date(isoDate).getTime();
  if (Number.isNaN(t)) return "Recently";

  const diffHours = Math.floor((Date.now() - t) / (1000 * 60 * 60));
  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
};

const Reviews = () => {
  const currentUser = useAppSelector(selectCurrentUser);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [hasCommentOnly, setHasCommentOnly] = useState(false);
  const [notAnsweredOnly, setNotAnsweredOnly] = useState(false);
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const lecturerId = Number(currentUser?.id);

    if (!Number.isInteger(lecturerId) || lecturerId <= 0) {
      setIsLoading(false);
      setError("Cannot identify lecturer account.");
      return;
    }

    let mounted = true;
    setIsLoading(true);
    setError("");

    communicationService
      .getLecturerReviewsAPI(lecturerId, {
        page,
        limit: itemsPerPage,
        rating: ratingFilter === "all" ? undefined : Number(ratingFilter),
      })
      .then((data) => {
        if (!mounted) return;
        setReviews(data);
      })
      .catch((err: any) => {
        if (!mounted) return;
        setError(err?.message || "Failed to load reviews.");
      })
      .finally(() => {
        if (!mounted) return;
        setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [currentUser?.id, page, itemsPerPage, ratingFilter]);

  const displayReviews = useMemo(() => {
    let data = [...reviews];

    if (hasCommentOnly) {
      data = data.filter((item) => item.hasComment);
    }

    if (notAnsweredOnly) {
      data = data.filter((item) => !item.isAnswered);
    }

    if (ratingFilter !== "all") {
      data = data.filter((item) => String(item.rating) === ratingFilter);
    }

    data.sort((a, b) => {
      if (sortBy === "highest") return b.rating - a.rating;
      if (sortBy === "lowest") return a.rating - b.rating;

      const ta = new Date(a.postedDate).getTime();
      const tb = new Date(b.postedDate).getTime();
      if (sortBy === "oldest") return ta - tb;
      return tb - ta;
    });

    return data;
  }, [reviews, hasCommentOnly, notAnsweredOnly, ratingFilter, sortBy]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={star <= rating ? "text-yellow-400" : "text-gray-300"}>
            ★
          </span>
        ))}
      </div>
    );
  };

  const handleReply = (reviewId: number) => {
    setReplyingTo(reviewId);
  };

  const handleSendReply = () => {
    console.log("Reply:", replyText);
    setReplyText("");
    setReplyingTo(null);
  };

  const handleCancelReply = () => {
    setReplyText("");
    setReplyingTo(null);
  };

  return (
    <div className="w-full">
      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 font-poppins text-sm text-[#475569]">
          <input
            type="checkbox"
            checked={hasCommentOnly}
            onChange={(e) => setHasCommentOnly(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 bg-white"
          />
          Has a Comment
        </label>
        <label className="flex items-center gap-2 font-poppins text-sm text-[#475569]">
          <input
            type="checkbox"
            checked={notAnsweredOnly}
            onChange={(e) => setNotAnsweredOnly(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 bg-white"
          />
          Not Answered
        </label>
        
        <div className="ml-auto flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-poppins text-sm text-[#475569]">Rating:</span>
            <select
              value={ratingFilter}
              onChange={(e) => {
                setPage(1);
                setRatingFilter(e.target.value);
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
              onChange={(e) => setSortBy(e.target.value)}
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

      {/* Reviews List */}
      <div className="space-y-4">
        {isLoading && (
          <div className="rounded-xl border border-gray-200 bg-white p-6 font-poppins text-sm text-[#475569]">
            Loading reviews...
          </div>
        )}

        {!isLoading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 font-poppins text-sm text-red-600">
            {error}
          </div>
        )}

        {!isLoading && !error && displayReviews.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-6 font-poppins text-sm text-[#475569]">
            No reviews found.
          </div>
        )}

        {displayReviews.map((review) => (
          <div key={review.id} className="rounded-xl border border-gray-200 bg-white p-6">
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
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                  <div>
                    <p className="font-poppins text-sm font-medium text-[#000000]">{review.studentName}</p>
                    <p className="font-poppins text-xs text-[#475569]">{formatRelativeDate(review.postedDate)}</p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <button
                  onClick={() => setOpenMenuId(openMenuId === review.id ? null : review.id)}
                  className="text-xl text-[#475569] hover:text-[#000000]"
                >
                  •••
                </button>
                {openMenuId === review.id && (
                  <div className="absolute right-0 top-8 z-10 w-32 overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/5">
                    <button
                      onClick={() => {
                        console.log("Report review:", review.id);
                        setOpenMenuId(null);
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 font-poppins text-sm text-[#FF0000] hover:bg-gray-50"
                    >
                      <span>🚨</span> Report
                    </button>
                  </div>
                )}
              </div>
            </div>

            <p className="mb-4 font-poppins text-sm text-[#475569]">{review.comment}</p>

            {replyingTo === review.id ? (
              <div className="mt-4">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
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
                    className="rounded-lg bg-[#3B82F6] px-4 py-2 font-poppins text-sm font-medium text-white transition-colors hover:bg-blue-600"
                  >
                    Send
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => handleReply(review.id)}
                className="flex items-center gap-2 font-poppins text-sm text-[#FF0000] hover:text-red-700"
              >
                <span>↩</span> Reply
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-center gap-2">
        <button
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page === 1 || isLoading}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 bg-white font-poppins text-sm text-[#475569] hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          &lt;
        </button>
        <button className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-[#3B82F6] px-3 font-poppins text-sm text-white">
          {page}
        </button>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={isLoading || displayReviews.length < itemsPerPage}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 bg-white font-poppins text-sm text-[#475569] hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default Reviews;
