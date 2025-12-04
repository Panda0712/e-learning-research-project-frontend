import { Calendar, ChevronRight, Search } from "lucide-react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-full lg:w-1/4 p-4 bg-white rounded-lg shadow-sm h-fit">
      {/* Search */}
      <div className="mb-8 relative w-full max-w-[379px]">
        <input
          type="text"
          placeholder="Search"
          className="w-full h-10 font-poppins border border-[#E2E1E1] rounded-md px-4 pr-12 text-[16px] focus:outline-none focus:border-blue-500 placeholder-gray-400"
        />
        <Search
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
      </div>

      {/* service category */}
      <div className="mb-8 w-full max-w-[379px]">
        <h3 className="font-bold font-poppins text-lg mb-6 uppercase border-b-2 border-red-500 inline-block">
          Service Category
        </h3>

        <ul className="flex flex-col gap-3 font-poppins">
          {[
            "Soft Skill",
            "Soft Skill",
            "Soft Skill",
            "Soft Skill",
            "Soft Skill",
          ].map((cat, index) => (
            <li
              key={index}
              className="
                group w-full h-[60px] flex items-center justify-between padding px-5 
                bg-white border border-[#E0E0E0] rounded-md cursor-pointer transition-all duration-300 
              
                hover:bg-[#704FE6] hover:border-[#704FE6] hover:text-white hover:shadow-md 
              "
            >
              <span className="font-medium text-[16px]">{cat}</span>

              <ChevronRight
                size={20}
                className="text-gray-400 group-hover:text-white transition-colors"
              />
            </li>
          ))}
        </ul>
      </div>

      {/* recent post*/}
      <div className="mb-8 w-full max-w-[379px]">
        <h3 className="font-bold font-poppins text-xl mb-6 uppercase border-b-2 border-red-500 inline-block">
          RECENT POST
        </h3>

        <div className="flex flex-col">
          {[1, 2, 3, 4].map((id, index) => (
            <div
              key={index}
              className={`flex gap-5 py-5 ${
                index !== 0 ? "border-t border-gray-200" : ""
              }`}
            >
              <Link to={`/blog/${id}`} className="shrink-0">
                <img
                  src="/public/ImgBlog/Recent_1.jpg"
                  alt="Post thumbnail"
                  className="w-[98px] h-[98px] object-cover rounded-md hover:opacity-80 transition-opacity"
                />
              </Link>

              <div className="flex flex-col justify-center">
                <div className="flex items-center  text-sm font-bold mb-2">
                  <Calendar size={14} className="mr-2 text-[#FF6B6B]" />
                  <span className="font-medium font-poppins text-[#333931] text-[10px]">
                    14 JUNE 2025
                  </span>
                </div>

                <h4 className="font-semibold font-poppins text-gray-800 text-[15px] leading-snug">
                  <Link
                    to={`/blog/${id}`}
                    className="hover:text-blue-600 transition-colors"
                  >
                    Something every day is normal entertainment
                  </Link>
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Tags */}
      <div>
        <h3 className="font-bold text-lg mb-4 border-b-2 border-red-500 inline-block">
          POPULAR TAGS
        </h3>
        <div className="flex flex-wrap gap-2">
          {["Soft Skill", "React", "Design", "UI/UX"].map((tag, idx) => (
            <span
              key={idx}
              className="bg-gray-100 px-3 py-1 rounded text-sm text-gray-600 hover:bg-blue-100 cursor-pointer"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
