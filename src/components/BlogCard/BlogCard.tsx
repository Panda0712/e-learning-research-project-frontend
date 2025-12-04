import { ArrowRight, Calendar, User } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { type Blog } from "../../utils/blogData";

interface BlogCardProps {
  data: Blog;
}

const BlogCard: React.FC<BlogCardProps> = ({ data }) => {
  return (
    <div className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 mb-10 w-full max-w-3xl mx-auto">
      <div className="relative overflow-hidden h-[300px] w-full">
        <img
          src={data.image}
          alt={data.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="p-6 md:p-8">
        <div className="flex items-center gap-6 text-gray-500 text-sm mb-4">
          <div className="flex items-center gap-2 ">
            <Calendar size={18} className="text-[#FF6B6B]" />
            <span className="font-medium font-poppins text-[#333931] text-[10px]">
              {data.date}
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-500">
            <User size={18} className="text-[#FF6B6B]" />
            <span className="font-medium font-poppins text-[#333931] text-[10px]">
              {data.author}
            </span>
          </div>
        </div>

        <h3 className="text-3xl font-bold text-gray-900 text-[30px] mb-6 leading-tight hover:text-[#5B5CEB] transition-colors cursor-pointer">
          <Link to={`/blog/${data.id}`}>{data.title}</Link>
        </h3>

        <Link to={`/blog/${data.id}`} className="inline-block">
          <button
            className="
                bg-[#5B5CEB] hover:bg-[#4a4bce] text-white font-regular font-poppins py-3 pl-8 pr-2 
                rounded-full flex items-center gap-4 transition-all duration-300 text-[15px]"
          >
            Read More
            <span className="bg-white/20 w-6 h-6 rounded-full flex items-center justify-center backdrop-blur-sm">
              <ArrowRight size={18} className="text-white" />
            </span>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;
