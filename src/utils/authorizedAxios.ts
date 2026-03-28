/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { toast } from "react-toastify";
import { authService } from "../apis/auth";
import { logoutUserAPI } from "../redux/activeUser/activeUserSlice";
import { interceptorLoadingElements } from "./helpers";

let axiosReduxStore: any;

export const injectStore = (mainStore: any) => {
  axiosReduxStore = mainStore;
};

const authorizedAxiosInstance = axios.create();

authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10;

authorizedAxiosInstance.defaults.withCredentials = true;

authorizedAxiosInstance.interceptors.request.use(
  (config) => {
    interceptorLoadingElements(true);

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

let refreshTokenPromise: Promise<string> | null = null;

authorizedAxiosInstance.interceptors.response.use(
  (response) => {
    interceptorLoadingElements(false);

    return response;
  },
  (error) => {
    interceptorLoadingElements(false);

    if (error.response?.status === 401) {
      axiosReduxStore.dispatch(logoutUserAPI(false));
    }

    const originalRequests = error.config;
    if (error.response?.status === 410 && !originalRequests._retry) {
      originalRequests._retry = true;

      if (!refreshTokenPromise) {
        refreshTokenPromise = authService
          .refreshTokenAPI()
          .then((data) => data?.accessToken)
          .catch((error) => {
            axiosReduxStore.dispatch(logoutUserAPI(false));
            return Promise.reject(error);
          })
          .finally(() => {
            refreshTokenPromise = null;
          });
      }

      return refreshTokenPromise.then(() => {
        return authorizedAxiosInstance(originalRequests);
      });
    }

    let errorMessage = error?.message;
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    if (error.response?.status !== 410) {
      toast.error(errorMessage);
    }

    return Promise.reject(error);
  },
);

export default authorizedAxiosInstance;
