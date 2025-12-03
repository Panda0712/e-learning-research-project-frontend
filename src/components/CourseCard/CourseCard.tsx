import { useNavigate } from "react-router-dom";
import Button from "../Button/Button";
import Star from "../Star/Star";

const CourseCard = ({
  img = "",
  courseName = "",
  courseRating = 0,
  ratingCount = 0,
  detailRef = "",
}) => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate(`/courses/${detailRef}`);
  };

  return (
    <div className="rounded-[25px] flex flex-col shadow-[0_0_20px_rgba(0,0,0,0.1)]">
      <img
        src={img}
        className="rounded-tl-[25px] rounded-tr-[25px] object-cover"
        alt=""
      />
      <div className="p-5 flex flex-col gap-5">
        <h4 className="font-bold text-left font-poppins text-[25px] text-[#07152F]">
          {courseName}
        </h4>
        <div className="flex gap-4 items-center">
          <Star value={courseRating} />
          <p className="font-medium font-poppins text-[15px] text-[#6a6b6c]">
            {courseRating.toFixed(1)} ({ratingCount}{" "}
            {ratingCount > 1 ? "Ratings" : "Rating"})
          </p>
        </div>
        <Button
          onClick={handleButtonClick}
          type="secondary"
          content="View Details"
          additionalClass="w-[347px] h-[56px] mx-auto"
        />
      </div>
    </div>
  );
};

export default CourseCard;
