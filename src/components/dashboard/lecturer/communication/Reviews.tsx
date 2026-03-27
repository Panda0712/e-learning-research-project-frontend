import { useMemo, useState } from "react";
import type { LecturerReviewItem } from "../../../../types/communication.type";

interface ReviewsProps {
  reviews: LecturerReviewItem[];
  loading: boolean;
  error: string | null;
  onRetry: () => void | Promise<void>;
}

const Reviews = ({ reviews, loading, error, onRetry }: ReviewsProps) => {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [onlyCommented, setOnlyCommented] = useState(false);
  const [onlyNotAnswered, setOnlyNotAnswered] = useState(false);

  const visibleReviews = useMemo(() => {
    return reviews.filter((review) => {
      if (onlyCommented && !review.hasComment) return false;
      if (onlyNotAnswered && review.isAnswered) return false;
      return true;
    });
  }, [reviews, onlyCommented, onlyNotAnswered]);

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
            checked={onlyCommented}
            onChange={(event) => setOnlyCommented(event.target.checked)}
            className="h-4 w-4 rounded border-gray-300 bg-white"
          />
          Has a Comment
        </label>
        <label className="flex items-center gap-2 font-poppins text-sm text-[#475569]">
          <input
            type="checkbox"
            checked={onlyNotAnswered}
            onChange={(event) => setOnlyNotAnswered(event.target.checked)}
            className="h-4 w-4 rounded border-gray-300 bg-white"
          />
          Not Answered
        </label>
        
        <div className="ml-auto flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-poppins text-sm text-[#475569]">Rating:</span>
            <select className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 font-poppins text-sm text-[#000000] focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All</option>
              <option>5 Stars</option>
              <option>4 Stars</option>
              <option>3 Stars</option>
              <option>2 Stars</option>
              <option>1 Star</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-poppins text-sm text-[#475569]">Sort by:</span>
            <select className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 font-poppins text-sm text-[#000000] focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Newest First</option>
              <option>Oldest First</option>
              <option>Highest Rating</option>
              <option>Lowest Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {loading && (
          <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-500">
            Loading reviews...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-sm text-red-700">
            <p>{error}</p>
            <button
              type="button"
              onClick={onRetry}
              className="mt-3 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && visibleReviews.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-500">
            No review data available.
          </div>
        )}

        {!loading &&
          !error &&
          visibleReviews.map((review) => (
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
                    <p className="font-poppins text-xs text-[#475569]">{new Date(review.postedDate).toLocaleString()}</p>
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

            <p className="mb-4 font-poppins text-sm text-[#475569]">
              {review.comment || "No comment content."}
            </p>

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
        <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 bg-white font-poppins text-sm text-[#475569] hover:bg-gray-50">
          &lt;
        </button>
        <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#3B82F6] font-poppins text-sm text-white">
          1
        </button>
        <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 bg-white font-poppins text-sm text-[#475569] hover:bg-gray-50">
          2
        </button>
        <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 bg-white font-poppins text-sm text-[#475569] hover:bg-gray-50">
          3
        </button>
        <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 bg-white font-poppins text-sm text-[#475569] hover:bg-gray-50">
          &gt;
        </button>
      </div>
    </div>
  );
};

export default Reviews;
