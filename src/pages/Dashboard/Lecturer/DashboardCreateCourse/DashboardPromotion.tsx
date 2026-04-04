/* eslint-disable @typescript-eslint/no-explicit-any */
import { Check, Plus, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { HiBars3BottomRight } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { lecturerCourseInsightsService } from "../../../../apis/lecturer/courseInsights";
import DashboardCouponChart from "../../../../components/dashboard/lecturer/create-course/promotion/DashboardCouponChart";
import DashboardCouponTable from "../../../../components/dashboard/lecturer/create-course/promotion/DashboardCouponTable";
import DashboardPromotionStatistic from "../../../../components/dashboard/lecturer/create-course/promotion/DashboardPromotionStatistic";
import Button from "../../../../components/ui/Button";
import Input from "../../../../components/ui/Input";

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

const emptyStats: PromotionStatisticData = {
  totalRedeemed: 0,
  totalCoupons: 0,
  redeemedAmount: 0,
  totalRedeemedRate: 0,
  totalCouponsRate: 0,
  redeemedAmountRate: 0,
};

const DashboardPromotion = () => {
  const [openHideStat, setOpenHideStat] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [dateFilter, setDateFilter] = useState<DateFilter>("this-year");
  const [hideFilter, setHideFilter] = useState<HideFilter>("active");
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState<PromotionStatisticData>(emptyStats);
  const [tableData, setTableData] = useState<CouponData[]>([]);

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

  useEffect(() => {
    lecturerCourseInsightsService
      .getCouponsByCourseAPI({ page: 1, limit: 100, status: hideFilter })
      .then((res) => {
        const rows = (res?.data || []).map((item: any) => ({
          id: Number(item.id),
          name: String(item.name || ""),
          code: String(item.code || ""),
          amount: Number(item.amount || 0),
          status:
            item.status === "active" ||
            item.status === "expired" ||
            item.status === "scheduled"
              ? item.status
              : "active",
          quantity: Number(item.quantity || 0),
          redemptions: Number(item.redemptions || 0),
          type: item.type === "fixed" ? "amount" : "percent",
        })) as CouponData[];

        setTableData(rows);
        setStats({
          totalRedeemed: rows.reduce((s, i) => s + i.redemptions, 0),
          totalCoupons: rows.length,
          redeemedAmount: rows.reduce(
            (s, i) => s + i.redemptions * i.amount,
            0,
          ),
          totalRedeemedRate: 0,
          totalCouponsRate: 0,
          redeemedAmountRate: 0,
        });
      })
      .catch((error: any) => {
        setTableData([]);
        setStats(emptyStats);
        toast.error(
          error?.message ||
            error?.response?.data?.message ||
            "Missing course context. Open course detail and save first.",
        );
      });
  }, [hideFilter, dateFilter]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return tableData;
    return tableData.filter(
      (i) =>
        i.name.toLowerCase().includes(q) || i.code.toLowerCase().includes(q),
    );
  }, [tableData, search]);

  return (
    <>
      <div className="flex items-center justify-between gap-5 mt-3">
        <h3 className="text-[24px] text-[#0F172A] font-semibold font-poppins">
          Coupons
        </h3>
        <Button
          content="Create New Coupon"
          onClick={() =>
            navigate(
              "/dashboard/lecturer/my-courses/create-course/commission/create-coupon",
            )
          }
          icon={<Plus size={20} className="font-bold" />}
          additionalClass="w-[221px] h-[54px] rounded-lg bg-[#FFD900]! text-[16px]! font-medium"
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
      <DashboardPromotionStatistic data={stats} />

      <div className="flex items-center justify-between gap-5">
        <Input
          className="text-[14px] text-[#9D9D9D] border border-[#E2E8F0] bg-white"
          variant="outline"
          placeholder="Search Coupon"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
                className="absolute -bottom-51 z-100 right-0 min-w-48.5 p-5 shadow-lg rounded-lg bg-white flex flex-col gap-5"
                onClick={(e) => e.stopPropagation()}
              >
                <h4 className="text-[18px] text-[#475569] font-semibold">
                  Status
                </h4>
                {hideOptions.map((option) => (
                  <div
                    key={option.label}
                    className="flex items-center gap-5"
                    onClick={() => setHideFilter(option.value)}
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
            className="relative rounded-md px-4 py-3 flex items-center gap-2 cursor-pointer mr-5"
            onClick={(e) => {
              e.stopPropagation();
              setOpenFilter(!openFilter);
            }}
          >
            <p className="font-semibold text-[14px]">Filter</p>
            <HiBars3BottomRight size={24} />
            {openFilter && (
              <div
                className="absolute -bottom-72 z-100 right-0 min-w-48.5 p-5 shadow-lg rounded-lg bg-white flex flex-col gap-5"
                onClick={(e) => e.stopPropagation()}
              >
                <h4 className="text-[18px] text-[#475569] font-semibold">
                  Date Period
                </h4>
                {options.map((option) => (
                  <div
                    key={option.label}
                    className="flex items-center gap-5"
                    onClick={() => setDateFilter(option.value)}
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
              </div>
            )}
          </div>
        </div>
      </div>

      <DashboardCouponTable data={filtered} />
    </>
  );
};

export default DashboardPromotion;
