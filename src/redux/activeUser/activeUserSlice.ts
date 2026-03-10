/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import authorizedAxiosInstance from "../../utils/authorizedAxios";
import { API_ROOT } from "../../utils/constants";

const initialState = {
  currentUser: null,
};

export const loginUserAPI = createAsyncThunk(
  "user/loginUserAPI",
  async (data: { email: string; password: string }) => {
    const res = await authorizedAxiosInstance.post(
      `${API_ROOT}/v1/users/login`,
      data,
    );
    return res.data;
  },
);

export const loginOAuthUserAPI = createAsyncThunk(
  "user/loginOAuthUserAPI",
  async () => {
    const res = await authorizedAxiosInstance.get(
      `${API_ROOT}/v1/users/google`,
    );
    return res.data;
  },
);

export const logoutUserAPI = createAsyncThunk(
  "user/logoutUserAPI",
  async (showSuccessMessage: boolean = true, data) => {
    const res = await authorizedAxiosInstance.delete(
      `${API_ROOT}/v1/users/logout`,
      data,
    );
    if (showSuccessMessage) {
      toast.success("Logged out successfully!!!");
    }
    return res.data;
  },
);

export const updateUserAPI = createAsyncThunk(
  "user/updateUserAPI",
  async (data) => {
    const res = await authorizedAxiosInstance.put(
      `${API_ROOT}/v1/users/update`,
      data,
    );
    return res.data;
  },
);

export const fetchCurrentUserAPI = createAsyncThunk(
  "user/fetchCurrentUserAPI",
  async () => {
    const res = await authorizedAxiosInstance.get(`${API_ROOT}/v1/users/me`);
    return res.data;
  },
);

export const handleFacebookAuthAPI = createAsyncThunk(
  "user/handleFacebookAuthAPI",
  async ({ accessToken }: { accessToken: string }) => {
    const res = await authorizedAxiosInstance.post(
      `${API_ROOT}/v1/users/facebook`,
      { accessToken },
    );
    return res.data;
  },
);

export const startGoogleAuth = (redirectPath = "/auth/google/callback") => {
  const redirect = encodeURIComponent(
    `${window.location.origin}${redirectPath}`,
  );
  window.location.assign(`${API_ROOT}/v1/users/google?redirect=${redirect}`);
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUserAPI.fulfilled, (state, action) => {
      state.currentUser = action.payload;
    });
    builder.addCase(loginOAuthUserAPI.fulfilled, (state, action) => {
      state.currentUser = action.payload;
    });
    builder.addCase(logoutUserAPI.fulfilled, (state) => {
      state.currentUser = null;
    });
    builder.addCase(updateUserAPI.fulfilled, (state, action) => {
      state.currentUser = action.payload;
    });
    builder.addCase(handleFacebookAuthAPI.fulfilled, (state, action) => {
      state.currentUser = action.payload;
    });
  },
});

export const selectCurrentUser = (state: any) => {
  return state.user.currentUser;
};

export const { setCurrentUser } = userSlice.actions;

export const userReducer = userSlice.reducer;
