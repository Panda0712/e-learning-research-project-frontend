import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import ChartSkeleton from "../../../../components/ChartSkeleton/ChartSkeleton";
import DashboardBarChart from "../../../../components/DashboardBarChart/DashboardBarChart";
import DashboardStatistic from "../../../../components/DashboardStatistic/DashboardStatistic";
import DashboardTopCourses from "../../../../components/DashboardTopCourses/DashboardTopCourses";
import YearPicker from "../../../../components/YearPicker/YearPicker";
import DashboardRecentActivities from "./DashboardRecentActivities/DashboardRecentActivities";
import DashboardRevenue from "./DashboardRevenue/DashboardRevenue";

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
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const selectedYear = selectedDate?.getFullYear() as Year | undefined;

  useEffect(() => {
    if (!selectedYear) return;

    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, [selectedYear]);

  return (
    <div className="px-2 py-4 bg-[#f5f6fa]">
      <div className="flex items-center justify-between gap-5">
        <h2 className="font-semibold text-[40px] text-black">Dashboard</h2>
        <Bell className="w-9.25 h-10.25 cursor-pointer" />
      </div>

      <DashboardStatistic
        type="lecturer"
        lecturerData={lecturerStatisticData}
      />

      <div className="p-4">
        <div className="flex items-center justify-between gap-5 mt-5">
          <h3 className="text-[22px] font-poppins font-semibold">
            Student Monthly Engagement
          </h3>
          <YearPicker value={selectedDate} onChange={setSelectedDate} />
        </div>

        <div className="h-80">
          {/* {isLoading || !selectedYear ? (
            <ChartSkeleton />
          ) : (!isLoading && !engagementByYear[selectedYear]) ||
            !selectedYear ? (
            <p className="text-[22px] font-bold text-center mt-12">
              No data found!
            </p>
          ) : (
            <ResponsiveContainer
              className="mt-4 border border-[#ebebeb] outline-none"
              width="100%"
              height="100%"
            >
              <BarChart
                data={engagementByYear[selectedYear]}
                barCategoryGap={2}
              >
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} width={40} />
                <Tooltip cursor={{ fill: "transparent" }} />
                <Bar
                  dataKey="value"
                  fill="#FFD400"
                  radius={[8, 8, 0, 0]}
                  animationDuration={600}
                />
              </BarChart>
            </ResponsiveContainer>
          )} */}
          {isLoading || !selectedYear ? (
            <ChartSkeleton />
          ) : (!isLoading && !engagementByYear[selectedYear]) ||
            !selectedYear ? (
            <p className="text-[22px] font-bold text-center mt-12">
              No data found!
            </p>
          ) : (
            <DashboardBarChart data={engagementByYear[selectedYear]} />
          )}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[340px_1fr_248px] gap-5">
        <DashboardRecentActivities />
        <DashboardRevenue />
        <DashboardTopCourses />
      </div>
    </div>
  );
};

export default DashboardLecturerMain;
