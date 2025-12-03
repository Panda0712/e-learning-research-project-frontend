import { Reply } from "lucide-react";
import type { Review } from "../../types/course.type";
import Button from "../Button/Button";
interface Props {
  reviews: Review[];
}

const CommentList = ({ reviews }: Props) => {
  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="flex gap-4 p-4 bg-white border border-gray-50 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <div className="shrink-0">
            <img
              src={review.avatar}
              alt={review.user}
              className="w-12 h-12 rounded-full object-cover border border-gray-200"
            />
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-start mb-1">
              <h4 className="font-bold text-[#07152F] text-sm md:text-base font-poppins">
                {review.user}
              </h4>
              <span className="text-xs text-[#9D9D9D] font-poppins">
                {review.date}
              </span>
            </div>

            <p className="text-sm text-[#555555] mb-3 font-poppins leading-6">
              {review.content}
            </p>

            <Button
              onClick={() => console.log("Reply to", review.user)}
              content={
                <div className="flex items-center gap-1">
                  <Reply size={14} /> Reply
                </div>
              }
              additionalClass="!w-auto !h-auto !bg-transparent !text-xs !font-bold !text-[#9D9D9D] hover:!text-orange-500 !p-0 !rounded-none !border-0 transition-colors"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
