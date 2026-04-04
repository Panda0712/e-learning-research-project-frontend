import { Check, ChevronDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { HiBars3BottomRight } from "react-icons/hi2";
import { dashboardService } from "../../../apis/dashboard";
import DashboardBarChart from "../../../components/dashboard/DashboardBarChart";
import DashboardLineChart from "../../../components/dashboard/DashboardLineChart";
import DashboardStatistic from "../../../components/dashboard/DashboardStatistic";
import DashboardTopCourses from "../../../components/dashboard/DashboardTopCourses";
import DashboardPendingApprovals from "../../../components/dashboard/admin/main/DashboardPendingApprovals";
import ChartSkeleton from "../../../components/skeleton/ChartSkeleton";
import type {
  AdminOverviewResponse,
  DashboardChartsResponse,
  DashboardPeriod,
} from "../../../types/dashboard.type";

type DateFilter = "all" | "last-month" | "this-month" | "this-year" | "custom";

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
] as const;

const mapDateFilterToPeriod = (filter: DateFilter): DashboardPeriod => {
  if (filter === "all") return "all_time";
  if (filter === "last-month") return "last_month";
  if (filter === "this-month") return "this_month";
  if (filter === "custom") return "this_year";
  return "this_year";
};

const toRevenueDay = (label: string, index: number) => {
  const dayFromDateFormat = Number(label.split("/")[0]);
  if (!Number.isNaN(dayFromDateFormat) && dayFromDateFormat > 0) {
    return dayFromDateFormat;
  }
  return index + 1;
};

const DashboardAdminMain = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isChartLoading, setIsChartLoading] = useState(true);
  const [openFilter, setOpenFilter] = useState(false);
  const [month, setMonth] = useState<string>(MONTHS[new Date().getMonth()]);
  const [type, setType] = useState<string>("sign-up");
  const [dateFilter, setDateFilter] = useState<DateFilter>("this-year");

  const [overview, setOverview] = useState<AdminOverviewResponse | null>(null);
  const [chart, setChart] = useState<DashboardChartsResponse | null>(null);

  const options = [
    { label: "All Time", value: "all" },
    { label: "Last Month", value: "last-month" },
    { label: "This Month", value: "this-month" },
    { label: "This Year", value: "this-year" },
  ] as const;

  const activeDay = 7;

  const handleChangeType = () => {
    setType(type === "sign-up" ? "revenue" : "sign-up");
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await dashboardService.getAdminOverviewAPI();
        setOverview(data);
      } catch {
        setOverview(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setIsChartLoading(true);
      try {
        if (type === "revenue") {
          const monthIndex = MONTHS.findIndex((m) => m === month);
          if (monthIndex < 0) {
            throw new Error(`Invalid month selected: ${month}`);
          }

          const year = new Date().getFullYear();
          const from = new Date(year, monthIndex, 1).toISOString().slice(0, 10);
          const to = new Date(year, monthIndex + 1, 0)
            .toISOString()
            .slice(0, 10);

          const data = await dashboardService.getAdminChartsAPI({
            period: "custom",
            from,
            to,
          });
          setChart(data);
        } else {
          const period = mapDateFilterToPeriod(dateFilter);
          const data = await dashboardService.getAdminChartsAPI({ period });
          setChart(data);
        }
      } catch {
        setChart(null);
      } finally {
        setIsChartLoading(false);
      }
    })();
  }, [type, dateFilter, month]);

  const adminStatisticDataMapped = useMemo(
    () => ({
      totalStudents: overview?.cards.totalStudents ?? 0,
      totalInstructors: overview?.cards.totalInstructors ?? 0,
      totalPlatformRevenue: overview?.cards.totalRevenue ?? 0,
      pendingCourses: overview?.cards.pendingCourses ?? 0,
      newEnrollments: overview?.cards.newEnrollments ?? 0,
      totalTransactions: overview?.cards.totalTransactions ?? 0,
    }),
    [overview],
  );

  const signUpBarData = useMemo(() => {
    const labels = chart?.labels ?? [];
    const apiData = chart?.datasets.signups ?? [];

    const hasApiShape = labels.length > 0 && apiData.length === labels.length;

    if (!hasApiShape) return [];

    return labels.map((label, idx) => ({
      month: label,
      value: apiData[idx] ?? 0,
    }));
  }, [chart]);

  const revenueLineData = useMemo(() => {
    const labels = chart?.labels ?? [];
    const apiData = chart?.datasets.revenue ?? [];

    const hasApiShape = labels.length > 0 && apiData.length === labels.length;

    if (!hasApiShape) return [];

    return labels.map((label, idx) => ({
      day: toRevenueDay(label, idx),
      value: apiData[idx] ?? 0,
    }));
  }, [chart, month]);

  const pendingApprovalsData = useMemo(() => {
    const apiData = overview?.lists.pendingApprovals ?? [];
    if (apiData.length === 0) return undefined;

    return apiData.map((item, idx) => ({
      id: `${idx}-${item.time}`,
      type: item.type,
      title: item.title,
      createdAt: item.time,
    }));
  }, [overview]);

  const topCoursesData = useMemo(() => {
    const apiData = overview?.lists.topCourses ?? [];
    if (apiData.length === 0) return undefined;

    return apiData.map((item) => ({
      id: item.id,
      courseName: item.name,
      students: item.totalStudents,
    }));
  }, [overview]);

  return (
    <div className="px-2 py-4 bg-[#f5f6fa]">
      <div className="flex items-center justify-between gap-5">
        <h2 className="font-semibold text-[40px] text-black">Dashboard</h2>
      </div>

      <DashboardStatistic type="admin" adminData={adminStatisticDataMapped} />

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
                      setDateFilter("this-year");
                      setOpenFilter(false);
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
              {isLoading || isChartLoading ? (
                <ChartSkeleton />
              ) : signUpBarData.length === 0 ? (
                <p className="text-[22px] font-bold text-center mt-12">
                  No data found!
                </p>
              ) : (
                <DashboardBarChart data={signUpBarData} />
              )}
            </>
          ) : (
            <DashboardLineChart data={revenueLineData} activeDay={activeDay} />
          )}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <DashboardPendingApprovals data={pendingApprovalsData} />
        <DashboardTopCourses data={topCoursesData} />
      </div>
    </div>
  );
};

export default DashboardAdminMain;
