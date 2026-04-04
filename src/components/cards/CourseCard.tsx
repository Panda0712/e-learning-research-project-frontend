import { BookMinus, Clock, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import Star from "../ui/Star";

interface CourseProps {
  id?: string | number;
  img: string;
  courseName: string;
  detailRef: string;
  variant?: "popular" | "default" | "profile";
  courseRating?: number;
  ratingCount?: number;
  learnedAgo?: string;
  category?: string;
  author?: string;
  lessons?: number;
  hours?: string;
  students?: number;
  price?: number;
  isFree?: boolean;
  progress?: number;
}

const CourseCard: React.FC<CourseProps> = ({
  img = "",
  courseName = "",
  detailRef = "",
  variant = "default",
  courseRating = 0,
  ratingCount = 0,
  learnedAgo = "",
  category = "Course",
  author = "Unknown",
  lessons = 0,
  hours = "0h",
  students = 0,
  price = 0,
  isFree = false,
  progress = 0,
}) => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate(`/courses/${detailRef}`);
  };

  const isPopular = variant === "popular";
  const isProfile = variant === "profile";

  if (isProfile) {
    return (
      <div className="rounded-xl bg-white p-4 shadow transition hover:shadow-md">
        <img
          src={img}
          alt={courseName}
          className="mb-4 h-36 w-full rounded-lg object-cover"
        />

        <h3 className="mb-1 line-clamp-2 text-sm font-semibold">
          {courseName}
        </h3>

        <p className="mb-2 text-[12px] font-normal text-[#555555]">
          {learnedAgo}
        </p>

        <div className="h-2 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full bg-orange-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group flex h-full flex-col overflow-hidden transition-all duration-300 ${
        isPopular
          ? "rounded-[25px] shadow-[0_0_20px_rgba(0,0,0,0.1)] hover:-translate-y-1"
          : "rounded-[28px] border border-[#E7ECF3] bg-[linear-gradient(180deg,#ffffff_0%,#fbfcff_100%)] shadow-[0_18px_55px_rgba(34,40,84,0.08)] hover:-translate-y-1.5 hover:shadow-[0_24px_65px_rgba(34,40,84,0.12)]"
      }`}
    >
      <div
        className={`relative overflow-hidden ${isPopular ? "h-[200px]" : "h-[220px]"}`}
      >
        <img
          src={img}
          className={`h-full w-full object-cover transition-transform duration-500 ${
            isPopular ? "" : "group-hover:scale-105"
          }`}
          alt={courseName}
        />

        {!isPopular && (
          <>
            <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,transparent_0%,rgba(7,21,47,0.32)_100%)]" />
            <span className="absolute left-5 top-5 inline-flex rounded-full border border-white/80 bg-white/[0.92] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#19566A] shadow-[0_10px_24px_rgba(34,40,84,0.10)]">
              {category}
            </span>
          </>
        )}
      </div>

      <div className={`flex flex-1 flex-col ${isPopular ? "gap-3 p-5" : "gap-4 p-6"}`}>
        {!isPopular && (
          <div className="flex items-center justify-between gap-3">
            <p className="truncate text-sm text-[#64748B] font-poppins">
              by <span className="font-semibold text-[#163541]">{author}</span>
            </p>
            <span
              className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold ${
                isFree
                  ? "bg-[#ECFDF3] text-[#16A34A]"
                  : "bg-[#EEF4FF] text-[#19566A]"
              }`}
            >
              {isFree ? "Free" : "Premium"}
            </span>
          </div>
        )}

        <h4
            className={`line-clamp-2 text-left font-poppins font-bold leading-snug ${
              isPopular
                ? "min-h-[60px] text-[20px] text-[#07152F]"
                : "min-h-[56px] text-[22px] text-[#163541]"
            }`}
        >
          {courseName}
        </h4>

        {isPopular ? (
          <div className="mb-2 flex items-center gap-4">
            <Star value={courseRating} />
            <p className="text-[15px] font-medium text-[#6a6b6c] font-poppins">
              {courseRating.toFixed(1)} ({ratingCount}{" "}
              {ratingCount > 1 ? "Ratings" : "Rating"})
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2.5 text-[#64748B] font-poppins">
            <div className="rounded-2xl bg-[#F8FAFC] px-3 py-3 text-center">
              <div className="flex items-center justify-center gap-1.5 text-[13px] font-medium">
                <BookMinus size={14} />
                {lessons}
              </div>
              <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-[#94A3B8]">
                Lessons
              </p>
            </div>
            <div className="rounded-2xl bg-[#F8FAFC] px-3 py-3 text-center">
              <div className="flex items-center justify-center gap-1.5 text-[13px] font-medium">
                <Clock size={14} />
                {hours}
              </div>
              <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-[#94A3B8]">
                Hours
              </p>
            </div>
            <div className="rounded-2xl bg-[#F8FAFC] px-3 py-3 text-center">
              <div className="flex items-center justify-center gap-1.5 text-[13px] font-medium">
                <GraduationCap size={14} />
                {students}
              </div>
              <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-[#94A3B8]">
                Students
              </p>
            </div>
          </div>
        )}

        <div className="mt-auto pt-2">
          {isPopular ? (
            <Button
              onClick={handleButtonClick}
              type="secondary"
              content="View Details"
              additionalClass="w-full h-[50px] mx-auto"
            />
          ) : (
            <>
              <div className="my-1 border-t border-[#EDF2F7]"></div>
              <div className="flex items-center justify-between gap-4">
                <div className="font-poppins">
                  {isFree ? (
                    <span className="text-[22px] font-bold text-[#16A34A]">
                      Free
                    </span>
                  ) : (
                    <div className="flex items-end gap-2">
                      <span className="text-sm text-[#A0AEC0] line-through">
                        ${price + 10}
                      </span>
                      <span className="text-[22px] font-bold text-[#16A34A]">
                        ${price}
                      </span>
                    </div>
                  )}
                </div>
                <div
                  onClick={handleButtonClick}
                  className="cursor-pointer rounded-full bg-[#EEF4FF] px-4 py-2 text-sm font-bold text-[#19566A] font-poppins transition-all duration-300 hover:bg-[#19566A] hover:text-white"
                >
                  View More
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
