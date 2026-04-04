import { Reply } from "lucide-react";
import type { Review } from "../../types/course.type";
import Button from "../ui/Button";
interface Props {
  reviews: Review[];
}

const CommentList = ({ reviews }: Props) => {
  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="flex gap-4 rounded-[24px] border border-[#E7ECF3] bg-[linear-gradient(145deg,#ffffff_0%,#fbfcff_100%)] p-5 shadow-[0_12px_30px_rgba(34,40,84,0.04)] transition-colors hover:bg-[#FCFDFF]"
        >
          <div className="shrink-0">
            <img
              src={review.avatar}
              alt={review.user}
              className="h-12 w-12 rounded-full border border-[#E2E8F0] object-cover"
            />
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-start mb-1">
              <h4 className="font-bold text-[#163541] text-sm md:text-base font-poppins">
                {review.user}
              </h4>
              <span className="text-xs text-[#94A3B8] font-poppins">
                {review.date}
              </span>
            </div>

            <p className="mb-3 text-sm leading-7 text-[#64748B] font-poppins">
              {review.content}
            </p>

            <Button
              onClick={() => console.log("Reply to", review.user)}
              content={
                <div className="flex items-center gap-1">
                  <Reply size={14} /> Reply
                </div>
              }
              additionalClass="!w-auto !h-auto !bg-transparent !text-xs !font-bold 
              !text-[#94A3B8] hover:!text-[#704FE6] !p-0 !rounded-none 
              !border-0 transition-colors"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
