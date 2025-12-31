import { ArrowUpRight } from "lucide-react";
import Button from "../../../../../components/Button/Button";
import type { RevenueStatsProps } from "../../../../../types/assessment.type";

const RevenueStats = ({
  onWithdrawClick,
  availableBalance,
}: RevenueStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-2xl font-bold text-gray-900">+ $24,340</h3>
          <span className="flex items-center text-xs font-medium bg-gray-100 px-2 py-1 rounded text-gray-600">
            <ArrowUpRight size={14} className="mr-1" /> 8%
          </span>
        </div>
        <p className="text-gray-500 text-sm">Total Earnings</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-2xl font-bold text-gray-900">+ $98.76</h3>
          <span className="flex items-center text-xs font-medium bg-gray-100 px-2 py-1 rounded text-gray-600">
            <ArrowUpRight size={14} className="mr-1" /> 8%
          </span>
        </div>
        <p className="text-gray-500 text-sm">This Month's Revenue</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex justify-between items-center bg-[#FFFBEB]">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">
            ${availableBalance}
          </h3>
          <p className="text-gray-500 text-sm mt-1 font-medium">
            Available for Withdrawal
          </p>
        </div>

        <Button
          onClick={onWithdrawClick}
          content="Withdraw"
          type="primary"
          additionalClass="!w-auto !h-10 !text-sm px-4 !rounded-lg shadow-sm hover:shadow-md cursor-pointer"
        />
      </div>
    </div>
  );
};

export default RevenueStats;
