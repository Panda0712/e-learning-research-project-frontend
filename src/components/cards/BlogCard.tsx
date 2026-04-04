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
      className="group block overflow-hidden rounded-[28px] border border-white/80 bg-[linear-gradient(180deg,#ffffff_0%,#fbfcff_100%)] shadow-[0_18px_55px_rgba(34,40,84,0.07)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_65px_rgba(34,40,84,0.12)]"
    >
      <div className="relative h-56 w-full overflow-hidden">
        <img
          src={data.image}
          alt={data.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,transparent_0%,rgba(15,23,42,0.34)_100%)]" />
        <span className="absolute left-5 top-5 inline-flex rounded-full border border-white/80 bg-white/92 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#19566A] shadow-[0_10px_24px_rgba(34,40,84,0.10)]">
          {data.category}
        </span>
      </div>

      <div className="p-5">
        <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-medium text-[#94A3B8]">
          <span>{data.date || "Recent"}</span>
          <span className="h-1 w-1 rounded-full bg-[#CBD5E1]"></span>
          <span>{data.author}</span>
        </div>

        <h3 className="min-h-16 line-clamp-2 text-[22px] font-semibold leading-8 text-[#163541] transition-colors group-hover:text-[#19566A]">
          {data.title}
        </h3>

        <p className="mt-3 line-clamp-3 text-sm leading-7 text-[#64748B]">
          {data.description}
        </p>

        <div className="mt-5 inline-flex items-center rounded-full bg-[#EEF4FF] px-4 py-2 text-sm font-semibold text-[#19566A] transition-colors group-hover:bg-[#19566A] group-hover:text-white">
          Read article
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
