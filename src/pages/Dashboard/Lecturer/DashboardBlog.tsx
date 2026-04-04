/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { blogApi } from "../../../apis/blog";
import CreateBlogModal from "../../../components/dashboard/admin/blog/CreateBlogModal";
import Pagination from "../../../components/ui/Pagination";
import type {
  BlogCategoryItem,
  BlogPostItem,
  BlogPostStatus,
  BlogPostsPagination,
  UpsertBlogPostPayload,
} from "../../../types/adminBlog.type";
import { DEFAULT_ITEMS_PER_PAGE } from "../../../utils/constants";

const defaultPagination: BlogPostsPagination = {
  page: 1,
  itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
  total: 0,
  totalPages: 0,
};

const statusLabelMap: Record<BlogPostStatus, string> = {
  draft: "Draft",
  pending: "Pending Review",
  published: "Published",
  rejected: "Rejected",
  archived: "Archived",
};

const statusChipClassMap: Record<BlogPostStatus, string> = {
  draft: "bg-slate-100 text-slate-700",
  pending: "bg-amber-50 text-amber-700",
  published: "bg-emerald-50 text-emerald-700",
  rejected: "bg-rose-50 text-rose-700",
  archived: "bg-gray-100 text-gray-600",
};

const reviewFilters: Array<{ label: string; value: "all" | BlogPostStatus }> = [
  { label: "All", value: "all" },
  { label: "Draft", value: "draft" },
  { label: "Pending", value: "pending" },
  { label: "Published", value: "published" },
  { label: "Rejected", value: "rejected" },
];

