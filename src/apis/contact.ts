import authorizedAxiosInstance from "../utils/authorizedAxios";
import { API_ROOT } from "../utils/constants";

const submitContactAPI = async (payload: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  comment: string;
}) => {
  const res = await authorizedAxiosInstance.post(
    `${API_ROOT}/v1/users/contact`,
    payload,
  );
  return res.data;
};

export const contactService = {
  submitContactAPI,
};
