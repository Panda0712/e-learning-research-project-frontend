export interface StudentSubmission {
  id: number;
  studentName: string;
  dateSubmitted: string;
  score: number;
  feedback: string | null;
}

export interface RevenueStatsProps {
  onWithdrawClick: () => void;
  totalEarnings: number;
  thisMonthRevenue: number;
  availableBalance: number;
}

export interface Assessment {
  id: number;
  title: string;
  courseName?: string;
  courseId: number;
  totalSubmissions: number;
  averageScore: number | null;
  submissionsText?: string;
  status: "published" | "draft" | "Open" | "Closed";
  dueDate: string;
  lessonId?: number;
  type?: "Essay" | "Multiple Choice";
}

export interface NewAssessment {
  courseId: number;
  lessonId: number;
  title: string;
  type: "Essay" | "Multiple Choice";
  dueDate: string;
  status: "published" | "draft";
  totalSubmissions: number;
  averageScore: number;
}

export type UpdateAssessmentPayload = Partial<Assessment>;