const slugifyCategory = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const formatDateTime = (value?: string | null) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const DashboardLecturerBlog = () => {
  const [blogs, setBlogs] = useState<BlogPostItem[]>([]);
  const [categories, setCategories] = useState<BlogCategoryItem[]>([]);
  const [pagination, setPagination] = useState<BlogPostsPagination>(defaultPagination);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<"all" | BlogPostStatus>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingBlog, setEditingBlog] = useState<BlogPostItem | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [isCategorySubmitting, setIsCategorySubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      const response = await blogApi.getAllBlogCategoriesAPI();
      setCategories(Array.isArray(response) ? response : []);
    } catch (error: any) {
      toast.error(error?.message || "Failed to fetch blog categories.");
    }
  };

  const fetchBlogs = async (page: number, nextStatusFilter = statusFilter) => {
    try {
      setIsLoading(true);
      const response = await blogApi.getLecturerBlogPostsAPI({
        page,
        itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
        status: nextStatusFilter === "all" ? undefined : nextStatusFilter,
      });

      setBlogs(response?.data ?? []);
      setPagination(response?.pagination ?? defaultPagination);
    } catch (error: any) {
      toast.error(error?.message || "Failed to fetch blog posts.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchBlogs(currentPage);
  }, [currentPage, statusFilter]);

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBlog(null);
    setModalMode("create");
  };

  const closeCategoryModal = () => {
    setIsCategoryModalOpen(false);
    setCategoryName("");
    setCategorySlug("");
    setIsCategorySubmitting(false);
  };

  const handleCreate = () => {
    setModalMode("create");
    setEditingBlog(null);
    setIsModalOpen(true);
  };

  const handleCreateCategory = async () => {
    const trimmedName = categoryName.trim();
    const normalizedSlug = slugifyCategory(categorySlug || trimmedName);

    if (!trimmedName) {
      toast.error("Category name is required.");
      return;
    }

    if (!normalizedSlug) {
      toast.error("Category slug is invalid.");
      return;
    }

    try {
      setIsCategorySubmitting(true);
      await blogApi.createBlogCategoryAPI({
        name: trimmedName,
        slug: normalizedSlug,
      });
      toast.success("Created blog category successfully.");
      await fetchCategories();
      closeCategoryModal();
    } catch (error: any) {
      toast.error(error?.message || "Failed to create blog category.");
    } finally {
      setIsCategorySubmitting(false);
    }
  };

  const handleEdit = async (id: number) => {
    try {
      const detail = await blogApi.getLecturerBlogDetailAPI(String(id));
      setEditingBlog(detail);
      setModalMode("edit");
      setIsModalOpen(true);
    } catch (error: any) {
      toast.error(error?.message || "Failed to fetch blog detail.");
    }
    setOpenMenuId(null);
  };

  const handleDelete = async (id: number) => {
    setOpenMenuId(null);

    const accepted = window.confirm("Are you sure you want to delete this blog post?");
    if (!accepted) return;

    try {
      await blogApi.deleteBlogPostAPI(id);
      toast.success("Deleted blog post successfully.");
      await fetchBlogs(currentPage);
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete blog post.");
    }
  };

  const handleSubmitForReview = async (id: number) => {
    try {
      await blogApi.updateBlogPostAPI(id, { status: "pending" });
      toast.success("Submitted for admin review.");
      await fetchBlogs(currentPage);
    } catch (error: any) {
      toast.error(error?.message || "Failed to submit for review.");
    }
  };

  const handleArchive = async (id: number) => {
    try {
      await blogApi.updateBlogPostAPI(id, { status: "draft" });
      toast.success("Moved to draft.");
      await fetchBlogs(currentPage);
    } catch (error: any) {
      toast.error(error?.message || "Failed to move post to draft.");
    }
  };

  const handleSubmitBlog = async (payload: UpsertBlogPostPayload) => {
    try {
      setIsSubmitting(true);

      if (modalMode === "create") {
        await blogApi.createBlogPostAPI(payload);
        toast.success("Created blog post successfully.");
      } else if (editingBlog?.id) {
        await blogApi.updateBlogPostAPI(editingBlog.id, payload);
        toast.success("Updated blog post successfully.");
      }

      closeModal();
      await fetchBlogs(currentPage);
    } catch (error: any) {
      toast.error(error?.message || "Failed to save blog post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMenu = (id: number) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const renderStatusChip = (status: BlogPostStatus = "draft") => {
    const chipClass = statusChipClassMap[status] || statusChipClassMap.draft;

    return (
      <span className={`inline-flex items-center rounded-full px-3 py-1 font-poppins text-xs font-medium ${chipClass}`}>
        {statusLabelMap[status] || statusLabelMap.draft}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6 lg:p-8">
      <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-inter text-3xl font-bold text-slate-900">My Blogs</h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage your posts and submit drafts for admin review.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCategoryModalOpen(true)}
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              + Create Category
            </button>

            <button
              onClick={handleCreate}
              className="flex items-center gap-2 rounded-xl bg-[#FFD900] px-5 py-3 font-poppins text-sm font-semibold text-black transition hover:bg-[#e6c300]"
            >
              <span className="text-lg">+</span>
              Create New Blog
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {reviewFilters.map((filter) => {
            const active = statusFilter === filter.value;

            return (
              <button
                key={filter.value}
                type="button"
                onClick={() => {
                  setStatusFilter(filter.value);
                  setCurrentPage(1);
                }}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      <CreateBlogModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmitBlog}
        categories={categories}
        mode={modalMode}
        initialData={editingBlog}
        submitting={isSubmitting}
      />

      {isCategoryModalOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={() => {
            if (!isCategorySubmitting) {
              closeCategoryModal();
            }
          }}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold text-slate-900">Create Blog Category</h3>
            <p className="mt-1 text-sm text-slate-500">Add a new category for blog posts.</p>

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Category Name</label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => {
                    const nextName = e.target.value;
                    setCategoryName(nextName);
                    if (!categorySlug) {
                      setCategorySlug(slugifyCategory(nextName));
                    }
                  }}
                  placeholder="Programming"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Slug</label>
                <input
                  type="text"
                  value={categorySlug}
                  onChange={(e) => setCategorySlug(e.target.value)}
                  placeholder="programming"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={closeCategoryModal}
                disabled={isCategorySubmitting}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateCategory}
                disabled={isCategorySubmitting}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isCategorySubmitting ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto overflow-y-visible">
          <table className="min-w-250 w-full border-collapse">
          <thead className="bg-slate-100">
            <tr>
              <th className="border-r border-slate-200 px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">#</th>
              <th className="border-r border-slate-200 px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Thumbnail</th>
              <th className="border-r border-slate-200 px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Title</th>
              <th className="border-r border-slate-200 px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Category</th>
              <th className="border-r border-slate-200 px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Created</th>
              <th className="border-r border-slate-200 px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Accepted</th>
              <th className="border-r border-slate-200 px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Status</th>
              <th className="px-4 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-center text-sm text-slate-500">
                  Loading blog posts...
                </td>
              </tr>
            ) : blogs.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-center text-sm text-slate-500">
                  No blog posts found.
                </td>
              </tr>
            ) : (
              blogs.map((blog, index) => (
                <tr key={blog.id} className="hover:bg-slate-50">
                  <td className="border-r border-slate-200 px-4 py-4 text-sm text-slate-700">
                    {blog.stt ?? (currentPage - 1) * DEFAULT_ITEMS_PER_PAGE + index + 1}
                  </td>
                  <td className="border-r border-slate-200 px-4 py-4">
                    <div className="h-14 w-20 overflow-hidden rounded-lg bg-slate-200">
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "";
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  </td>
                  <td className="border-r border-slate-200 px-5 py-4 text-sm text-slate-900">
                    <div className="max-w-72 truncate font-medium">{blog.title}</div>
                    {blog.reviewNote ? (
                      <p className="mt-1 max-w-72 truncate text-xs text-rose-600">Note: {blog.reviewNote}</p>
                    ) : null}
                  </td>
                  <td className="border-r border-slate-200 px-5 py-4 text-sm text-slate-700">{blog.category}</td>
                  <td className="border-r border-slate-200 px-5 py-4 text-sm text-slate-700">{formatDateTime(blog.createdAt)}</td>
                  <td className="border-r border-slate-200 px-5 py-4 text-sm text-slate-700">
                    {blog.status === "published" ? formatDateTime(blog.publishedAt) : "-"}
                  </td>
                  <td className="border-r border-slate-200 px-5 py-4">{renderStatusChip(blog.status)}</td>
                  <td className="relative px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {blog.status === "draft" || blog.status === "rejected" ? (
                        <button
                          onClick={() => handleSubmitForReview(blog.id)}
                          className="rounded-md bg-amber-600 px-2 py-1 text-xs font-medium text-white hover:bg-amber-700"
                        >
                          Submit
                        </button>
                      ) : null}

                      <button
                        onClick={() => toggleMenu(blog.id)}
                        className="rounded-md px-2 py-1 text-2xl font-bold text-slate-700 hover:bg-slate-100"
                      >
                        •••
                      </button>
                    </div>

                    {openMenuId === blog.id ? (
                      <div
                        className={`absolute right-5 z-20 w-44 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg ${
                          index >= blogs.length - 2 ? "bottom-12" : "top-12"
                        }`}
                      >
                        <button
                          onClick={() => handleEdit(blog.id)}
                          className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                        >
                          <span>✏️</span>
                          Edit
                        </button>
                        <button
                          onClick={() => handleArchive(blog.id)}
                          className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                        >
                          <span>📦</span>
                          Move to Draft
                        </button>
                        <button
                          onClick={() => handleDelete(blog.id)}
                          className="flex w-full items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50"
                        >
                          <span>🗑️</span>
                          Delete
                        </button>
                      </div>
                    ) : null}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>

      {pagination.totalPages > 1 ? (
        <Pagination
          type="dashboard"
          currentPage={pagination.page || currentPage}
          totalPages={pagination.totalPages}
          onChange={setCurrentPage}
        />
      ) : null}
    </div>
  );
};

export default DashboardLecturerBlog;
