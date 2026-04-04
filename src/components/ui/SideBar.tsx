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
    <aside className="w-full lg:w-1/4 p-4 bg-white rounded-lg shadow-sm h-fit">
      {/* recent post*/}
      <div className="w-full max-w-94.75">
        <h3 className="font-bold font-poppins text-xl mb-6 uppercase border-b-2 border-red-500 inline-block">
          RECENT POST
        </h3>

        {recentPosts.length ? (
          <div className="flex flex-col">
            {recentPosts.slice(0, 6).map((post, index) => (
              <div
                key={post.id}
                className={`flex gap-5 py-5 ${
                  index !== 0 ? "border-t border-gray-200" : ""
                }`}
              >
                <Link to={`/blog/${post.id}`} className="shrink-0">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-20 w-20 object-cover rounded-md hover:opacity-80 transition-opacity"
                  />
                </Link>

                <div className="flex flex-col justify-center">
                  <div className="flex items-center text-sm font-bold mb-2">
                    <Calendar size={14} className="mr-2 text-[#FF6B6B]" />
                    <span className="font-medium font-poppins text-[#333931] text-[10px]">
                      {formatDate(post.date)}
                    </span>
                  </div>

                  <h4 className="font-semibold font-poppins text-gray-800 text-[15px] leading-snug line-clamp-2">
                    <Link
                      to={`/blog/${post.id}`}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {post.title}
                    </Link>
                  </h4>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-md border border-dashed border-gray-300 p-4 text-sm text-gray-500">
            No recent posts found.
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
