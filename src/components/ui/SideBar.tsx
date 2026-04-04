import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";

interface RecentPostItem {
  id: number;
  title: string;
  image: string;
  date?: string;
}

interface SidebarProps {
  recentPosts?: RecentPostItem[];
}

const formatDate = (value?: string) => {
  if (!value) return "Recent";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recent";

  return date
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .toUpperCase();
};

const Sidebar = ({ recentPosts = [] }: SidebarProps) => {
  return (
    <aside className="h-fit w-full rounded-[28px] border border-white/80 bg-white/92 p-5 shadow-[0_18px_55px_rgba(34,40,84,0.08)] backdrop-blur-sm lg:w-full lg:p-6">
      <div className="w-full">
        <span className="inline-flex rounded-full border border-[#704FE6]/15 bg-[#704FE6]/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#704FE6]">
          Explore more
        </span>
        <h3 className="mb-6 mt-5 text-2xl font-semibold font-poppins text-[#163541]">
          Recent Post
        </h3>

        {recentPosts.length ? (
          <div className="flex flex-col">
            {recentPosts.slice(0, 6).map((post, index) => (
              <div
                key={post.id}
                className={`flex gap-4 py-4 ${
                  index !== 0 ? "border-t border-[#E7ECF3]" : ""
                }`}
              >
                <Link to={`/blog/${post.id}`} className="shrink-0">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-22 w-22 rounded-[18px] object-cover transition-opacity hover:opacity-85"
                  />
                </Link>

                <div className="flex flex-col justify-center">
                  <div className="mb-2 flex items-center text-sm font-bold">
                    <Calendar size={14} className="mr-2 text-[#704FE6]" />
                    <span className="text-[10px] font-medium font-poppins text-[#94A3B8]">
                      {formatDate(post.date)}
                    </span>
                  </div>

                  <h4 className="line-clamp-2 text-[15px] font-semibold leading-7 font-poppins text-[#163541]">
                    <Link
                      to={`/blog/${post.id}`}
                      className="transition-colors hover:text-[#19566A]"
                    >
                      {post.title}
                    </Link>
                  </h4>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-4 text-sm text-[#64748B]">
            No recent posts found.
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
