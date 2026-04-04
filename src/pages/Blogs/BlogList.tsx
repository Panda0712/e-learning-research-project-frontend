/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { blogApi } from "../../apis/blog";
import BlogCard from "../../components/cards/BlogCard";
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
    return [
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
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

  const totalPages = Math.max(
    1,
    Math.ceil(filteredBlogs.length / BLOGS_PER_PAGE),
  );
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
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7f9fc_0%,#ffffff_28%,#f7f4ff_100%)]">
      <div className="px-4 pb-10 pt-6 sm:px-8 lg:px-12 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-4xl border border-white/70 bg-white/82 p-6 shadow-[0_24px_80px_rgba(34,40,84,0.08)] backdrop-blur-sm sm:p-8 lg:p-10">
            <div className="flex flex-wrap items-center gap-2 text-sm font-medium">
              <span className="cursor-pointer text-[#64748B] hover:text-[#19566A]">
                Home
              </span>
              <span className="text-[#94A3B8]">/</span>
              <span className="text-[#19566A]">Blog</span>
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:items-end">
              <div className="max-w-3xl">
                <span className="inline-flex rounded-full border border-[#704FE6]/15 bg-[#704FE6]/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#704FE6]">
                  Blog journal
                </span>
                <h1 className="mt-5 text-4xl font-semibold leading-tight text-[#163541] md:text-5xl">
                  Explore topics, ideas, and practical learning insights.
                </h1>
                <p className="mt-4 max-w-2xl text-[15px] leading-8 text-[#64748B] md:text-[16px]">
                  Read articles designed to help learners stay inspired, build
                  better habits, and keep up with new skills and trends.
                </p>
              </div>

              <div className="grid gap-4 rounded-[28px] border border-[#E7ECF3] bg-[linear-gradient(145deg,#ffffff_0%,#f8fbff_100%)] p-5 shadow-[0_16px_40px_rgba(34,40,84,0.05)] sm:grid-cols-3 lg:grid-cols-1">
                <div className="rounded-2xl bg-[#F8FAFC] px-4 py-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#704FE6]">
                    Articles
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-[#163541]">
                    {blogList.length}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#F8FAFC] px-4 py-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#704FE6]">
                    Categories
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-[#163541]">
                    {Math.max(0, categories.length - 1)}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#F8FAFC] px-4 py-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#704FE6]">
                    Showing
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-[#163541]">
                    {paginatedBlogs.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-[28px] border border-[#E7ECF3] bg-[linear-gradient(145deg,#ffffff_0%,#fbfcff_100%)] p-5 shadow-[0_16px_40px_rgba(34,40,84,0.05)]">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative w-full lg:max-w-md">
                  <Search
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                    size={18}
                  />
                  <input
                    value={searchValue}
                    onChange={(event) => setSearchValue(event.target.value)}
                    type="text"
                    placeholder="Search blog by title, author, category..."
                    className="h-12 w-full rounded-full border border-[#DCE7F0] bg-white pl-11 pr-4 text-sm text-[#163541] outline-none transition-all focus:border-[#704FE6]/25 focus:ring-4 focus:ring-[#704FE6]/8"
                  />
                </div>

                <div className="flex w-full flex-wrap gap-2 lg:w-auto lg:justify-end">
                  {categories.map((category) => {
                    const active = selectedCategory === category;

                    return (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                          active
                            ? "bg-[linear-gradient(135deg,#704FE6_0%,#5B3FD2_100%)] text-white shadow-[0_12px_24px_rgba(112,79,230,0.20)]"
                            : "bg-[#F8FAFC] text-[#64748B] hover:bg-[#EEF4FF] hover:text-[#19566A]"
                        }`}
                      >
                        {category}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            {loading ? (
              <div className="rounded-[28px] border border-white/80 bg-white/92 py-14 text-center text-[#64748B] shadow-[0_18px_55px_rgba(34,40,84,0.08)]">
                Loading blogs data...
              </div>
            ) : paginatedBlogs.length === 0 ? (
              <div className="rounded-[28px] border border-dashed border-[#CBD5E1] bg-white/92 py-14 text-center text-[#64748B] shadow-[0_18px_55px_rgba(34,40,84,0.08)]">
                No blogs found for this category or keyword.
              </div>
            ) : (
              <>
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {paginatedBlogs.map((blog: BlogData) => (
                    <BlogCard key={blog.id} data={blog} />
                  ))}
                </div>

                <div className="mt-8 flex items-center justify-center gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DCE7F0] bg-white text-[#64748B] shadow-[0_8px_20px_rgba(34,40,84,0.04)] disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {visiblePages.map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`h-10 min-w-10 rounded-xl border px-3 text-sm font-semibold transition-colors ${
                        page === currentPage
                          ? "border-[#704FE6] bg-[linear-gradient(135deg,#704FE6_0%,#5B3FD2_100%)] text-white"
                          : "border-[#DCE7F0] bg-white text-[#64748B] hover:bg-[#F8FAFC]"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DCE7F0] bg-white text-[#64748B] shadow-[0_8px_20px_rgba(34,40,84,0.04)] disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Next page"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogList;
