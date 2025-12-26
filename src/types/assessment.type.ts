export interface AssessmentItem {
  id: number;
  title: string;
  course: string;
  submissions: string;
  avgScore: string | null;
  status: "Open" | "Closed";
}

export interface StudentSubmission {
  id: number;
  studentName: string;
  dateSubmitted: string;
  score: number;
  feedback: string | null;
}

export interface RevenueStatsProps {
  onWithdrawClick: () => void;
  availableBalance: number;
}
