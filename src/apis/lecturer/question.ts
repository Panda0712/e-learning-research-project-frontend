import authorizedAxiosInstance from "../../utils/authorizedAxios";
import { API_ROOT } from "../../utils/constants";

const createQuestionAPI = async (payload: {
  quizId: number;
  question: string;
  type: string;
  options: string[];
  correctAnswer: string;
  point: number;
}) => {
  const res = await authorizedAxiosInstance.post(
    `${API_ROOT}/v1/questions`,
    payload,
  );
  return res.data;
};

export const lecturerQuestionService = {
  createQuestionAPI,
};
