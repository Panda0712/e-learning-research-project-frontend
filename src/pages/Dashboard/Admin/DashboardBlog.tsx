/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import CreateBlogModal from "../../../components/dashboard/admin/blog/CreateBlogModal.tsx";
import Pagination from "../../../components/ui/Pagination";
import { blogApi } from "../../../apis/blog";
import type {
  BlogCategoryItem,
  BlogPostItem,
  BlogPostsPagination,
  UpsertBlogPostPayload,
} from "../../../types/adminBlog.type";
import { DEFAULT_ITEMS_PER_PAGE } from "../../../utils/constants";
import { toast } from "react-toastify";

const defaultPagination: BlogPostsPagination = {
  page: 1,
  itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
  total: 0,
  totalPages: 0,
};

const DashboardBlog = () => {
  const [blogs, setBlogs] = useState<BlogPostItem[]>([]);
  const [categories, setCategories] = useState<BlogCategoryItem[]>([]);
  const [pagination, setPagination] = useState<BlogPostsPagination>(defaultPagination);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingBlog, setEditingBlog] = useState<BlogPostItem | null>(null);

  const fetchCategories = async () => {
    try {
      const response = await blogApi.getAllBlogCategoriesAPI();
      const normalized = Array.isArray(response) ? response : [];
      setCategories(normalized);
    } catch (error: any) {
      toast.error(error?.message || "Failed to fetch blog categories.");
    }
  };

  const fetchBlogs = async (page: number) => {
    try {
      setIsLoading(true);
      const response = await blogApi.getAdminBlogPostsAPI({
        page,
        itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
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
  }, [currentPage]);

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBlog(null);
    setModalMode("create");
  };

  const handleCreate = () => {
    setModalMode("create");
    setEditingBlog(null);
    setIsModalOpen(true);
  };

  const handleEdit = async (id: number) => {
    try {
      const detail = await blogApi.getBlogDetailAPI(String(id));
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

      const shouldMoveToPrev = blogs.length === 1 && currentPage > 1;
      if (shouldMoveToPrev) {
        setCurrentPage((prev) => Math.max(1, prev - 1));
        return;
      }

      await fetchBlogs(currentPage);
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete blog post.");
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

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-inter text-4xl font-bold text-black">Blog</h1>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 rounded-lg bg-[#FFD900] px-6 py-3 font-poppins text-sm font-medium text-black transition hover:bg-[#e6c300]"
        >
          <span className="text-xl">+</span>
          Create New Blog
        </button>
      </div>

      {/* Create Blog Modal */}
      <CreateBlogModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmitBlog}
        categories={categories}
        mode={modalMode}
        initialData={editingBlog}
        submitting={isSubmitting}
      />

      {/* Table */}
      <div className="rounded-lg bg-white shadow">
        <table className="w-full border-collapse">
          <thead className="bg-[#9D9D9D]">
            <tr>
              <th className="border-r border-gray-200 px-4 py-4 text-left font-poppins text-sm font-medium text-black">
                #
              </th>
              <th className="border-r border-gray-200 px-6 py-4 text-left font-poppins text-sm font-medium text-black">
                Thumbnail
              </th>
              <th className="border-r border-gray-200 px-6 py-4 text-left font-poppins text-sm font-medium text-black">
                Title
              </th>
              <th className="border-r border-gray-200 px-6 py-4 text-left font-poppins text-sm font-medium text-black">
                Author
              </th>
              <th className="border-r border-gray-200 px-6 py-4 text-left font-poppins text-sm font-medium text-black">
                Category
              </th>
              <th className="border-r border-gray-200 px-6 py-4 text-left font-poppins text-sm font-medium text-black">
                Status
              </th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-sm text-gray-500">
                  Loading blog posts...
                </td>
              </tr>
            ) : blogs.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-sm text-gray-500">
                  No blog posts found.
                </td>
              </tr>
            ) : (
              blogs.map((blog, index) => (
                <tr key={blog.id} className="hover:bg-gray-50">
                <td className="border-r border-gray-200 px-4 py-4 font-poppins text-sm text-black">
                  {blog.stt ?? (currentPage - 1) * DEFAULT_ITEMS_PER_PAGE + index + 1}
                </td>
                <td className="border-r border-gray-200 px-6 py-4">
                  <div className="h-12 w-16 overflow-hidden rounded bg-[#0F172A]">
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
                <td className="border-r border-gray-200 px-6 py-4 font-poppins text-sm text-black">
                  {blog.title}
                </td>
                <td className="border-r border-gray-200 px-6 py-4 font-poppins text-sm text-black">
                  {blog.author}
                </td>
                <td className="border-r border-gray-200 px-6 py-4 font-poppins text-sm text-black">
                  {blog.category}
                </td>
                <td className="border-r border-gray-200 px-6 py-4">
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 font-poppins text-xs font-medium text-green-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-600"></span>
                    Published
                  </span>
                </td>
                <td className="relative px-6 py-4">
                  <button
                    onClick={() => toggleMenu(blog.id)}
                    className="text-2xl font-bold text-black hover:text-gray-600"
                  >
                    •••
                  </button>
                  {openMenuId === blog.id && (
                    <div
                      className={`absolute right-8 z-20 w-32 overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 ${
                        index >= blogs.length - 2 ? "bottom-12" : "top-12"
                      }`}
                    >
                      <button
                        onClick={() => handleEdit(blog.id)}
                        className="flex w-full items-center gap-2 px-4 py-2 font-poppins text-sm text-black hover:bg-gray-100"
                      >
                        <span>✏️</span>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(blog.id)}
                        className="flex w-full items-center gap-2 px-4 py-2 font-poppins text-sm text-black hover:bg-gray-100"
                      >
                        <span>🗑️</span>
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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

export default DashboardBlog;
