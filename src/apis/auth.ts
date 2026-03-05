/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "react-toastify";
import authorizedAxiosInstance from "../utils/authorizedAxios";
import { API_ROOT } from "../utils/constants";

// handle refresh token
const refreshTokenAPI = async () => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/users/refresh_token`,
  );
  return res.data;
};

// handle register new user
const registerUserAPI = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) => {
  const res = await authorizedAxiosInstance.post(
    `${API_ROOT}/v1/users/register`,
    data,
  );
  return res.data;
};

// handle verify new email
const verifyUserAPI = async (data: any) => {
  const res = await authorizedAxiosInstance.put(
    `${API_ROOT}/v1/users/verify`,
    data,
  );
  toast.success(
    "Verified account successfully!! Please login with your email address!!",
    { theme: "colored" },
  );
  return res.data;
};

// handle forgot password
const forgotPasswordAPI = async (data: { email: string }) => {
  const res = await authorizedAxiosInstance.post(
    `${API_ROOT}/v1/users/forgot-password`,
    data,
  );
  return res.data;
};

// handle reset password
const resetPasswordAPI = async (data: {
  token: string;
  newPassword: string;
}) => {
  const res = await authorizedAxiosInstance.post(
    `${API_ROOT}/v1/users/reset-password`,
    data,
  );
  return res.data;
};

export const authService = {
  refreshTokenAPI,
  registerUserAPI,
  verifyUserAPI,
  forgotPasswordAPI,
  resetPasswordAPI,
};
