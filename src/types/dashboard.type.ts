export type DashboardPeriod =
  | "all_time"
  | "last_month"
  | "this_month"
  | "this_year"
  | "custom";

export interface DashboardChartQuery {
  period?: DashboardPeriod;
  from?: string;
  to?: string;
}

export interface AdminOverviewResponse {
  cards: {
    totalStudents: number;
    totalInstructors: number;
    totalRevenue: number;
    pendingCourses: number;
    newEnrollments: number;
    totalTransactions: number;
  };
  lists: {
    pendingApprovals: Array<{
      type: string;
      avatar?: string | null;
      title: string;
      time: string;
      status?: string;
    }>;
    topCourses: Array<{
      id: number;
      name: string;
      totalStudents: number;
      thumbnail?: string | null;
    }>;
  };
}

export interface LecturerOverviewResponse {
  card: {
    totalStudents: number;
    coursesActive: number;
    totalEarnings: number;
    assignmentsGraded: number;
    completedCourses: number;
    newEnrollments: number;
  };
  recentActivities: Array<{
    type: string;
    avatar?: string | null;
    title: string;
    time: string;
  }>;
  topCourses: Array<{
    id: number;
    name: string;
    totalStudents: number;
  }>;
}

export interface DashboardChartsResponse {
  period: string;
  groupBy: "day" | "month";
  labels: string[];
  datasets: {
    signup?: number[];
    revenue: number[];
    engagement?: number[];
  };
}
