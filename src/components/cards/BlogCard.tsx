import React from "react";
import { Link } from "react-router-dom";
import type { Blog } from "../../utils/blogData";

interface BlogCardProps {
  data: Blog;
}

const BlogCard: React.FC<BlogCardProps> = ({ data }) => {
  return (
    <Link
      to={`/blog/${data.id}`}
      className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={data.image}
          alt={data.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="p-4">
        <h3 className="line-clamp-2 min-h-14 text-xl font-semibold leading-7 text-slate-900 transition-colors group-hover:text-[#1E4ED8]">
          {data.title}
        </h3>
      </div>
    </Link>
  );
};

export default BlogCard;
