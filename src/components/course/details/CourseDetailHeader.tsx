import { BookOpen, Clock, FileText, Users } from "lucide-react";
import type { Course } from "../../../types/course.type";

const CourseDetailHeader = ({ course }: { course: Course }) => {
  return (
    <div className="relative overflow-hidden bg-[linear-gradient(140deg,#173744_0%,#19566A_46%,#704FE6_100%)] pb-28 pt-12 text-white">
      <div className="absolute inset-x-0 top-0 h-52 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_34%),radial-gradient(circle_at_top_right,rgba(255,217,0,0.16),transparent_26%)]" />
      <div className="absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -right-16 top-10 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4">
        <div className="mb-4 text-sm text-white/70 font-poppins">
          Home &gt; Course &gt; {course.category}
        </div>
        <div className="max-w-4xl">
          <span className="mb-5 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/90">
            {course.category}
          </span>
          <h1 className="mb-4 text-3xl font-semibold leading-tight font-poppins md:text-4xl lg:text-[52px]">
            {course.title}
          </h1>
          <p className="mb-6 max-w-3xl text-[15px] leading-7 text-white/78 md:text-[16px]">
            Learn with a structured path, practical lessons, and a course
            experience designed to help you progress with confidence.
          </p>
          <div className="flex flex-wrap gap-3 text-sm font-poppins md:gap-4">
            <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-white/90">
              <Clock size={16} /> {course.hours}
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-white/90">
              <Users size={16} /> {course.students} Students
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-white/90">
              <BookOpen size={16} /> All levels
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-white/90">
              <FileText size={16} /> {course.lessons} Lessons
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailHeader;
