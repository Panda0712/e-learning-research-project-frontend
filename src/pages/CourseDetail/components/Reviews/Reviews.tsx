import { Star } from "lucide-react";
import CommentList from "../../../../components/CommentListCourse/CommentListCourse";
import type { Review } from "../../../../types/course.type";

const Reviews = ({
  reviews = [],
  rating = 0,
  ratingCount = 0,
}: {
  reviews?: Review[];
  rating?: number;
  ratingCount?: number;
}) => {
  const ProgressBar = ({
    star,
    percent,
  }: {
    star: number;
    percent: number;
  }) => (
    <div className="flex items-center gap-3 mb-2">
      <div className="flex items-center w-24 gap-1">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={12}
              fill={i < star ? "#F5C362" : "#eee"}
              strokeWidth={0}
            />
          ))}
        </div>
        <span className="text-xs text-gray-500">{percent}%</span>
      </div>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#F5C362] rounded-full"
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl border border-gray-100 shadow-sm">
      <h3 className="font-bold text-lg mb-6 font-poppins text-[#07152F]">
        Comments
      </h3>

      <div className="flex flex-col md:flex-row gap-8 mb-10">
        <div className="flex flex-col justify-center items-center md:items-start min-w-[150px]">
          <div className="text-5xl font-bold text-[#07152F] mb-2">{rating}</div>
          <div className="flex mb-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                fill={i < Math.round(rating) ? "#F5C362" : "#eee"}
                strokeWidth={0}
              />
            ))}
          </div>
          <p className="text-xs text-[#9D9D9D]">
            based on {ratingCount} ratings
          </p>
        </div>

        <div className="flex-1 w-full">
          <ProgressBar star={5} percent={90} />
          <ProgressBar star={4} percent={5} />
          <ProgressBar star={3} percent={2} />
        </div>
      </div>
      <CommentList reviews={reviews} />
    </div>
  );
};

export default Reviews;
