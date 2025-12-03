import { BookOpen, Facebook, Twitter, Users, Youtube } from "lucide-react";
import type { InstructorType } from "../../../../types/course.type";

const Instructor = ({ data }: { data?: InstructorType }) => {
  if (!data) return <div>No instructor info.</div>;

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl border border-gray-100 shadow-sm">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Avatar */}
        <div className="shrink-0">
          <img
            src={data.avatar}
            alt={data.name}
            className="w-24 h-24 md:w-32 md:h-32 rounded-xl object-cover bg-gray-200"
          />
        </div>

        {/* Info */}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-[#07152F] font-poppins">
            {data.name}
          </h3>
          <p className="text-sm text-[#9D9D9D] mb-4">{data.job}</p>

          <p className="text-[#555555] text-sm leading-6 mb-6 font-poppins">
            {data.bio}
          </p>

          <div className="flex items-center gap-6 text-sm font-medium text-[#555555] mb-6">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-orange-500" /> {data.students}{" "}
              Students
            </div>
            <div className="flex items-center gap-2">
              <BookOpen size={16} className="text-orange-500" /> {data.courses}{" "}
              Lessons
            </div>
          </div>

          <div className="flex items-center gap-4 text-gray-400">
            <span className="text-sm text-[#07152F] font-semibold">
              Follow:
            </span>
            <Facebook
              size={18}
              className="hover:text-blue-600 cursor-pointer"
            />
            <Twitter size={18} className="hover:text-blue-400 cursor-pointer" />
            <Youtube size={18} className="hover:text-red-600 cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Instructor;
