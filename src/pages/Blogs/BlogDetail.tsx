/* eslint-disable @typescript-eslint/no-explicit-any */
import { Calendar, User } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AuthorBox from "../../components/box/AuthorBox";
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
      } catch (error:any) {
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
      <div className="flex items-center justify-center">
        <Loading caption="Loading blog detail data..." />
      </div>
    );
  if (!blog) return <div className="text-center py-10">Blog detail not found! Please try again later!</div>;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="w-full h-12.5 bg-[#F5F5F5] flex items-center mb-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="text-[#555555] cursor-pointer hover:underline">
              Home
            </span>
            <span className="text-[#9D9D9D] mx-1">{">"}</span>
            <span className="text-[#9D9D9D]">Blog</span>
            <span className="text-[#9D9D9D] mx-1">{">"}</span>
            <span className="text-[#9D9D9D]">Blog Detail</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16 flex flex-col lg:flex-row gap-10 max-w-7xl">
        <div className="w-full lg:w-3/4">
          <div className="flex items-center gap-6 text-gray-500 text-sm font-medium mb-4">
            <div className="flex items-center gap-2 ">
              <Calendar size={18} className="text-[#FF6B6B]" />
              <span className="font-medium font-poppins text-[#333931] text-[10px]">
                {blog.date}
              </span>
            </div>

            <div className="flex items-center gap-2 text-gray-500">
              <User size={18} className="text-[#FF6B6B]" />
              <span className="font-medium font-poppins text-[#333931] text-[10px]">
                {blog.author}
              </span>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight">
            {blog.title}
          </h1>

          <div className="prose max-w-none text-gray-700 leading-relaxed text-[16px]">
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          </div>


          <CommentList
            comments={comments}
            onReply={(commentId) => setReplyToCommentId(commentId)}
            onBanUser={handleBanUser}
            currentUserId={currentUserId}
            canModerate={canModerate}
          />

          {/* Comment */}
          <div className="pt-8 border-t border-gray-100">
            <h3 className="text-xl font-bold mb-4 text-black">
              Leave A Comment
            </h3>

            <p className="text-[#555555] mb-6 text-sm">
              {currentUserId
                ? "Share your thoughts with other learners and lecturers."
                : "You need to login to leave a comment."}
            </p>

            <div className="space-y-5">
              {replyToCommentId ? (
                <div className="rounded-lg bg-orange-50 px-3 py-2 text-sm text-orange-700">
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
                className="border border-[#9D9D9D] p-3 rounded-md w-full focus:outline-none focus:border-[#FF782D] placeholder-[#9D9D9D] text-[#555555]"
              />

              <button
                type="button"
                onClick={handleCommentSubmit}
                disabled={commentSubmitting}
                className="bg-[#FF782D] text-white px-8 py-3 rounded-full font-bold hover:opacity-90 transition-opacity shadow-sm disabled:opacity-60"
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
  );
};

export default BlogDetail;
