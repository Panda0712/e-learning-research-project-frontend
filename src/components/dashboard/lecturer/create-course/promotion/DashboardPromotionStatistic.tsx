import { ArrowUp } from "lucide-react";

interface PromotionStatisticData {
  totalRedeemed: number;
  totalCoupons: number;
  redeemedAmount: number;
  totalRedeemedRate: number;
  totalCouponsRate: number;
  redeemedAmountRate: number;
}

interface StatisticProps {
  data: PromotionStatisticData;
}

const DashboardPromotionStatistic = ({ data }: StatisticProps) => {
  return (
    <div className="my-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="border border-[#E2E8F0] 
          shadow-[0_0_8px_0_rgba(59,130,246,0.12)] bg-white
          p-4 rounded-lg flex items-start justify-between gap-2.5"
        >
          <div className="flex flex-col gap-1">
            <h4 className="text-[24px] font-bold font-poppins">
              {i === 0
                ? `$${data.totalRedeemed.toFixed(2)}`
                : i === 1
                ? data.totalCoupons
                : `$${data.redeemedAmount.toLocaleString()}`}
            </h4>
            <p className="text-[14px] text-[#9D9D9D] font-normal font-poppins">
              {i === 0
                ? "Total Redeemed"
                : i === 1
                ? "Total Coupons"
                : "Redeemed Amount"}
            </p>
          </div>

          <div
            className="border border-[#E2E8F0] bg-[#F1F5F9] rounded-lg 
          p-3 flex items-center justify-center gap-1"
          >
            <ArrowUp size={24} color="#16A34A" />
            <span className="text-[12px] font-semibold font-inter text-[#16A34A]">
              {i === 0
                ? `${data.totalRedeemedRate}%`
                : i === 1
                ? `${data.totalCouponsRate}%`
                : `${data.redeemedAmountRate}%`}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardPromotionStatistic;
