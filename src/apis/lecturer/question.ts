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

const getQuestionsByIdAPI = async (id: number) => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/questions/by-id/${id}`,
  );
  return res.data;
};

const getQuestionsByQuizAPI = async (quizId: number) => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/questions/by-quiz/${quizId}`,
  );
  return res.data;
};

export const lecturerQuestionService = {
  createQuestionAPI,
  getQuestionsByIdAPI,
  getQuestionsByQuizAPI,
};
