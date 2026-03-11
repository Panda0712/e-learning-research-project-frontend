import { BookOpen, Clock, FileText, Users } from "lucide-react";
import type { Course } from "../../../types/course.type";

const CourseDetailHeader = ({ course }: { course: Course }) => {
  return (
    <div className="bg-black text-white py-12 pb-24 relative">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-sm text-gray-400 mb-4 font-poppins">
          Home &gt; Course &gt; {course.category}
        </div>
        <div className="max-w-3xl">
          <span className="bg-gray-700 text-xs px-2 py-1 rounded mb-4 inline-block">
            {course.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 font-poppins">
            {course.title}
          </h1>
          <div className="flex flex-wrap gap-6 text-sm text-gray-300 font-poppins">
            <div className="flex items-center gap-2">
              <Clock size={16} /> {course.hours}
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} /> {course.students} Students
            </div>
            <div className="flex items-center gap-2">
              <BookOpen size={16} /> All levels
            </div>
            <div className="flex items-center gap-2">
              <FileText size={16} /> {course.lessons} Lessons
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailHeader;
