import { ArrowDownRight, ArrowUpRight, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { dashboardService } from "../../../apis/dashboard";
import DashboardTopCourses from "../../../components/dashboard/DashboardTopCourses";
import DashboardPendingApprovals from "../../../components/dashboard/admin/main/DashboardPendingApprovals";
import ChartSkeleton from "../../../components/skeleton/ChartSkeleton";
import type {
  AdminOverviewResponse,
  DashboardChartQuery,
  DashboardChartsResponse,
} from "../../../types/dashboard.type";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type RangeTab = "1Y" | "6M" | "3M" | "1M";

const RANGE_OPTIONS: RangeTab[] = ["1Y", "6M", "3M", "1M"];

const toIsoDate = (date: Date) => date.toISOString().slice(0, 10);

const getRangeQuery = (range: RangeTab): DashboardChartQuery => {
  const now = new Date();

  if (range === "1Y") {
    return { period: "this_year" };
  }

  if (range === "1M") {
    return { period: "this_month" };
  }

  const from = new Date(now);
  from.setMonth(now.getMonth() - (range === "6M" ? 5 : 2));
  from.setDate(1);

  return {
    period: "custom",
    from: toIsoDate(from),
    to: toIsoDate(now),
  };
};

const calculateTrend = (current: number, previous: number) => {
  if (previous <= 0) return 0;
  return Number((((current - previous) / previous) * 100).toFixed(1));
};

const DashboardAdminMain = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isChartLoading, setIsChartLoading] = useState(true);
  const [activeRange, setActiveRange] = useState<RangeTab>("1Y");

  const [overview, setOverview] = useState<AdminOverviewResponse | null>(null);
  const [chart, setChart] = useState<DashboardChartsResponse | null>(null);

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
        const query = getRangeQuery(activeRange);
        const data = await dashboardService.getAdminChartsAPI(query);
        setChart(data);
      } catch {
        setChart(null);
      } finally {
        setIsChartLoading(false);
      }
    })();
  }, [activeRange]);

  const chartData = useMemo(() => {
    const labels = chart?.labels ?? [];
    const signups = chart?.datasets.signups ?? [];
    const apiData = chart?.datasets.revenue ?? [];

    const hasApiShape = labels.length > 0 && apiData.length === labels.length;

    if (!hasApiShape) return [];

    return labels.map((label, idx) => ({
      label,
      revenue: apiData[idx] ?? 0,
      signups: signups[idx] ?? 0,
    }));
  }, [chart]);

  const cards = useMemo(() => {
    const totalStudents = overview?.cards.totalStudents ?? 0;
    const totalInstructors = overview?.cards.totalInstructors ?? 0;
    const totalRevenue = overview?.cards.totalRevenue ?? 0;
    const totalTransactions = overview?.cards.totalTransactions ?? 0;
    const pendingCourses = overview?.cards.pendingCourses ?? 0;
    const newEnrollments = overview?.cards.newEnrollments ?? 0;

    return [
      {
        title: "Total Students",
        value: totalStudents.toLocaleString("en-US"),
        helper: `${newEnrollments.toLocaleString("en-US")} new enrollments`,
        trend: calculateTrend(newEnrollments, totalStudents - newEnrollments),
        tone: "blue",
        spark: Math.min(100, Math.max(10, (newEnrollments / (totalStudents || 1)) * 100)),
      },
      {
        title: "Total Instructors",
        value: totalInstructors.toLocaleString("en-US"),
        helper: `${pendingCourses.toLocaleString("en-US")} pending approvals`,
        trend: calculateTrend(totalInstructors, totalStudents || 1),
        tone: "indigo",
        spark: Math.min(100, Math.max(10, (pendingCourses / (totalInstructors || 1)) * 100)),
      },
      {
        title: "Platform Revenue",
        value: `$${totalRevenue.toLocaleString("en-US")}`,
        helper: "Gross platform earnings",
        trend: calculateTrend(totalRevenue, totalTransactions || 1),
        tone: "emerald",
        spark: Math.min(100, Math.max(15, (totalTransactions / (totalStudents || 1)) * 100)),
      },
      {
        title: "Transactions",
        value: totalTransactions.toLocaleString("en-US"),
        helper: "Total successful payments",
        trend: calculateTrend(totalTransactions, newEnrollments || 1),
        tone: "amber",
        spark: Math.min(100, Math.max(12, (totalTransactions / (totalInstructors || 1)) * 100)),
      },
    ] as const;
  }, [overview]);

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
      <div className="flex items-center justify-between gap-5 mb-5">
        <h2 className="font-semibold text-[40px] text-black">Dashboard</h2>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 mb-4">
        {cards.map((card, idx) => {
          const isPositive = card.trend >= 0;
          const trendColor = isPositive ? "text-emerald-600" : "text-rose-600";
          const accent =
            card.tone === "blue"
              ? "from-blue-500 to-indigo-500"
              : card.tone === "indigo"
                ? "from-indigo-500 to-violet-500"
                : card.tone === "emerald"
                  ? "from-emerald-500 to-teal-500"
                  : "from-amber-500 to-orange-500";

          return (
            <div
              key={`${card.title}-${idx}`}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.06)]"
            >
              <p className="text-sm text-slate-500 mb-2">{card.title}</p>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-3xl font-semibold text-slate-800">{card.value}</h3>
                <span className={`inline-flex items-center gap-1 text-xs font-semibold ${trendColor}`}>
                  {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {Math.abs(card.trend)}%
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-3">{card.helper}</p>
              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={`h-full bg-linear-to-r ${accent}`}
                  style={{ width: `${card.spark}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-[24px] font-semibold text-slate-800">Monthly Platform Overview</h3>
            <p className="text-sm text-slate-500 mt-1">
              Compare enrollments and revenue across the selected period.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 p-1">
            {RANGE_OPTIONS.map((option) => (
              <button
                key={option}
                onClick={() => setActiveRange(option)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeRange === option
                    ? "bg-indigo-500 text-white"
                    : "text-slate-600 hover:bg-slate-200"
                }`}
              >
                {option === "1Y"
                  ? "1 Year"
                  : option === "6M"
                    ? "6 Months"
                    : option === "3M"
                      ? "3 Months"
                      : "1 Month"}
              </button>
            ))}
          </div>
        </div>

        <div className="h-88">
          {isLoading || isChartLoading ? (
            <ChartSkeleton />
          ) : chartData.length === 0 ? (
            <p className="text-[20px] font-semibold text-center mt-16 text-slate-500">
              No data found for selected range.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="#E5E7EB" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: "#64748B", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fill: "#64748B", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: "#64748B", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => {
                    if (value >= 1000000) return `${Math.round(value / 1000000)}M`;
                    if (value >= 1000) return `${Math.round(value / 1000)}k`;
                    return String(value);
                  }}
                />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    name === "Revenue" ? `$${Number(value).toLocaleString("en-US")}` : Number(value).toLocaleString("en-US"),
                    name,
                  ]}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="signups" name="Enrollments" fill="#C7D2FE" radius={[8, 8, 0, 0]} barSize={20} />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#4F46E5"
                  strokeWidth={3}
                  dot={{ r: 3, fill: "#4F46E5" }}
                  activeDot={{ r: 5 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
          <DashboardPendingApprovals data={pendingApprovalsData} />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
          <DashboardTopCourses data={topCoursesData} />
        </div>
      </div>
    </div>
  );
};

export default DashboardAdminMain;
