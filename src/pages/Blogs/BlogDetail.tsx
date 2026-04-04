/* eslint-disable @typescript-eslint/no-explicit-any */
import { Calendar, User } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import CommentList from "../../components/comment/CommentListBlog";
import Sidebar from "../../components/ui/SideBar";
import { useEffect, useState } from "react";
import { blogApi } from "../../apis/blog";
import { toast } from "react-toastify";
import Loading from "../../components/ui/Loading";
import { useAppSelector } from "../../redux/hooks";
import { selectCurrentUser } from "../../redux/activeUser/activeUserSlice";
import type { BlogCommentItem } from "../../types/adminBlog.type";

interface BlogData {
  id: number;
  title: string;
  image: string;
  date: string;
  author: string;
  content: string;
  category: string;
  authorId: number;
}

interface RelatedBlogData {
  id: number;
  title: string;
  image: string;
  date?: string;
}

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentUser = useAppSelector(selectCurrentUser);

  const [blog, setBlog] = useState<BlogData | null>(null);
  const [comments, setComments] = useState<BlogCommentItem[]>([]);
  const [commentContent, setCommentContent] = useState("");
  const [replyToCommentId, setReplyToCommentId] = useState<number | null>(null);
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [relatedBlogs, setRelatedBlogs] = useState<RelatedBlogData[]>([]);
  const [loading, setLoading] = useState(true);

  const currentUserId = Number(currentUser?.id || 0);
  const normalizedRole = String(currentUser?.role || "")
    .trim()
    .toLowerCase();

  const canModerate =
    Boolean(currentUserId) &&
    (normalizedRole === "admin" || currentUserId === blog?.authorId);

  const fetchComments = async (blogId: number) => {
    const commentData = await blogApi.getBlogCommentsAPI(blogId);
    setComments(commentData || []);
  };

  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        setLoading(true);
        if (id) {
          const [data, allBlogsResponse] = await Promise.all([
            blogApi.getBlogDetailAPI(id),
            blogApi.getAllBlogPostsAPI(),
          ]);

          setBlog(data);
          await fetchComments(Number(id));

          const normalizedAllBlogs = Array.isArray(allBlogsResponse)
            ? allBlogsResponse
            : Array.isArray(allBlogsResponse?.data)
              ? allBlogsResponse.data
              : [];

          const recentPosts = normalizedAllBlogs
            .filter((item: any) => Number(item?.id) !== Number(id))
            .slice(0, 6)
            .map((item: any) => ({
              id: Number(item?.id),
              title: item?.title || "Untitled blog",
              image:
                item?.image ||
                item?.thumbnail?.fileUrl ||
                "/icons/no-image.png",
              date: item?.date || item?.createdAt,
            }));

          setRelatedBlogs(recentPosts);
        }
      } catch (error: any) {
        toast.error(error?.message || "Failed to get blog detail data!");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogDetail();
  }, [id]);

  const handleCommentSubmit = async () => {
    if (!blog?.id) return;

    if (!currentUserId) {
      toast.info("Please login to comment.");
      navigate("/auth/login");
      return;
    }

    if (!commentContent.trim()) {
      toast.error("Comment content is required.");
      return;
    }

    try {
      setCommentSubmitting(true);
      await blogApi.createBlogCommentAPI({
        blogId: blog.id,
        content: commentContent.trim(),
        parentId: replyToCommentId || undefined,
      });

      toast.success(replyToCommentId ? "Reply posted." : "Comment posted.");
      setCommentContent("");
      setReplyToCommentId(null);
      await fetchComments(blog.id);
    } catch (error: any) {
      toast.error(error?.message || "Failed to submit comment.");
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleBanUser = async (userId: number, isBanned: boolean) => {
    if (!blog?.id) return;
    try {
      if (isBanned) {
        await blogApi.unbanCommentUserAPI(blog.id, userId);
        toast.success("User unbanned successfully.");
      } else {
        await blogApi.banCommentUserAPI(blog.id, userId);
        toast.success("User banned from commenting.");
      }
      await fetchComments(blog.id);
    } catch (error: any) {
      toast.error(error?.message || "Failed to update ban status.");
    }
  };

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#f7f9fc_0%,#ffffff_28%,#f7f4ff_100%)]">
        <Loading caption="Loading blog detail data..." />
      </div>
    );
  if (!blog)
    return (
      <div className="py-10 text-center">
        Blog detail not found! Please try again later!
      </div>
    );

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7f9fc_0%,#ffffff_28%,#f7f4ff_100%)]">
      <div className="px-4 pb-16 pt-6 sm:px-8 lg:px-12 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-4xl border border-white/70 bg-white/84 p-6 shadow-[0_24px_80px_rgba(34,40,84,0.08)] backdrop-blur-sm sm:p-8 lg:p-10">
            <div className="flex flex-wrap items-center gap-2 text-sm font-medium">
              <span className="cursor-pointer text-[#64748B] hover:text-[#19566A]">
                Home
              </span>
              <span className="text-[#94A3B8]">/</span>
              <span className="text-[#64748B]">Blog</span>
              <span className="text-[#94A3B8]">/</span>
              <span className="text-[#19566A]">Blog Detail</span>
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="min-w-0">
                <div className="rounded-[30px] border border-white/80 bg-white/92 p-6 shadow-[0_18px_55px_rgba(34,40,84,0.08)] md:p-8">
                  <div className="mb-5 flex flex-wrap items-center gap-3 text-sm font-medium">
                    <span className="inline-flex rounded-full border border-[#704FE6]/15 bg-[#704FE6]/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#704FE6]">
                      {blog.category}
                    </span>
                    <div className="flex items-center gap-2 rounded-full bg-[#F8FAFC] px-4 py-2 text-[#64748B]">
                      <Calendar size={16} className="text-[#704FE6]" />
                      <span className="font-poppins text-[12px] font-medium">
                        {blog.date}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 rounded-full bg-[#F8FAFC] px-4 py-2 text-[#64748B]">
                      <User size={16} className="text-[#704FE6]" />
                      <span className="font-poppins text-[12px] font-medium">
                        {blog.author}
                      </span>
                    </div>
                  </div>

                  <h1 className="mb-6 text-3xl font-semibold leading-tight text-[#163541] md:text-5xl">
                    {blog.title}
                  </h1>

                  <div className="mb-8 overflow-hidden rounded-[28px] border border-[#E7ECF3] bg-[#F8FAFC]">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="h-80 w-full object-cover md:h-105"
                    />
                  </div>

                  <div className="prose prose-slate max-w-none text-[16px] leading-8 text-[#475569] prose-headings:text-[#163541] prose-strong:text-[#163541] prose-a:text-[#19566A]">
                    <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                  </div>
                </div>

                <div className="mt-8">
                  <CommentList
                    comments={comments}
                    onReply={(commentId) => setReplyToCommentId(commentId)}
                    onBanUser={handleBanUser}
                    currentUserId={currentUserId}
                    canModerate={canModerate}
                  />
                </div>

                <div className="rounded-[30px] border border-white/80 bg-white/92 p-6 shadow-[0_18px_55px_rgba(34,40,84,0.08)] md:p-8">
                  <span className="inline-flex rounded-full border border-[#704FE6]/15 bg-[#704FE6]/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#704FE6]">
                    Join the discussion
                  </span>
                  <h3 className="mb-3 mt-5 text-2xl font-semibold text-[#163541]">
                    Leave A Comment
                  </h3>

                  <p className="mb-6 text-sm leading-7 text-[#64748B]">
                    {currentUserId
                      ? "Share your thoughts with other learners and lecturers."
                      : "You need to login to leave a comment."}
                  </p>

                  <div className="space-y-5">
                    {replyToCommentId ? (
                      <div className="rounded-2xl bg-[#FFF7ED] px-4 py-3 text-sm text-[#C2410C]">
                        Replying to comment #{replyToCommentId}
                        <button
                          type="button"
                          onClick={() => setReplyToCommentId(null)}
                          className="ml-3 font-semibold underline"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : null}
                    <textarea
                      placeholder="Comment"
                      rows={5}
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      disabled={!currentUserId || commentSubmitting}
                      className="w-full rounded-3xl border border-[#D8E1EA] bg-[#FBFCFE] p-4 text-[#475569] outline-none transition focus:border-[#704FE6]/25 focus:ring-4 focus:ring-[#704FE6]/8 placeholder:text-[#94A3B8]"
                    />

                    <button
                      type="button"
                      onClick={handleCommentSubmit}
                      disabled={commentSubmitting}
                      className="rounded-full bg-[linear-gradient(135deg,#704FE6_0%,#5B3FD2_100%)] px-8 py-3 text-white shadow-[0_16px_32px_rgba(112,79,230,0.22)] transition-opacity hover:opacity-90 disabled:opacity-60 font-bold"
                    >
                      {currentUserId
                        ? commentSubmitting
                          ? "Submitting..."
                          : replyToCommentId
                            ? "Reply"
                            : "Post Comment"
                        : "Login To Comment"}
                    </button>
                  </div>
                </div>
              </div>

              <Sidebar recentPosts={relatedBlogs} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
