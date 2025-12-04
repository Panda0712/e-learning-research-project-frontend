import { Facebook, Instagram, Twitter } from "lucide-react";
import type { InstructorType } from "../../../../types/course.type";

const InstructorCard = ({ instructor }: { instructor?: InstructorType }) => {
  if (!instructor) return null;

  return (
    <div className="bg-gray-50 p-8 rounded-xl mb-8 flex flex-col items-center text-center border border-gray-100">
      <img
        src={instructor.avatar}
        alt={instructor.name}
        className="w-20 h-20 rounded-full object-cover mb-4 border-4 border-white shadow-sm"
      />
      <h4 className="font-bold text-[#07152F] text-lg font-poppins">
        {instructor.name}
      </h4>
      <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider font-bold font-poppins">
        Lecturer
      </p>

      <p className="text-sm text-[#555555] italic mb-6 max-w-lg font-poppins leading-6">
        "{instructor.bio}"
      </p>

      <div className="flex gap-4 text-gray-400">
        <Facebook
          size={18}
          className="hover:text-blue-600 cursor-pointer transition-colors"
        />
        <Twitter
          size={18}
          className="hover:text-blue-400 cursor-pointer transition-colors"
        />
        <Instagram
          size={18}
          className="hover:text-pink-600 cursor-pointer transition-colors"
        />
      </div>
    </div>
  );
};

export default InstructorCard;
