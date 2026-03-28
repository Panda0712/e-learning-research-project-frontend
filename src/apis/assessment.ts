import type {
  Assessment,
  NewAssessment,
  UpdateAssessmentPayload,
} from "../types/assessment.type";
import type { Submission } from "../types/submission.type";
import authorizedAxiosInstance from "../utils/authorizedAxios";
import { API_ROOT } from "../utils/constants";

const ASSESSMENT_API_ROOT = `${API_ROOT}/v1/assessments`;

const getAssessmentsByLecturerIdAPI = async (
  lecturerId: number,
): Promise<Assessment[]> => {
  const response = await authorizedAxiosInstance.get(
    `${ASSESSMENT_API_ROOT}/lecturer-list/${lecturerId}`,
  );
  return response.data;
};

const createNewAssessmentAPI = async (
  data: NewAssessment,
): Promise<Assessment> => {
  const response = await authorizedAxiosInstance.post(
    `${ASSESSMENT_API_ROOT}/create-new`,
    data,
  );
  return response.data;
};

const getAssessmentByIdAPI = async (id: number): Promise<Assessment> => {
  const response = await authorizedAxiosInstance.get(
    `${ASSESSMENT_API_ROOT}/${id}`,
  );
  return response.data;
};

const updateAssessmentByIdAPI = async (
  id: number,
  data: UpdateAssessmentPayload,
): Promise<Assessment> => {
  const response = await authorizedAxiosInstance.put(
    `${ASSESSMENT_API_ROOT}/${id}`,
    data,
  );
  return response.data;
};

const deleteAssessmentByIdAPI = async (id: number): Promise<void> => {
  await authorizedAxiosInstance.delete(`${ASSESSMENT_API_ROOT}/${id}`);
};

const getSubmissionsByAssessmentIdAPI = async (
  assessmentId: number,
): Promise<Submission[]> => {
  const response = await authorizedAxiosInstance.get(
    `${ASSESSMENT_API_ROOT}/get-submissions-by-assessmentId/${assessmentId}`,
  );
  return response.data;
};

export const assessmentService = {
  getAssessmentsByLecturerIdAPI,
  createNewAssessmentAPI,
  getAssessmentByIdAPI,
  updateAssessmentByIdAPI,
  deleteAssessmentByIdAPI,
  getSubmissionsByAssessmentIdAPI,
};
