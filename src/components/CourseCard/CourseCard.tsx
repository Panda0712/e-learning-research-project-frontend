import { BookMinus, Clock, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../Button/Button";
import Star from "../Star/Star";
interface CourseProps {
  // Các Props chung
  id?: string | number;
  img: string;
  courseName: string;
  detailRef: string;

  // Prop phân loại
  variant?: "popular" | "default"; // 'popular' = Homepage, 'default' = Course Page

  // Props cho Homepage (popular)
  courseRating?: number;
  ratingCount?: number;

  // Props cho Course Page (default)
  category?: string;
  author?: string;
  lessons?: number;
  hours?: string;
  students?: number;
  price?: number;
  isFree?: boolean;
}

const CourseCard: React.FC<CourseProps> = ({
  // Default props
  img = "",
  courseName = "",
  detailRef = "",
  variant = "default",

  // Props popular
  courseRating = 0,
  ratingCount = 0,

  // Prop Course page
  category = "Course",
  author = "Unknow",
  lessons = 0,
  hours = "0h",
  students = 0,
  price = 0,
  isFree = false,
}) => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate(`/courses/${detailRef}`);
  };

  const isPopular = variant === "popular";

  return (
    <div className="rounded-[25px] flex flex-col shadow-[0_0_20px_rgba(0,0,0,0.1)] overflow-hidden transition-transform hover:-translate-y-1 duration-300 h-full">
      <div className="relative h-[200px]">
        {/* Phần ảnh */}
        <img
          src={img}
          className="w-full h-full object-cover"
          alt={courseName}
        />

        {!isPopular && (
          <span className="absolute top-4 left-4 bg-[#07152F] text-white text-[10px] font-semibold px-3 py-1 rounded-sm uppercase tracking-wide">
            {category}
          </span>
        )}
      </div>

      {/* Phần body */}
      <div className="p-5 flex flex-col felx-1 gap-3">
        {!isPopular && (
          <p className="text-[#555555] text-sm font-poppins">
            by <span className="font-medium text-black">{author}</span>
          </p>
        )}

        {/* Tên khóa học */}
        <h4 className="font-bold text-left font-poppins text-[20px] leading-snug text-[#07152F] line-clamp-2 min-h-[60px]">
          {courseName}
        </h4>

        {isPopular ? (
          // hiện sao đánh giá ở homepage
          <div className="flex gap-4 items-center mb-2">
            <Star value={courseRating} />
            <p className="font-medium font-poppins text-[15px] text-[#6a6b6c]">
              {courseRating.toFixed(1)} ({ratingCount}{" "}
              {ratingCount > 1 ? "Ratings" : "Rating"})
            </p>
          </div>
        ) : (
          // hiện icon bài học, giờ, học viên ở course page
          <div className="flex items-center space-x-4 text-xs text-[#9D9D9D] font-poppins mb-2">
            <div className="flex items-center gap-1">
              <BookMinus size={14} />
              {lessons}
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              {hours}
            </div>
            <div className="flex items-center gap-1">
              <GraduationCap size={14} />
              {students}
            </div>
          </div>
        )}

        {/*  Phần chân */}
        <div className="mt-auto pt-2">
          {isPopular ? (
            // hiện thị nút "View Details" ở homepage
            <Button
              onClick={handleButtonClick}
              type="secondary"
              content="View Details"
              additionalClass="w-full h-[50px] mx-auto"
            />
          ) : (
            // hiện thị "Giá tiền", "isFree" ở course page
            <>
              <div className="border-t border-gray-100 my-2"></div>
              <div className="flex items-center justify-between">
                {/* giá tiền */}
                <div className="font-poppins">
                  {isFree ? (
                    <span className="text-[#55BE24] font-bold text-lg">
                      Free
                    </span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-[#9D9D9D] text-sm line-through">
                        ${price + 10}
                      </span>
                      <span className="text-[#55BE24] text-sm">${price}</span>
                    </div>
                  )}
                </div>
                <div
                  onClick={handleButtonClick}
                  className="cursor-pointer text-[#07152F] font-bold text-sm hover:underline font-poppins"
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
