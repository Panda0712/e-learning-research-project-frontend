import { Check, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { HiBars3BottomRight } from "react-icons/hi2";
import ChartSkeleton from "../../../../components/ChartSkeleton/ChartSkeleton";
import DashboardBarChart from "../../../../components/DashboardBarChart/DashboardBarChart";
import DashboardLineChart from "../../../../components/DashboardLineChart/DashboardLineChart";
import DashboardStatistic from "../../../../components/DashboardStatistic/DashboardStatistic";
import DashboardTopCourses from "../../../../components/DashboardTopCourses/DashboardTopCourses";
import DashboardPendingApprovals from "./DashboardPendingApprovals/DashboardPendingApprovals";

type Year = 2023 | 2024 | 2025;

type RevenuePoint = {
  day: number;
  value: number;
};

type DateFilter = "all" | "last-month" | "this-month" | "this-year" | "custom";

interface MonthlyEngagement {
  month: string;
  value: number;
}

const revenueByMonth: Record<string, RevenuePoint[]> = {
  January: [
    { day: 1, value: 90000 },
    { day: 5, value: 110000 },
    { day: 10, value: 80000 },
    { day: 15, value: 95000 },
    { day: 20, value: 70000 },
    { day: 25, value: 85000 },
    { day: 31, value: 100000 },
  ],
  February: [
    { day: 1, value: 75000 },
    { day: 7, value: 82000 },
    { day: 14, value: 68000 },
    { day: 21, value: 90000 },
    { day: 28, value: 88000 },
  ],
  August: [
    { day: 1, value: 110000 },
    { day: 3, value: 120000 },
    { day: 5, value: 95000 },
    { day: 7, value: 51749 },
    { day: 9, value: 88000 },
    { day: 12, value: 70000 },
    { day: 15, value: 62000 },
    { day: 18, value: 75000 },
    { day: 21, value: 90000 },
    { day: 23, value: 45000 },
    { day: 26, value: 70000 },
    { day: 28, value: 55000 },
    { day: 31, value: 98000 },
  ],
};

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const engagementByYear: Record<Year, MonthlyEngagement[]> = {
  2023: [
    { month: "Jan", value: 60 },
    { month: "Feb", value: 72 },
    { month: "Mar", value: 40 },
    { month: "Apr", value: 82 },
    { month: "May", value: 105 },
    { month: "Jun", value: 70 },
    { month: "Jul", value: 95 },
    { month: "Aug", value: 85 },
    { month: "Sep", value: 115 },
    { month: "Oct", value: 68 },
    { month: "Nov", value: 92 },
    { month: "Dec", value: 75 },
  ],
  2024: [
    { month: "Jan", value: 70 },
    { month: "Feb", value: 78 },
    { month: "Mar", value: 45 },
    { month: "Apr", value: 85 },
    { month: "May", value: 110 },
    { month: "Jun", value: 78 },
    { month: "Jul", value: 98 },
    { month: "Aug", value: 90 },
    { month: "Sep", value: 120 },
    { month: "Oct", value: 75 },
    { month: "Nov", value: 95 },
    { month: "Dec", value: 80 },
  ],
  2025: [
    { month: "Jan", value: 65 },
    { month: "Feb", value: 70 },
    { month: "Mar", value: 50 },
    { month: "Apr", value: 90 },
    { month: "May", value: 100 },
    { month: "Jun", value: 85 },
    { month: "Jul", value: 105 },
    { month: "Aug", value: 95 },
    { month: "Sep", value: 110 },
    { month: "Oct", value: 80 },
    { month: "Nov", value: 98 },
    { month: "Dec", value: 85 },
  ],
};

const adminStatisticData = {
  totalStudents: 1674767,
  totalInstructors: 100,
  totalPlatformRevenue: 7461767,
  pendingCourses: 15,
  newEnrollments: 20,
  totalTransactions: 300,
};

const DashboardAdminMain = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [openFilter, setOpenFilter] = useState(false);
  const [month, setMonth] = useState("August");
  const [type, setType] = useState<string>("sign-up");
  const [dateFilter, setDateFilter] = useState<DateFilter>("this-year");

  const options = [
    { label: "All Time", value: "all" },
    { label: "Last Month", value: "last-month" },
    { label: "This Month", value: "this-month" },
    { label: "This Year", value: "this-year" },
  ] as const;

  const data = revenueByMonth[month] ?? [];
  const activeDay = 7;

  const handleChangeType = () => {
    setType(type === "sign-up" ? "revenue" : "sign-up");
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="px-2 py-4 bg-[#f5f6fa]">
      <div className="flex items-center justify-between gap-5">
        <h2 className="font-semibold text-[40px] text-black">Dashboard</h2>
      </div>

      <DashboardStatistic type="admin" adminData={adminStatisticData} />

      <div className="mt-5">
        <div className="flex items-center justify-between gap-4">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={handleChangeType}
          >
            <h3 className="text-[22px] font-semibold">
              {type === "sign-up" ? "Signup" : "Revenue"}
            </h3>
            <ChevronDown />
          </div>

          {type === "sign-up" ? (
            <div
              className="relative border border-gray-300 rounded-md px-4 py-3 
          flex items-center gap-2 cursor-pointer mr-5"
              onClick={(e) => {
                e.stopPropagation();
                setOpenFilter(!openFilter);
              }}
            >
              <p className="font-semibold text-[14px]">Filter</p>
              <HiBars3BottomRight className="w-4 h-4" />

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
          ) : (
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="px-1 py-2 mr-5 focus:outline-none 
              text-[14px] text-[#6E7485] font-normal border border-[#f5f6fa]"
            >
              {MONTHS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="h-80 mt-5">
          {type === "sign-up" ? (
            <>
              {isLoading ? (
                <ChartSkeleton />
              ) : !isLoading && !engagementByYear[2025] ? (
                <p className="text-[22px] font-bold text-center mt-12">
                  No data found!
                </p>
              ) : (
                <DashboardBarChart data={engagementByYear[2025]} />
              )}
            </>
          ) : (
            <DashboardLineChart data={data} activeDay={activeDay} />
          )}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <DashboardPendingApprovals />
        <DashboardTopCourses />
      </div>
    </div>
  );
};

export default DashboardAdminMain;
