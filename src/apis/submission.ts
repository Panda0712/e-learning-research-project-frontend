import authorizedAxiosInstance from "../utils/authorizedAxios";
import { API_ROOT } from "../utils/constants";
import type {
  GradeSubmissionPayload,
  NewSubmission,
  Submission,
} from "../types/submission.type";

const SUBMISSION_API_ROOT = `${API_ROOT}/v1/submissions`;

const createSubmissionAPI = async (data: NewSubmission): Promise<Submission> => {
  const response = await authorizedAxiosInstance.post(SUBMISSION_API_ROOT, data);
  return response.data;
};

const gradeSubmissionAPI = async (
  id: number,
  data: GradeSubmissionPayload,
): Promise<Submission> => {
  const response = await authorizedAxiosInstance.put(
    `${SUBMISSION_API_ROOT}/${id}/grade`,
    data,
  );
  return response.data;
};

const getSubmissionsByStudentIdAPI = async (
  studentId: number,
): Promise<Submission[]> => {
  const response = await authorizedAxiosInstance.get(
    `${SUBMISSION_API_ROOT}/student/${studentId}`,
  );
  return response.data;
};

const getSubmissionByIdAPI = async (id: number): Promise<Submission> => {
  const response = await authorizedAxiosInstance.get(
    `${SUBMISSION_API_ROOT}/${id}`,
  );
  return response.data;
};

export const submissionService = {
  createSubmissionAPI,
  gradeSubmissionAPI,
  getSubmissionsByStudentIdAPI,
  getSubmissionByIdAPI,
};
