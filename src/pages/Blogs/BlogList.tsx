/* eslint-disable @typescript-eslint/no-explicit-any */
import BlogCard from "../../components/cards/BlogCard";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { blogApi } from "../../apis/blog";
import { toast } from "react-toastify";
import type { BlogCategoryItem } from "../../types/adminBlog.type";

interface BlogData {
  id: number;
  title: string;
  image: string;
  date: string;
  author: string;
  description: string;
  category: string;
  content: string;
}

const BLOGS_PER_PAGE = 6;

const extractPlainText = (htmlOrText: string) =>
  htmlOrText
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const normalizeBlog = (item: any): BlogData => {
  const content = typeof item?.content === "string" ? item.content : "";
  const description =
    typeof item?.description === "string" && item.description.trim().length > 0
      ? item.description
      : extractPlainText(content).slice(0, 120);

  return {
    id: Number(item?.id || 0),
    title: item?.title || "Untitled blog",
    image: item?.image || item?.thumbnail?.fileUrl || "/icons/no-image.png",
    date: item?.date || item?.createdAt || "",
    author: item?.author || "Anonymous",
    description,
    category: item?.category || "General",
    content,
  };
};

const getVisiblePages = (totalPages: number, currentPage: number) => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) return [1, 2, 3, 4, 5];
  if (currentPage >= totalPages - 2) {
    return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [
    currentPage - 2,
    currentPage - 1,
    currentPage,
    currentPage + 1,
    currentPage + 2,
  ];
};

const BlogList = () => {
  const [blogList, setBlogList] = useState<BlogData[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const [blogsResponse, categoriesResponse] = await Promise.all([
          blogApi.getAllBlogPostsAPI(),
          blogApi.getAllBlogCategoriesAPI().catch(() => []),
        ]);

        const normalizedBlogs = Array.isArray(blogsResponse)
          ? blogsResponse
          : Array.isArray(blogsResponse?.data)
            ? blogsResponse.data
            : [];

        const mappedBlogs = normalizedBlogs
          .map((blog: any) => normalizeBlog(blog))
          .filter((blog: BlogData) => blog.id > 0);

        const categoryFromApi = Array.isArray(categoriesResponse)
          ? categoriesResponse
              .map((item: BlogCategoryItem | string) =>
                typeof item === "string" ? item : item?.name,
              )
              .filter(Boolean)
          : [];

        const categoryFromBlogs = mappedBlogs
          .map((blog: BlogData) => blog.category)
          .filter(Boolean);

        setBlogList(mappedBlogs);
        setCategories([
          "All",
          ...Array.from(new Set([...categoryFromApi, ...categoryFromBlogs])),
        ]);
      } catch (error: any) {
        toast.error(
          error?.message || "Failed to get blogs data! Please try again later!",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const filteredBlogs = useMemo(() => {
    const normalizedKeyword = searchValue.trim().toLowerCase();

    return blogList.filter((blog) => {
      const matchCategory =
        selectedCategory === "All" || blog.category === selectedCategory;

      const matchSearch =
        normalizedKeyword.length === 0 ||
        [blog.title, blog.description, blog.author, blog.category]
          .join(" ")
          .toLowerCase()
          .includes(normalizedKeyword);

      return matchCategory && matchSearch;
    });
  }, [blogList, searchValue, selectedCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredBlogs.length / BLOGS_PER_PAGE));
  const visiblePages = getVisiblePages(totalPages, currentPage);

  const paginatedBlogs = useMemo(() => {
    const startIndex = (currentPage - 1) * BLOGS_PER_PAGE;
    return filteredBlogs.slice(startIndex, startIndex + BLOGS_PER_PAGE);
  }, [filteredBlogs, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue, selectedCategory]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <div className="min-h-screen bg-linear-to-br from-[#F8FAFC] via-white to-[#EFF6FF]">
      <div className="flex h-12.5 w-full items-center bg-[#F5F5F5]">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="text-[#555555] cursor-pointer hover:underline">
              Home
            </span>
            <span className="text-[#9D9D9D] mx-1">{">"}</span>

            <span className="text-[#9D9D9D]">Blog</span>
          </div>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8">
        <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur">
          <h1 className="mb-4 text-2xl font-semibold text-slate-900 md:text-3xl">
            Explore Topics and Skills
          </h1>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                type="text"
                placeholder="Search blog by title, author, category..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#1E4ED8]"
              />
            </div>

            <div className="flex w-full flex-wrap gap-2 lg:w-auto lg:justify-end">
              {categories.map((category) => {
                const active = selectedCategory === category;

                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      active
                        ? "bg-[#1E4ED8] text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {loading ? (
          <p className="py-8 text-center text-slate-500">Loading blogs data...</p>
        ) : paginatedBlogs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-12 text-center text-slate-500">
            No blogs found for this category or keyword.
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {paginatedBlogs.map((blog: BlogData) => (
                <BlogCard key={blog.id} data={blog} />
              ))}
            </div>

            <div className="mt-2 flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
              </button>

              {visiblePages.map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`h-10 min-w-10 rounded-lg border px-3 text-sm font-semibold transition-colors ${
                    page === currentPage
                      ? "border-[#1E4ED8] bg-[#1E4ED8] text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Next page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BlogList;
