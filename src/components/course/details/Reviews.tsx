import { Star } from "lucide-react";
import CommentList from "../../comment/CommentListCourse";
import type { Review } from "../../../types/course.type";

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
    <div className="mb-3 flex items-center gap-3">
      <div className="flex w-24 items-center gap-1">
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
        <span className="text-xs text-[#94A3B8]">{percent}%</span>
      </div>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#E8EEF5]">
        <div
          className="h-full rounded-full bg-[linear-gradient(135deg,#FFD900_0%,#F5C362_100%)]"
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="rounded-[28px] border border-white/80 bg-white/92 p-6 shadow-[0_18px_55px_rgba(34,40,84,0.08)] md:p-8">
      <span className="inline-flex rounded-full border border-[#704FE6]/15 bg-[#704FE6]/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#704FE6]">
        Reviews
      </span>
      <h3 className="mb-6 mt-5 text-xl font-semibold font-poppins text-[#163541]">
        Comments
      </h3>

      <div className="mb-10 grid gap-6 rounded-3xl border border-[#E7ECF3] bg-[linear-gradient(145deg,#ffffff_0%,#f8fbff_100%)] p-5 md:grid-cols-[220px_minmax(0,1fr)] md:p-6">
        <div className="flex min-w-0 flex-col items-center justify-center md:items-start">
          <div className="mb-2 text-5xl font-bold text-[#163541]">{rating}</div>
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
          <p className="text-xs text-[#94A3B8]">
            based on {ratingCount} ratings
          </p>
        </div>

        <div className="w-full">
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
