import authorizedAxiosInstance from "../../utils/authorizedAxios";
import { API_ROOT } from "../../utils/constants";

const createQuizAPI = async (payload: {
  lessonId: number;
  title: string;
  description: string;
  timeLimit: number;
  passingScore: number;
}) => {
  const res = await authorizedAxiosInstance.post(
    `${API_ROOT}/v1/quizzes`,
    payload,
  );
  return res.data;
};

const updateQuizAPI = async (
  id: number,
  payload: {
    title?: string;
    description?: string;
    timeLimit?: number;
    passingScore?: number;
  },
) => {
  const res = await authorizedAxiosInstance.patch(
    `${API_ROOT}/v1/quizzes/by-id/${id}`,
    payload,
  );
  return res.data;
};

const deleteQuizAPI = async (id: number) => {
  const res = await authorizedAxiosInstance.delete(
    `${API_ROOT}/v1/quizzes/by-id/${id}`,
  );
  return res.data;
};

const getQuizzesByLessonAPI = async (lessonId: number) => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/quizzes/by-lesson/${lessonId}`,
  );

  return res.data;
};

const getQuizzesByIdAPI = async (id: number) => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/quizzes/by-id/${id}`,
  );

  return res.data;
};

export const lecturerQuizService = {
  createQuizAPI,
  updateQuizAPI,
  deleteQuizAPI,
  getQuizzesByLessonAPI,
  getQuizzesByIdAPI,
};
