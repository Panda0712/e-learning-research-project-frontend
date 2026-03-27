import { Bell } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import DashboardBarChart from "../../../components/dashboard/DashboardBarChart";
import DashboardStatistic from "../../../components/dashboard/DashboardStatistic";
import DashboardTopCourses from "../../../components/dashboard/DashboardTopCourses";
import YearPicker from "../../../components/picker/YearPicker";
import ChartSkeleton from "../../../components/skeleton/ChartSkeleton";
import DashboardRecentActivities from "../../../components/dashboard/lecturer/main/DashboardRecentActivities";
import DashboardRevenue from "../../../components/dashboard/lecturer/main/DashboardRevenue";
import type {
  DashboardChartsResponse,
  LecturerOverviewResponse,
} from "../../../types/dashboard.type";
import { dashboardService } from "../../../apis/dashboard";

type Year = 2023 | 2024 | 2025;

interface MonthlyEngagement {
  month: string;
  value: number;
}

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

const lecturerStatisticData = {
  totalStudents: 1674767,
  coursesActive: 3,
  totalEarning: 7461767,
  assignmentsGraded: 957,
  completedCourses: 951,
  newEnrollments: 20,
};

const DashboardLecturerMain = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [isOverviewLoading, setIsOverviewLoading] = useState(true);
  const [isChartLoading, setIsChartLoading] = useState(true);

  const [overview, setOverview] = useState<LecturerOverviewResponse | null>(
    null,
  );
  const [yearChart, setYearChart] = useState<DashboardChartsResponse | null>(
    null,
  );
  const [monthRevenueChart, setMonthRevenueChart] =
    useState<DashboardChartsResponse | null>(null);

  const selectedYear = selectedDate?.getFullYear() as Year | undefined;

  useEffect(() => {
    (async () => {
      try {
        const data = await dashboardService.getLecturerOverviewAPI();
        setOverview(data);
      } catch {
        setOverview(null);
      } finally {
        setIsOverviewLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!selectedYear) return;

    (async () => {
      setIsChartLoading(true);
      try {
        const from = `${selectedYear}-01-01`;
        const to = `${selectedYear}-12-31`;

        const [yearData, monthRevenue] = await Promise.all([
          dashboardService.getLecturerChartsAPI({
            period: "custom",
            from,
            to,
          }),
          dashboardService.getLecturerChartsAPI({
            period: "this_month",
          }),
        ]);

        setYearChart(yearData);
        setMonthRevenueChart(monthRevenue);
      } catch {
        setYearChart(null);
        setMonthRevenueChart(null);
      } finally {
        setIsChartLoading(false);
      }
    })();
  }, [selectedYear]);

  const lecturerStatisticDataMapped = useMemo(
    () => ({
      totalStudents:
        overview?.cards.totalStudents ?? lecturerStatisticData.totalStudents,
      coursesActive:
        overview?.cards.coursesActive ?? lecturerStatisticData.coursesActive,
      totalEarning:
        overview?.cards.totalEarnings ?? lecturerStatisticData.totalEarning,
      assignmentsGraded:
        overview?.cards.assignmentsGraded ??
        lecturerStatisticData.assignmentsGraded,
      completedCourses:
        overview?.cards.completedCourses ??
        lecturerStatisticData.completedCourses,
      newEnrollments:
        overview?.cards.newEnrollments ?? lecturerStatisticData.newEnrollments,
    }),
    [overview],
  );

  const engagementData = useMemo(() => {
    if (!selectedYear) return [];

    const labels = yearChart?.labels ?? [];
    const apiData = yearChart?.datasets.engagement ?? [];

    const hasApiShape = labels.length > 0 && apiData.length === labels.length;

    if (!hasApiShape) return engagementByYear[selectedYear] ?? [];

    return labels.map((label, idx) => ({
      month: label,
      value: apiData[idx] ?? 0,
    }));
  }, [yearChart, selectedYear]);

  const topCoursesData = useMemo(() => {
    const apiData = overview?.topCourses ?? [];
    if (apiData.length === 0) return undefined;

    return apiData.map((item) => ({
      id: item.id,
      courseName: item.name,
      students: item.totalStudents,
    }));
  }, [overview]);

  const recentActivitiesData = useMemo(() => {
    const apiData = overview?.recentActivity ?? [];
    if (apiData.length === 0) return undefined;

    return apiData.map((item, idx) => ({
      id: `${idx}-${item.time}`,
      type: item.type,
      title: item.title,
      createdAt: item.time,
    }));
  }, [overview]);

  const externalRevenueData = useMemo(() => {
    const labels = monthRevenueChart?.labels ?? [];
    const apiData = monthRevenueChart?.datasets.revenue ?? [];

    const hasApiShape = labels.length > 0 && apiData.length === labels.length;
    if (!hasApiShape) return undefined;

    return labels.map((label, idx) => ({
      day: Number(label.split("/")[0]) || idx + 1,
      value: apiData[idx] ?? 0,
    }));
  }, [monthRevenueChart]);

  return (
    <div className="px-2 py-4 bg-[#f5f6fa]">
      <div className="flex items-center justify-between gap-5">
        <h2 className="font-semibold text-[40px] text-black">Dashboard</h2>
        <Bell className="w-9.25 h-10.25 cursor-pointer" />
      </div>

      <DashboardStatistic
        type="lecturer"
        lecturerData={lecturerStatisticDataMapped}
      />

      <div className="p-4">
        <div className="flex items-center justify-between gap-5 mt-5">
          <h3 className="text-[22px] font-poppins font-semibold">
            Student Monthly Engagement
          </h3>
          <YearPicker value={selectedDate} onChange={setSelectedDate} />
        </div>

        <div className="h-80">
          {isOverviewLoading || isChartLoading || !selectedYear ? (
            <ChartSkeleton />
          ) : engagementData.length === 0 ? (
            <p className="text-[22px] font-bold text-center mt-12">
              No data found!
            </p>
          ) : (
            <DashboardBarChart data={engagementData} />
          )}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[340px_1fr_248px] gap-5">
        <DashboardRecentActivities data={recentActivitiesData} />
        <DashboardRevenue externalData={externalRevenueData} />
        <DashboardTopCourses data={topCoursesData} />
      </div>
    </div>
  );
};

export default DashboardLecturerMain;
