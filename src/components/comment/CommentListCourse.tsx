import { Reply } from "lucide-react";
import type { Review } from "../../types/course.type";
import Button from "../ui/Button";

interface Props {
  reviews: Review[];
  canReply?: boolean;
  replyingToId?: number | null;
  replyValue?: string;
  isReplySubmitting?: boolean;
  onReplyStart?: (review: Review) => void;
  onReplyChange?: (value: string) => void;
  onReplyCancel?: () => void;
  onReplySubmit?: (review: Review) => void | Promise<void>;
}

const CommentList = ({
  reviews,
  canReply = false,
  replyingToId = null,
  replyValue = "",
  isReplySubmitting = false,
  onReplyStart,
  onReplyChange,
  onReplyCancel,
  onReplySubmit,
}: Props) => {
  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="rounded-[24px] border border-[#E7ECF3] bg-[linear-gradient(145deg,#ffffff_0%,#fbfcff_100%)] p-5 shadow-[0_12px_30px_rgba(34,40,84,0.04)] transition-colors hover:bg-[#FCFDFF]"
        >
          <div className="flex gap-4">
            <div className="shrink-0">
              <img
                src={review.avatar}
                alt={review.user}
                className="h-12 w-12 rounded-full border border-[#E2E8F0] object-cover"
              />
            </div>

            <div className="flex-1">
              <div className="mb-1 flex items-start justify-between">
                <h4 className="font-poppins text-sm font-bold text-[#163541] md:text-base">
                  {review.user}
                </h4>
                <span className="font-poppins text-xs text-[#94A3B8]">
                  {review.date}
                </span>
              </div>

              <p className="mb-3 font-poppins text-sm leading-7 text-[#64748B]">
                {review.content}
              </p>

              {review.lecturerReply && (
                <div className="mb-4 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-poppins text-sm font-semibold text-[#163541]">
                      Lecturer reply
                    </p>
                    {review.lecturerReplyAt ? (
                      <span className="font-poppins text-xs text-[#94A3B8]">
                        {review.lecturerReplyAt}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 font-poppins text-sm leading-7 text-[#475569]">
                    {review.lecturerReply}
                  </p>
                </div>
              )}

              {canReply && (
                <>
                  <Button
                    onClick={() => onReplyStart?.(review)}
                    content={
                      <div className="flex items-center gap-1">
                        <Reply size={14} /> Reply
                      </div>
                    }
                    additionalClass="!h-auto !w-auto !border-0 !bg-transparent !p-0 !text-xs !font-bold !text-[#94A3B8] !rounded-none transition-colors hover:!text-[#704FE6]"
                  />

                  {replyingToId === review.id && (
                    <div className="mt-4 rounded-2xl border border-[#E2E8F0] bg-white p-4">
                      <textarea
                        value={replyValue}
                        onChange={(event) => onReplyChange?.(event.target.value)}
                        placeholder="Write your reply to this student"
                        rows={3}
                        className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3 font-poppins text-sm text-[#0F172A] outline-none transition focus:border-[#704FE6] focus:bg-white"
                      />
                      <div className="mt-3 flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={onReplyCancel}
                          className="rounded-lg border border-[#CBD5E1] px-4 py-2 text-sm font-medium text-[#334155] transition hover:bg-[#F8FAFC]"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          disabled={isReplySubmitting}
                          onClick={() => onReplySubmit?.(review)}
                          className="rounded-lg bg-[#704FE6] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isReplySubmitting ? "Sending..." : "Send"}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
