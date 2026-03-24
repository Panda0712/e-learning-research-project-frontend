import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  blogApi,
  type AdminBlogDetailResponse,
  type AdminBlogItem,
  type AdminBlogPayload,
  type BlogCategoryItem,
} from "../../../apis/blog";
import { permissions } from "../../../configs/rbacConfig";
import { usePermission } from "../../../hooks/usePermission";
import { selectCurrentUser } from "../../../redux/activeUser/activeUserSlice";
import { useAppSelector } from "../../../redux/hooks";
import { ACCOUNT_ROLES } from "../../../utils/constants";

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const authorName = (post: AdminBlogItem) => {
  const fullName = `${post.author?.firstName || ""} ${post.author?.lastName || ""}`.trim();
  return fullName || post.author?.email || "-";
};

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString();
};

type FormState = {
  title: string;
  slug: string;
  content: string;
  categoryId: number;
  thumbnailUrl: string;
};

const emptyForm: FormState = {
  title: "",
  slug: "",
  content: "",
  categoryId: 0,
  thumbnailUrl: "",
};

const DashboardBlog = () => {
  const currentUser = useAppSelector(selectCurrentUser);
  const { hasPermission } = usePermission(currentUser?.role || "");

  const canManageBlog =
    currentUser?.role === ACCOUNT_ROLES.ADMIN &&
    hasPermission(permissions.VIEW_DASHBOARD_ADMIN);

  const [posts, setPosts] = useState<AdminBlogItem[]>([]);
  const [categories, setCategories] = useState<BlogCategoryItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [totalPosts, setTotalPosts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [detailData, setDetailData] = useState<AdminBlogDetailResponse | null>(null);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const [form, setForm] = useState<FormState>(emptyForm);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalPosts / itemsPerPage)),
    [totalPosts, itemsPerPage],
  );

  const fetchPosts = async () => {
    if (!canManageBlog) return;

    try {
      setIsLoading(true);
      setError(null);

      const res = await blogApi.getAdminBlogPostsAPI({
        page: currentPage,
        itemsPerPage,
      });

      setPosts(res.posts);
      setTotalPosts(res.totalPosts);
    } catch (apiError: any) {
      setError(apiError?.message || "Failed to load blog posts.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await blogApi.getBlogCategoriesAPI();
      setCategories(res);
    } catch {
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [currentPage, itemsPerPage, canManageBlog]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const openCreate = () => {
    if (!canManageBlog) return;
    setForm({
      ...emptyForm,
      categoryId: categories[0]?.id || 0,
    });
    setIsCreateOpen(true);
  };

  const closeCreate = () => {
    setIsCreateOpen(false);
    setForm(emptyForm);
  };

  const openDetail = async (postId: number) => {
    if (!canManageBlog) return;

    try {
      setOpenMenuId(null);
      setSelectedPostId(postId);
      setIsDetailOpen(true);
      setIsDetailLoading(true);
      setDetailError(null);

      const data = await blogApi.getAdminBlogDetailAPI(postId);
      setDetailData(data);
    } catch (apiError: any) {
      const message = apiError?.message || "Failed to load blog detail.";
      setDetailError(message);
      toast.error(message);
    } finally {
      setIsDetailLoading(false);
    }
  };

  const closeDetail = () => {
    setIsDetailOpen(false);
    setSelectedPostId(null);
    setDetailData(null);
    setDetailError(null);
  };

  const openEdit = async (postId: number) => {
    if (!canManageBlog) return;

    try {
      setOpenMenuId(null);
      const data = await blogApi.getAdminBlogDetailAPI(postId);
      setSelectedPostId(postId);
      setForm({
        title: data.title || "",
        slug: data.slug || toSlug(data.title || ""),
        content: data.content || "",
        categoryId: data.category?.id || categories[0]?.id || 0,
        thumbnailUrl: data.thumbnail?.fileUrl || "",
      });
      setIsEditOpen(true);
    } catch (apiError: any) {
      toast.error(apiError?.message || "Failed to load blog for editing.");
    }
  };

  const closeEdit = () => {
    setIsEditOpen(false);
    setSelectedPostId(null);
    setForm(emptyForm);
  };

  const handleCreate = async () => {
    if (!canManageBlog) return;
    if (!form.title || !form.slug || !form.content || !form.categoryId || !form.thumbnailUrl) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload: AdminBlogPayload = {
        title: form.title,
        slug: form.slug,
        content: form.content,
        categoryId: form.categoryId,
        thumbnail: {
          publicId: `admin-blog-${Date.now()}`,
          fileUrl: form.thumbnailUrl,
        },
      };

      await blogApi.createAdminBlogPostAPI(payload);
      toast.success("Blog created successfully.");
      closeCreate();
      fetchPosts();
    } catch (apiError: any) {
      toast.error(apiError?.message || "Failed to create blog.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (!canManageBlog || !selectedPostId) return;
    if (!form.title || !form.content || !form.categoryId) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      setIsSubmitting(true);

      const updatePayload: Partial<AdminBlogPayload> = {
        title: form.title,
        content: form.content,
        categoryId: form.categoryId,
      };

      if (form.thumbnailUrl) {
        updatePayload.thumbnail = {
          publicId: `admin-blog-${Date.now()}`,
          fileUrl: form.thumbnailUrl,
        };
      }

      await blogApi.updateAdminBlogPostAPI(selectedPostId, updatePayload);
      toast.success("Blog updated successfully.");
      closeEdit();
      fetchPosts();

      if (isDetailOpen && selectedPostId) {
        const data = await blogApi.getAdminBlogDetailAPI(selectedPostId);
        setDetailData(data);
      }
    } catch (apiError: any) {
      toast.error(apiError?.message || "Failed to update blog.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!canManageBlog) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] p-8">
        <h1 className="mb-6 font-inter text-4xl font-bold text-black">Blog</h1>
        <div className="rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-700">
          You do not have permission to manage blogs.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-inter text-4xl font-bold text-black">Blog</h1>
        <div className="flex items-center gap-3">
          <select
            value={itemsPerPage}
            onChange={(event) => {
              setItemsPerPage(Number(event.target.value));
              setCurrentPage(1);
            }}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            {[5, 8, 10, 20].map((num) => (
              <option key={num} value={num}>
                {num}/page
              </option>
            ))}
          </select>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 rounded-lg bg-[#FFD900] px-6 py-3 font-poppins text-sm font-medium text-black transition hover:bg-[#e6c300]"
          >
            <span className="text-xl">+</span>
            Create New Blog
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 flex items-center justify-between rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>
          <button
            onClick={fetchPosts}
            className="rounded-md bg-white px-3 py-1 font-medium text-red-700"
          >
            Retry
          </button>
        </div>
      )}

      <div className="overflow-hidden rounded-lg bg-white shadow">
        <table className="w-full border-collapse">
          <thead className="bg-[#9D9D9D]">
            <tr>
              <th className="border-r border-gray-200 px-6 py-4 text-left text-sm font-medium text-black">Thumbnail</th>
              <th className="border-r border-gray-200 px-6 py-4 text-left text-sm font-medium text-black">Title</th>
              <th className="border-r border-gray-200 px-6 py-4 text-left text-sm font-medium text-black">Author</th>
              <th className="border-r border-gray-200 px-6 py-4 text-left text-sm font-medium text-black">Category</th>
              <th className="border-r border-gray-200 px-6 py-4 text-left text-sm font-medium text-black">Date</th>
              <th className="border-r border-gray-200 px-6 py-4 text-left text-sm font-medium text-black">Comments</th>
              <th className="px-6 py-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading &&
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={`loading-${idx}`}>
                  <td className="px-6 py-4"><div className="h-12 w-16 animate-pulse rounded bg-gray-200" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-48 animate-pulse rounded bg-gray-200" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-28 animate-pulse rounded bg-gray-200" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-24 animate-pulse rounded bg-gray-200" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-20 animate-pulse rounded bg-gray-200" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-8 animate-pulse rounded bg-gray-200" /></td>
                  <td className="px-6 py-4" />
                </tr>
              ))}

            {!isLoading && posts.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500">
                  No blogs found.
                </td>
              </tr>
            )}

            {!isLoading &&
              posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="border-r border-gray-200 px-6 py-4">
                    <div className="h-12 w-16 overflow-hidden rounded bg-[#0F172A]">
                      {post.thumbnail?.fileUrl ? (
                        <img src={post.thumbnail.fileUrl} alt={post.title} className="h-full w-full object-cover" />
                      ) : null}
                    </div>
                  </td>
                  <td className="border-r border-gray-200 px-6 py-4 text-sm text-black">
                    <button
                      onClick={() => openDetail(post.id)}
                      className="text-left hover:text-blue-600"
                    >
                      {post.title}
                    </button>
                  </td>
                  <td className="border-r border-gray-200 px-6 py-4 text-sm text-black">{authorName(post)}</td>
                  <td className="border-r border-gray-200 px-6 py-4 text-sm text-black">{post.category?.name || "-"}</td>
                  <td className="border-r border-gray-200 px-6 py-4 text-sm text-black">{formatDate(post.createdAt)}</td>
                  <td className="border-r border-gray-200 px-6 py-4 text-sm text-black">{post._count?.comments || 0}</td>
                  <td className="relative px-6 py-4">
                    <button
                      onClick={() => setOpenMenuId((prev) => (prev === post.id ? null : post.id))}
                      className="text-2xl font-bold text-black hover:text-gray-600"
                    >
                      ...
                    </button>
                    {openMenuId === post.id && (
                      <div className="absolute right-8 top-12 z-10 w-36 overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/10">
                        <button
                          onClick={() => openDetail(post.id)}
                          className="flex w-full items-center gap-2 px-4 py-2 text-sm text-black hover:bg-gray-100"
                        >
                          View Detail
                        </button>
                        <button
                          onClick={() => openEdit(post.id)}
                          className="flex w-full items-center gap-2 px-4 py-2 text-sm text-black hover:bg-gray-100"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {!isLoading && posts.length > 0 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-sm text-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            &lt;
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm ${
                currentPage === pageNum
                  ? "bg-[#3B82F6] text-white"
                  : "border border-gray-300 bg-white text-black"
              }`}
            >
              {pageNum}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-sm text-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            &gt;
          </button>
        </div>
      )}

      {(isCreateOpen || isEditOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-3xl rounded-xl bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold text-black">
              {isCreateOpen ? "Create Blog" : "Edit Blog"}
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm text-gray-600">Title *</label>
                <input
                  value={form.title}
                  onChange={(event) => {
                    const title = event.target.value;
                    setForm((prev) => ({
                      ...prev,
                      title,
                      slug: isCreateOpen ? toSlug(title) : prev.slug,
                    }));
                  }}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-600">Slug *</label>
                <input
                  value={form.slug}
                  onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-600">Category *</label>
                <select
                  value={form.categoryId}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, categoryId: Number(event.target.value) }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                >
                  <option value={0}>Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm text-gray-600">Thumbnail URL *</label>
                <input
                  value={form.thumbnailUrl}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, thumbnailUrl: event.target.value }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  placeholder="https://..."
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm text-gray-600">Content *</label>
                <textarea
                  value={form.content}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, content: event.target.value }))
                  }
                  rows={8}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={isCreateOpen ? closeCreate : closeEdit}
                disabled={isSubmitting}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={isCreateOpen ? handleCreate : handleEdit}
                disabled={isSubmitting}
                className="rounded-lg bg-[#3B82F6] px-4 py-2 text-sm text-white"
              >
                {isSubmitting ? "Processing..." : isCreateOpen ? "Create" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isDetailOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-auto rounded-xl bg-white">
            <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
              <h2 className="text-lg font-semibold text-black">Blog Detail</h2>
              <button
                onClick={closeDetail}
                className="rounded-md bg-gray-100 px-3 py-1.5 text-sm text-gray-700"
              >
                Close
              </button>
            </div>

            <div className="p-6">
              {isDetailLoading && <p className="text-sm text-gray-600">Loading detail...</p>}
              {detailError && <p className="text-sm text-red-600">{detailError}</p>}

              {!isDetailLoading && !detailError && detailData && (
                <div className="space-y-5">
                  <div className="rounded-lg border border-gray-200 p-4">
                    <h3 className="mb-2 text-lg font-semibold text-black">{detailData.title}</h3>
                    <p className="text-sm text-gray-600">
                      Author: {authorName(detailData)} | Category: {detailData.category?.name || "-"}
                    </p>
                    <p className="text-sm text-gray-600">Created: {formatDate(detailData.createdAt)}</p>
                  </div>

                  {detailData.thumbnail?.fileUrl && (
                    <div className="overflow-hidden rounded-lg border border-gray-200">
                      <img
                        src={detailData.thumbnail.fileUrl}
                        alt={detailData.title}
                        className="max-h-72 w-full object-cover"
                      />
                    </div>
                  )}

                  <div className="rounded-lg border border-gray-200 p-4">
                    <h4 className="mb-2 font-semibold text-black">Content</h4>
                    <p className="whitespace-pre-wrap text-sm text-gray-700">{detailData.content || "-"}</p>
                  </div>

                  <div className="rounded-lg border border-gray-200 p-4">
                    <h4 className="mb-2 font-semibold text-black">
                      Comments ({detailData._count?.comments || 0})
                    </h4>
                    {detailData.comments && detailData.comments.length > 0 ? (
                      <div className="space-y-2">
                        {detailData.comments.slice(0, 8).map((comment) => (
                          <div key={comment.id} className="rounded-md bg-gray-50 p-3 text-sm text-gray-700">
                            <p className="font-medium text-gray-900">
                              {`${comment.user?.firstName || ""} ${comment.user?.lastName || ""}`.trim() ||
                                comment.user?.email ||
                                "User"}
                            </p>
                            <p className="mt-1">{comment.content || "-"}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No comments.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardBlog;
