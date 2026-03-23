import authorizedAxiosInstance from "../../utils/authorizedAxios";
import { API_ROOT } from "../../utils/constants";

const createQuizAPI = async (payload: {
  lessonId: number;
  title: string;
  description: string;
  timeLimit: number;
  passingScore: number;
}) => {
  const res = await authorizedAxiosInstance.post(`${API_ROOT}/v1/quizzes`, payload);
  return res.data;
};

export const lecturerQuizService = {
  createQuizAPI,
};
