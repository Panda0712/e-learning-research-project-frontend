import { formatDistanceToNow } from "date-fns";
import { Ellipsis } from "lucide-react";
import { useState } from "react";
import ReplyIcon from "../../../../../../assets/reply.svg?react";
import Button from "../../../../../../components/Button/Button";
import Pagination from "../../../../../../components/Pagination/Pagination";
import Star from "../../../../../../components/Star/Star";
import { usePagination } from "../../../../../../hooks/usePagination";

interface RatingData {
  id: number;
  name: string;
  avatar: string;
  content: string;
  rating: number;
  commentedAt: Date;
}

interface ReviewsSectionProps {
  data: RatingData[];
}

const ITEMS_PER_PAGE = 4;

const DashboardReviewsSection = ({ data }: ReviewsSectionProps) => {
  const [openToggleId, setOpenToggleId] = useState<number | null>(null);
  const [openReplyId, setOpenReplyId] = useState<number | null>(null);

  const { currentData, currentPage, totalPages, setCurrentPage } =
    usePagination({
      data,
      itemsPerPage: ITEMS_PER_PAGE,
    });

  const handleOpenToggle = (id: number) => {
    setOpenToggleId(openToggleId !== null ? null : id);
  };

  const handleOpenReply = (id: number) => {
    setOpenReplyId(id);
  };

  const handleReport = () => {};

  const handleSendReply = () => {};

  return (
    <div
      onClick={() => setOpenToggleId(null)}
      className="flex flex-col gap-5 mt-3"
    >
      {currentData.map((ratingData) => (
        <div
          key={ratingData.id}
          className="bg-white rounded-lg p-6 border 
    border-[#E2E8F0] shadow-[0_0_8px_0_rgba(59,130,246,0.12)]
    flex flex-col gap-2"
        >
          <div className="flex items-center justify-between gap-5">
            <div className="flex items-center gap-2">
              <h4 className="text-[14px] font-medium text-[#475569]">
                Rating:
              </h4>
              <Star value={ratingData.rating} />
            </div>
            <div className="relative">
              <Ellipsis
                size={24}
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenToggle(ratingData.id);
                }}
                className="cursor-pointer"
              />
              {openToggleId === ratingData.id && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReport();
                  }}
                  className="border border-[#9D9D9D] rounded-[10px] 
                  w-29.25 h-9.75 absolute -bottom-10 -right-10 bg-white transition
                  flex items-center justify-center cursor-pointer hover:bg-gray-100"
                >
                  <span className="text-[14px] font-medium font-poppins">
                    Report
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-7.5 h-7.5 rounded-full overflow-hidden">
              <img
                src={ratingData.avatar}
                className="object-cover w-7.5 h-7.5"
                alt=""
              />
            </div>
            <div className="flex flex-col">
              <h5 className="font-medium font-poppins text-[14px] text-[#0F172A]">
                {ratingData.name}
              </h5>
              <span className="font-semibold text-[12px] font-inter text-[#94A3B8]">
                {formatDistanceToNow(ratingData.commentedAt)}
              </span>
            </div>
          </div>

          <p className="text-[16px] font-normal font-poppins text-[#334155] line-clamp-2">
            {ratingData.content}
          </p>

          <div
            className="flex items-center gap-2 mt-2 cursor-pointer"
            onClick={() => handleOpenReply(ratingData.id)}
          >
            <ReplyIcon width="14.74px" height="11.25px" />
            <span className="text-[15px] font-normal">Reply</span>
          </div>

          {openReplyId === ratingData.id && (
            <div
              className="w-full bg-black/5 rounded-3xl py-3 
            px-4 flex flex-col justify-between space-y-5"
            >
              <input
                type="text"
                placeholder="Write your reply to this student"
                className="flex-1 ml-1 bg-transparent outline-none text-[14px] 
                font-poppins text-[#9D9D9D] placeholder:text-[#94A3B8]"
              />

              <div className="flex items-center justify-end gap-3">
                <Button
                  type="cancel"
                  content="Cancel"
                  onClick={() => setOpenReplyId(null)}
                  additionalClass="text-black font-normal px-4"
                />

                <Button
                  type="submit"
                  content="Send"
                  onClick={handleSendReply}
                  additionalClass="px-4"
                />
              </div>
            </div>
          )}
        </div>
      ))}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        type="dashboard"
        onChange={setCurrentPage}
      />
    </div>
  );
};

export default DashboardReviewsSection;
