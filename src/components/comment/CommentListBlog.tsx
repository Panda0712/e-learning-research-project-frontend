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
    <div className={`rounded-xl bg-white p-3 ${level > 0 ? "ml-4 mt-2" : ""}`}>
      <div className="mb-2 flex items-center justify-between gap-3">
        <h4 className="text-base font-bold text-gray-900">{getDisplayName(comment)}</h4>
        <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
      </div>

      <p className="mb-2 text-sm leading-relaxed text-gray-600 whitespace-pre-wrap wrap-break-word">
        {visibleContent || "(No content)"}
      </p>

      {isLongContent ? (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="mb-3 text-xs font-semibold text-[#2563EB] hover:underline"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      ) : null}

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => onReply(comment.id)}
          className="flex items-center gap-1 text-xs font-bold text-[#FF6B6B] hover:underline"
        >
          <Reply size={16} /> Reply
        </button>

        {canModerate && currentUserId !== comment.userId && onBanUser ? (
          <button
            type="button"
            onClick={() => onBanUser(comment.userId, Boolean(comment.isBannedUser))}
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
        <div className="mt-2 space-y-2 border-l border-gray-200 pl-3">
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
    <div className="mb-12 rounded-xl bg-[#F5F5F5] p-5">
      <h3 className="mb-4 text-xl font-bold">Comments</h3>

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
          <div className="rounded-lg bg-white p-4 text-sm text-gray-600">
            No comments yet. Be the first to comment.
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default CommentList;
