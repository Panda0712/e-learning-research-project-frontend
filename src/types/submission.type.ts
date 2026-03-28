export interface NewSubmission {
  assessmentId: number;
  quizId: number;
  studentId: number;
  submittedAt?: string;
  status?: "submitted" | "in-progress";
}

export interface GradeSubmissionPayload {
  score: number;
  feedback?: string;
  status?: "graded";
}

export interface Submission {
  id: number;
  assessmentId: number;
  quizId: number;
  studentId: number;
  submittedAt: string;
  status: "submitted" | "in-progress" | "graded";
  score: number | null;
  feedback: string | null;
}
