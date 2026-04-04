import { Reply } from "lucide-react";
import { useState } from "react";
import type { BlogCommentItem } from "../../types/adminBlog.type";

interface CommentListProps {
  comments: BlogCommentItem[];
  onReply: (commentId: number) => void;
  onBanUser?: (userId: number, isBanned: boolean) => void;
  currentUserId?: number;
  canModerate?: boolean;
}

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
};

const getDisplayName = (comment: BlogCommentItem) => {
  const firstName = comment.user?.firstName || "";
  const lastName = comment.user?.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim();
  return fullName || comment.user?.email || `User #${comment.userId}`;
};

const COMMENT_PREVIEW_LIMIT = 220;

const CommentNode = ({
  comment,
  replies,
  onReply,
  onBanUser,
  currentUserId,
  canModerate,
  level = 0,
}: {
  comment: BlogCommentItem;
  replies: BlogCommentItem[];
  onReply: (commentId: number) => void;
  onBanUser?: (userId: number, isBanned: boolean) => void;
  currentUserId?: number;
  canModerate?: boolean;
  level?: number;
}) => {
  const [expanded, setExpanded] = useState(false);
  const childComments = replies.filter((item) => item.parentId === comment.id);
  const content = String(comment.content || "").trim();
  const isLongContent = content.length > COMMENT_PREVIEW_LIMIT;
  const visibleContent =
    expanded || !isLongContent
      ? content
      : `${content.slice(0, COMMENT_PREVIEW_LIMIT).trimEnd()}...`;

  return (
    <div
      className={`rounded-[22px] border border-[#E7ECF3] bg-[linear-gradient(145deg,#ffffff_0%,#fbfcff_100%)] p-4 shadow-[0_10px_24px_rgba(34,40,84,0.04)] ${
        level > 0 ? "ml-4 mt-3" : ""
      }`}
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <h4 className="text-base font-bold text-[#163541]">
          {getDisplayName(comment)}
        </h4>
        <span className="text-xs text-[#94A3B8]">
          {formatDate(comment.createdAt)}
        </span>
      </div>

      <p className="mb-2 text-sm leading-7 text-[#64748B] whitespace-pre-wrap wrap-break-word">
        {visibleContent || "(No content)"}
      </p>

      {isLongContent ? (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="mb-3 text-xs font-semibold text-[#19566A] hover:underline"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      ) : null}

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => onReply(comment.id)}
          className="flex items-center gap-1 text-xs font-bold text-[#704FE6] hover:underline"
        >
          <Reply size={16} /> Reply
        </button>

        {canModerate && currentUserId !== comment.userId && onBanUser ? (
          <button
            type="button"
            onClick={() =>
              onBanUser(comment.userId, Boolean(comment.isBannedUser))
            }
            className="text-xs font-semibold text-red-600 hover:underline"
          >
            {comment.isBannedUser ? "Unban" : "Ban user"}
          </button>
        ) : null}

        {comment.isBannedUser ? (
          <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">
            Banned from commenting
          </span>
        ) : null}
      </div>

      {childComments.length > 0 ? (
        <div className="mt-3 space-y-3 border-l border-[#E2E8F0] pl-4">
          {childComments.map((reply) => (
            <CommentNode
              key={reply.id}
              comment={reply}
              replies={replies}
              onReply={onReply}
              onBanUser={onBanUser}
              currentUserId={currentUserId}
              canModerate={canModerate}
              level={level + 1}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};

const CommentList = ({
  comments,
  onReply,
  onBanUser,
  currentUserId,
  canModerate,
}: CommentListProps) => {
  const rootComments = comments.filter((comment) => !comment.parentId);

  return (
    <div className="mb-12 rounded-[28px] border border-white/80 bg-white/92 p-5 shadow-[0_18px_55px_rgba(34,40,84,0.08)] md:p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <span className="inline-flex rounded-full border border-[#704FE6]/15 bg-[#704FE6]/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#704FE6]">
            Discussion
          </span>
          <h3 className="mt-4 text-2xl font-semibold text-[#163541]">
            Comments
          </h3>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto no-scrollbar pr-1">
        <div className="flex flex-col gap-3">
          {rootComments.length ? (
            rootComments.map((comment) => (
              <CommentNode
                key={comment.id}
                comment={comment}
                replies={comments}
                onReply={onReply}
                onBanUser={onBanUser}
                currentUserId={currentUserId}
                canModerate={canModerate}
              />
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-5 text-sm text-[#64748B]">
              No comments yet. Be the first to comment.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentList;
