import { useState } from "react";
import CreateBlogModal from "./CreateBlogModal.tsx";

interface Blog {
  id: number;
  thumbnail: string;
  title: string;
  author: string;
  category: string;
  price: number | null;
  status: "Published" | "Draft";
}

const mockBlogs: Blog[] = [
  {
    id: 1,
    thumbnail: "/ImgBlog/blog1.jpg",
    title: "UI Design Basics",
    author: "Nguyen Van A",
    category: "Web dev",
    price: 520,
    status: "Published",
  },
  {
    id: 2,
    thumbnail: "/ImgBlog/blog2.jpg",
    title: "Figma for Beginners",
    author: "Nguyen Van A",
    category: "Web dev",
    price: 410,
    status: "Published",
  },
  {
    id: 3,
    thumbnail: "/ImgBlog/blog3.jpg",
    title: "Responsive Web Design",
    author: "Nguyen Van A",
    category: "Web dev",
    price: 390,
    status: "Published",
  },
  {
    id: 4,
    thumbnail: "/ImgBlog/blog4.jpg",
    title: "Typography Fundamentals",
    author: "Nguyen Van A",
    category: "Web dev",
    price: null,
    status: "Draft",
  },
  {
    id: 5,
    thumbnail: "/ImgBlog/blog5.jpg",
    title: "Advanced UX Research",
    author: "Nguyen Van A",
    category: "Web dev",
    price: null,
    status: "Draft",
  },
  {
    id: 6,
    thumbnail: "/ImgBlog/blog6.jpg",
    title: "HTML & CSS for Designers",
    author: "Nguyen Van A",
    category: "Web dev",
    price: 680,
    status: "Published",
  },
  {
    id: 7,
    thumbnail: "/ImgBlog/blog7.jpg",
    title: "Designing for Mobile Apps",
    author: "Nguyen Van A",
    category: "Web dev",
    price: 310,
    status: "Published",
  },
  {
    id: 8,
    thumbnail: "/ImgBlog/blog8.jpg",
    title: "Accessibility in Design",
    author: "Nguyen Van A",
    category: "Web dev",
    price: null,
    status: "Draft",
  },
  {
    id: 9,
    thumbnail: "/ImgBlog/blog9.jpg",
    title: "Microinteractions",
    author: "Nguyen Van A",
    category: "Web dev",
    price: 93,
    status: "Draft",
  },
  {
    id: 10,
    thumbnail: "/ImgBlog/blog10.jpg",
    title: "Design Systems 101",
    author: "Nguyen Van A",
    category: "Web dev",
    price: 232,
    status: "Published",
  },
];

const DashboardBlog = () => {
  const [blogs] = useState<Blog[]>(mockBlogs);
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = (id: number) => {
    console.log("Edit blog:", id);
    setOpenMenuId(null);
  };

  const handleDelete = (id: number) => {
    console.log("Delete blog:", id);
    setOpenMenuId(null);
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
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-[#FFD900] px-6 py-3 font-poppins text-sm font-medium text-black transition hover:bg-[#e6c300]"
        >
          <span className="text-xl">+</span>
          Create New Blog
        </button>
      </div>

      {/* Create Blog Modal */}
      <CreateBlogModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Table */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <table className="w-full border-collapse">
          <thead className="bg-[#9D9D9D]">
            <tr>
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
                Price
              </th>
              <th className="border-r border-gray-200 px-6 py-4 text-left font-poppins text-sm font-medium text-black">
                Status
              </th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {blogs.map((blog) => (
              <tr key={blog.id} className="hover:bg-gray-50">
                <td className="border-r border-gray-200 px-6 py-4">
                  <div className="h-12 w-16 overflow-hidden rounded bg-[#0F172A]">
                    <img
                      src={blog.thumbnail}
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
                <td className="border-r border-gray-200 px-6 py-4 font-poppins text-sm text-black">
                  {blog.price !== null ? blog.price : "-"}
                </td>
                <td className="border-r border-gray-200 px-6 py-4">
                  {blog.status === "Published" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 font-poppins text-xs font-medium text-green-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-600"></span>
                      Published
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-3 py-1 font-poppins text-xs font-medium text-yellow-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-yellow-600"></span>
                      Draft
                    </span>
                  )}
                </td>
                <td className="relative px-6 py-4">
                  <button
                    onClick={() => toggleMenu(blog.id)}
                    className="text-2xl font-bold text-black hover:text-gray-600"
                  >
                    •••
                  </button>
                  {openMenuId === blog.id && (
                    <div className="absolute right-8 top-12 z-10 w-32 overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
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
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-center gap-2">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white font-poppins text-sm text-black hover:bg-gray-50"
        >
          &lt;
        </button>
        {[1, 2, 3].map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`flex h-10 w-10 items-center justify-center rounded-lg font-poppins text-sm ${
              currentPage === page
                ? "bg-[#3B82F6] text-white"
                : "border border-gray-300 bg-white text-black hover:bg-gray-50"
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage(Math.min(3, currentPage + 1))}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white font-poppins text-sm text-black hover:bg-gray-50"
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default DashboardBlog;