import { Check, Plus, Search } from "lucide-react";
import { useState } from "react";
import { HiBars3BottomRight } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import Button from "../../../../../components/Button/Button";
import Input from "../../../../../components/Input/Input";
import DashboardCouponChart from "./DashboardCouponChart/DashboardCouponChart";
import DashboardCouponTable from "./DashboardCouponTable/DashboardCouponTable";
import DashboardPromotionStatistic from "./DashboardPromotionStatistic/DashboardPromotionStatistic";

type DateFilter = "all" | "last-month" | "this-month" | "this-year" | "custom";
type HideFilter = "active" | "expired" | "scheduled";
export type CouponStatus = "active" | "expired" | "scheduled";
type CouponAmount = "amount" | "percent";

interface PromotionStatisticData {
  totalRedeemed: number;
  totalCoupons: number;
  redeemedAmount: number;
  totalRedeemedRate: number;
  totalCouponsRate: number;
  redeemedAmountRate: number;
}

interface CouponData {
  id: number;
  name: string;
  code: string;
  amount: number;
  status: CouponStatus;
  quantity: number;
  redemptions: number;
  type: CouponAmount;
}

const mockPromotionStatisticData: PromotionStatisticData = {
  totalRedeemed: 200,
  totalCoupons: 551,
  redeemedAmount: 8723,
  totalRedeemedRate: 8,
  totalCouponsRate: 8,
  redeemedAmountRate: 8,
};

const mockCouponData: CouponData[] = [
  {
    id: 1,
    name: "New Offer",
    type: "amount",
    code: "BOGO22",
    amount: 21,
    status: "active",
    quantity: 3000,
    redemptions: 2213,
  },
  {
    id: 2,
    name: "Buy 1 get 1",
    code: "XMAS10",
    type: "percent",
    amount: 10,
    status: "expired",
    quantity: 100,
    redemptions: 0,
  },
  {
    id: 3,
    name: "Summer Sale",
    code: "BFA",
    type: "amount",
    amount: 25,
    status: "active",
    quantity: 0,
    redemptions: 0,
  },
  {
    id: 4,
    name: "Offer",
    code: "HAPPY20",
    type: "percent",
    amount: 20,
    status: "active",
    quantity: 0,
    redemptions: 0,
  },
  {
    id: 5,
    name: "New Offer",
    code: "TOUR10",
    amount: 10,
    type: "percent",
    status: "scheduled",
    quantity: 0,
    redemptions: 0,
  },
  {
    id: 6,
    name: "New Offer",
    code: "",
    type: "amount",
    amount: 0,
    status: "active",
    quantity: 0,
    redemptions: 0,
  },
];

const DashboardPromotion = () => {
  const [openHideStat, setOpenHideStat] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [dateFilter, setDateFilter] = useState<DateFilter>("this-year");
  const [hideFilter, setHideFilter] = useState<HideFilter>("active");

  const navigate = useNavigate();

  const options = [
    { label: "All Time", value: "all" },
    { label: "Last Month", value: "last-month" },
    { label: "This Month", value: "this-month" },
    { label: "This Year", value: "this-year" },
  ] as const;

  const hideOptions = [
    { label: "Active", value: "active" },
    { label: "Expired", value: "expired" },
    { label: "Scheduled", value: "scheduled" },
  ] as const;

  return (
    <>
      <div className="flex items-center justify-between gap-5 mt-3">
        <h3 className="text-[24px] text-[#0F172A] font-semibold font-poppins">
          Coupons
        </h3>
        <Button
          content="Create New Coupon"
          onClick={() => {
            navigate(
              "/dashboard/lecturer/my-courses/create-course/promotion/create-coupon"
            );
          }}
          icon={<Plus size={20} className="font-bold" />}
          additionalClass="w-[221px] h-[54px] rounded-lg 
          bg-[#FFD900]! text-[16px]! font-medium"
        />
      </div>

      <div className="flex items-center justify-end gap-4 mt-4">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-[#165DFF]"></div>
          <span className="font-normal text-[14px] font-poppins">
            Chosen Period
          </span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-[#0FC6C2]"></div>
          <span className="font-normal text-[14px] font-poppins">
            Last Period
          </span>
        </div>
      </div>

      <DashboardCouponChart />

      <DashboardPromotionStatistic data={mockPromotionStatisticData} />

      <div className="flex items-center justify-between gap-5">
        <Input
          className="text-[14px] text-[#9D9D9D] border border-[#E2E8F0] bg-white"
          variant="outline"
          placeholder="Search User"
          rightIcon={<Search size={24} className="mr-3 text-blue-900" />}
        />

        <div className="flex items-center gap-4">
          <div
            className="relative rounded-md px-4 py-3 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setOpenHideStat(!openHideStat);
            }}
          >
            <p className="font-semibold text-[14px]">Hide Stats</p>

            {openHideStat && (
              <div
                className="absolute -bottom-51 z-100 right-0 min-w-48.5 p-5 
                shadow-lg rounded-lg bg-white flex flex-col gap-5"
                onClick={(e) => e.stopPropagation()}
              >
                <h4 className="text-[18px] text-[#475569] font-semibold">
                  Status
                </h4>
                {hideOptions.map((option) => (
                  <div
                    key={option.label}
                    className="flex items-center gap-5"
                    onClick={() => {
                      setHideFilter(option.value);
                      // setOpenFilter(false);
                    }}
                  >
                    <div
                      className={`w-6 h-6 rounded-sm ${
                        hideFilter !== option.value
                          ? "border border-gray-200"
                          : "bg-[#3B82F6]"
                      } flex items-center justify-center`}
                    >
                      {hideFilter === option.value && (
                        <Check className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <p
                      className={`font-semibold text-[14px] ${
                        hideFilter === option.value
                          ? "text-[#3B82F6]"
                          : "text-[#475569]"
                      }`}
                    >
                      {option.label}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div
            className="relative rounded-md px-4 py-3 
          flex items-center gap-2 cursor-pointer mr-5"
            onClick={(e) => {
              e.stopPropagation();
              setOpenFilter(!openFilter);
            }}
          >
            <p className="font-semibold text-[14px]">Filter</p>
            <HiBars3BottomRight size={24} />

            {openFilter && (
              <div
                className="absolute -bottom-72 z-100 right-0 min-w-48.5 p-5 
                shadow-lg rounded-lg bg-white flex flex-col gap-5"
                onClick={(e) => e.stopPropagation()}
              >
                <h4 className="text-[18px] text-[#475569] font-semibold">
                  Date Period
                </h4>
                {options.map((option) => (
                  <div
                    key={option.label}
                    className="flex items-center gap-5"
                    onClick={() => {
                      setDateFilter(option.value);
                      // setOpenFilter(false);
                    }}
                  >
                    <div
                      className={`w-6 h-6 rounded-sm ${
                        dateFilter !== option.value
                          ? "border border-gray-200"
                          : "bg-[#3B82F6]"
                      } flex items-center justify-center`}
                    >
                      {dateFilter === option.value && (
                        <Check className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <p
                      className={`font-semibold text-[14px] ${
                        dateFilter === option.value
                          ? "text-[#3B82F6]"
                          : "text-[#475569]"
                      }`}
                    >
                      {option.label}
                    </p>
                  </div>
                ))}

                <p
                  className="text-[14px] text-[#3B82F6] font-normal"
                  onClick={() => {
                    setDateFilter("custom");
                    // setOpenFilter(false);
                  }}
                >
                  Custom Range
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <DashboardCouponTable data={mockCouponData} />
    </>
  );
};

export default DashboardPromotion;
