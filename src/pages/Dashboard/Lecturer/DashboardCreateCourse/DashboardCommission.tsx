/* eslint-disable @typescript-eslint/no-explicit-any */
import { Check, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { HiBars3BottomRight } from "react-icons/hi2";
import { lecturerCourseInsightsService } from "../../../../apis/lecturer/courseInsights";
import GraphIcon from "../../../../assets/graph.svg?react";
import DashboardCommissionTable from "../../../../components/dashboard/lecturer/create-course/commission/DashboardCommissionTable";
import TableSkeleton from "../../../../components/skeleton/TableSkeleton";
import Input from "../../../../components/ui/Input";

type DateFilter = "all" | "last-month" | "this-month" | "this-year" | "custom";
export type orderStatus = "received" | "pending";

interface CommissionSummary {
  totalCommission: number;
  received: number;
  pending: number;
}

export interface orderData {
  id: number;
  customerName: string;
  date: Date;
  status: orderStatus;
  price: number;
  commission: number;
}

const emptySummary: CommissionSummary = {
  totalCommission: 0,
  received: 0,
  pending: 0,
};

const DashboardCommission = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [openFilter, setOpenFilter] = useState(false);
  const [dateFilter, setDateFilter] = useState<DateFilter>("this-year");

  const [search, setSearch] = useState("");
  const [summary, setSummary] = useState<CommissionSummary>(emptySummary);
  const [rows, setRows] = useState<orderData[]>([]);

  const options = [
    { label: "All Time", value: "all" },
    { label: "Last Month", value: "last-month" },
    { label: "This Month", value: "this-month" },
    { label: "This Year", value: "this-year" },
  ] as const;

  useEffect(() => {
    const context = JSON.parse(
      localStorage.getItem("lecturerCreateCourseContext") || "{}",
    );
    const courseId = Number(context.courseId || 0);
    if (!courseId) {
      setRows([]);
      setSummary(emptySummary);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    lecturerCourseInsightsService
      .getCourseCommissionsAPI(courseId, {
        page: 1,
        itemsPerPage: 100,
        q: search,
        period: dateFilter === "custom" ? "all" : dateFilter,
      })
      .then((res) => {
        const mapped = (res?.data || []).map((item: any) => ({
          id: Number(item.id),
          customerName: String(item.customerName || ""),
          date: new Date(item.date || Date.now()),
          status: item.status === "pending" ? "pending" : "received",
          price: Number(item.price || 0),
          commission: Number(item.commission || 0),
        })) as orderData[];
        setRows(mapped);
        setSummary({
          totalCommission: Number(res?.summary?.totalCommission || 0),
          received: Number(res?.summary?.received || 0),
          pending: Number(res?.summary?.pending || 0),
        });
      })
      .finally(() => setIsLoading(false));
  }, [dateFilter, search]);

  const tableRows = useMemo(() => rows, [rows]);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white h-22.5 shadow-md rounded-lg py-4 px-6 flex items-center gap-3">
          <GraphIcon fontSize={24} />
          <div className="flex flex-col">
            <h4 className="font-inter text-[24px] font-semibold text-[#0F172A]">
              ${summary.totalCommission.toFixed(2)}
            </h4>
            <span className="font-inter font-normal text-[14px] text-[#334155]">
              Total Commission
            </span>
          </div>
        </div>
        <div className="bg-white h-22.5 shadow-md rounded-lg py-4 px-6 flex items-center gap-3">
          <GraphIcon fontSize={24} />
          <div className="flex flex-col">
            <h4 className="font-inter text-[24px] font-semibold text-[#0F172A]">
              ${summary.received.toFixed(2)}
            </h4>
            <span className="font-inter font-normal text-[14px] text-[#334155]">
              Received
            </span>
          </div>
        </div>
        <div className="bg-white h-22.5 shadow-md rounded-lg py-4 px-6 flex items-center gap-3">
          <GraphIcon fontSize={24} />
          <div className="flex flex-col">
            <h4 className="font-inter text-[24px] font-semibold text-[#0F172A]">
              ${summary.pending.toFixed(2)}
            </h4>
            <span className="font-inter font-normal text-[14px] text-[#334155]">
              Pending
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-5 my-4">
        <Input
          className="text-[14px] text-[#9D9D9D] border border-[#E2E8F0] bg-white"
          variant="outline"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          rightIcon={<Search size={24} className="mr-3 text-blue-900" />}
        />

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

      {isLoading ? (
        <TableSkeleton />
      ) : (
        <DashboardCommissionTable data={tableRows} />
      )}
    </>
  );
};

export default DashboardCommission;
