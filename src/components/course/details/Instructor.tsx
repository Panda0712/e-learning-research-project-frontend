import { BookOpen, Facebook, Twitter, Users, Youtube } from "lucide-react";
import type { InstructorType } from "../../../types/course.type";

const Instructor = ({ data }: { data?: InstructorType }) => {
  if (!data)
    return (
      <div className="rounded-[28px] border border-white/80 bg-white/92 p-8 text-[#64748B] shadow-[0_18px_55px_rgba(34,40,84,0.08)]">
        No instructor info.
      </div>
    );

  return (
    <div className="rounded-[28px] border border-white/80 bg-white/92 p-6 shadow-[0_18px_55px_rgba(34,40,84,0.08)] md:p-8">
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="shrink-0">
          <img
            src={data.avatar}
            alt={data.name}
            className="h-24 w-24 rounded-3xl border border-[#E7ECF3] bg-gray-200 object-cover shadow-[0_14px_30px_rgba(34,40,84,0.08)] md:h-32 md:w-32"
          />
        </div>

        <div className="flex-1">
          <span className="inline-flex rounded-full border border-[#704FE6]/15 bg-[#704FE6]/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#704FE6]">
            Instructor
          </span>
          <h3 className="mt-5 text-2xl font-semibold text-[#163541] font-poppins">
            {data.name}
          </h3>
          <p className="mb-5 mt-2 text-sm text-[#94A3B8]">{data.job}</p>

          <p className="mb-6 text-[15px] leading-7 text-[#64748B] font-poppins">
            {data.bio}
          </p>

          <div className="mb-6 grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-2xl bg-[#F8FAFC] px-4 py-3 text-sm font-medium text-[#64748B]">
              <Users size={16} className="text-[#704FE6]" /> {data.students}{" "}
              Students
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-[#F8FAFC] px-4 py-3 text-sm font-medium text-[#64748B]">
              <BookOpen size={16} className="text-[#704FE6]" /> {data.courses}{" "}
              Lessons
            </div>
          </div>

          <div className="flex items-center gap-4 text-[#94A3B8]">
            <span className="text-sm font-semibold text-[#163541]">
              Follow:
            </span>
            <Facebook
              size={18}
              className="cursor-pointer transition-colors hover:text-[#19566A]"
            />
            <Twitter
              size={18}
              className="cursor-pointer transition-colors hover:text-[#19566A]"
            />
            <Youtube
              size={18}
              className="cursor-pointer transition-colors hover:text-[#19566A]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Instructor;
