interface ReviewsData {
  totalReview: number;
  oneStarReviews: number;
  twoStartReviews: number;
  threeStartReviews: number;
  fourStarReviews: number;
  fiveStarReviews: number;
}

interface ThumbProps {
  data: ReviewsData;
}

const DashboardStatisticThumb = ({ data }: ThumbProps) => {
  return (
    <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
      <div
        className="rounded-lg border border-[#E2E8F0] 
        shadow-[0_0_8px_0_rgba(59,130,246,0.12)] bg-white h-25
        flex flex-col justify-center pl-6 gap-1"
      >
        <h4 className="text-[14px] text-[#334155] font-poppins font-normal">
          Total Reviews
        </h4>
        <p className="text-[24px] font-semibold font-poppins">
          {data.totalReview}
        </p>
      </div>
      <div
        className="rounded-lg border border-[#E2E8F0] 
        shadow-[0_0_8px_0_rgba(59,130,246,0.12)] bg-white 
        h-25 flex flex-col justify-center pl-6 gap-1"
      >
        <h4 className="text-[14px] text-[#334155] font-poppins font-normal">
          1 star reviews
        </h4>
        <div className="flex items-center gap-2">
          <p className="text-[24px] font-semibold font-poppins">
            {data.oneStarReviews}
          </p>
          <div
            className="rounded-sm py-1 px-2.5 
            flex items-center justify-center bg-[#EF4444]"
          >
            <span className="font-inter font-semibold text-[12px] text-[#FEF2F2]">
              1.0
            </span>
          </div>
        </div>
      </div>
      <div
        className="rounded-lg border border-[#E2E8F0] 
        shadow-[0_0_8px_0_rgba(59,130,246,0.12)] bg-white 
        h-25 flex flex-col justify-center pl-6 gap-1"
      >
        <h4 className="text-[14px] text-[#334155] font-poppins font-normal">
          2 star reviews
        </h4>
        <div className="flex items-center gap-2">
          <p className="text-[24px] font-semibold font-poppins">
            {data.oneStarReviews}
          </p>
          <div
            className="rounded-sm py-1 px-2.5 
            flex items-center justify-center bg-[#CA8A04]"
          >
            <span className="font-inter font-semibold text-[12px] text-[#FEF2F2]">
              2.0
            </span>
          </div>
        </div>
      </div>
      <div
        className="rounded-lg border border-[#E2E8F0] 
        shadow-[0_0_8px_0_rgba(59,130,246,0.12)] bg-white 
        h-25 flex flex-col justify-center pl-6 gap-1"
      >
        <h4 className="text-[14px] text-[#334155] font-poppins font-normal">
          3 star reviews
        </h4>
        <div className="flex items-center gap-2">
          <p className="text-[24px] font-semibold font-poppins">
            {data.oneStarReviews}
          </p>
          <div
            className="rounded-sm py-1 px-2.5 
            flex items-center justify-center bg-[#FACC15]"
          >
            <span className="font-inter font-semibold text-[12px] text-[#FEF2F2]">
              3.0
            </span>
          </div>
        </div>
      </div>
      <div
        className="rounded-lg border border-[#E2E8F0] 
        shadow-[0_0_8px_0_rgba(59,130,246,0.12)] bg-white 
        h-25 flex flex-col justify-center pl-6 gap-1"
      >
        <h4 className="text-[14px] text-[#334155] font-poppins font-normal">
          4 star reviews
        </h4>
        <div className="flex items-center gap-2">
          <p className="text-[24px] font-semibold font-poppins">
            {data.oneStarReviews}
          </p>
          <div
            className="rounded-sm py-1 px-2.5 
            flex items-center justify-center bg-[#4ADE80]"
          >
            <span className="font-inter font-semibold text-[12px] text-[#FEF2F2]">
              4.0
            </span>
          </div>
        </div>
      </div>
      <div
        className="rounded-lg border border-[#E2E8F0] 
        shadow-[0_0_8px_0_rgba(59,130,246,0.12)] bg-white 
        h-25 flex flex-col justify-center pl-6 gap-1"
      >
        <h4 className="text-[14px] text-[#334155] font-poppins font-normal">
          5 star reviews
        </h4>
        <div className="flex items-center gap-2">
          <p className="text-[24px] font-semibold font-poppins">
            {data.oneStarReviews}
          </p>
          <div
            className="rounded-sm py-1 px-2.5 
            flex items-center justify-center bg-[#16A34A]"
          >
            <span className="font-inter font-semibold text-[12px] text-[#FEF2F2]">
              5.0
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStatisticThumb;
