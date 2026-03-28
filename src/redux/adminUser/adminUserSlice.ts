import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { adminUserService } from "../../apis/adminUser";
import type {
  AdminUserItem,
  AdminUsersPagination,
  AdminUsersQuery,
} from "../../types/adminUser.type";

interface AdminUserState {
  users: AdminUserItem[];
  pagination: AdminUsersPagination;
  currentQuery: AdminUsersQuery;
  selectedUser: AdminUserItem | null;
  listLoading: boolean;
  detailLoading: boolean;
  actionLoadingUserId: number | null;
  error: string | null;
}

const initialState: AdminUserState = {
  users: [],
  pagination: {
    page: 1,
    itemsPerPage: 6,
    total: 0,
    totalPages: 0,
  },
  currentQuery: {
    page: 1,
    itemsPerPage: 6,
  },
  selectedUser: null,
  listLoading: false,
  detailLoading: false,
  actionLoadingUserId: null,
  error: null,
};

export const fetchAdminUsersAPI = createAsyncThunk(
  "adminUser/fetchAdminUsersAPI",
  async (query: AdminUsersQuery) => {
    const res = await adminUserService.getAdminUsersAPI(query);
    return { ...res, query };
  },
);

export const fetchAdminUserDetailAPI = createAsyncThunk(
  "adminUser/fetchAdminUserDetailAPI",
  async (id: number) => {
    const res = await adminUserService.getAdminUserDetailAPI(id);
    return res as AdminUserItem;
  },
);

export const blockAdminUserAPI = createAsyncThunk(
  "adminUser/blockAdminUserAPI",
  async (payload: { id: number; blocked: boolean }) => {
    const res = await adminUserService.blockAdminUserAPI(payload);
    return {
      id: payload.id,
      blocked: payload.blocked,
      user: res as AdminUserItem,
    };
  },
);

export const deleteAdminUserAPI = createAsyncThunk(
  "adminUser/deleteAdminUserAPI",
  async (id: number) => {
    await adminUserService.deleteAdminUserAPI(id);
    return { id };
  },
);

const adminUserSlice = createSlice({
  name: "adminUser",
  initialState,
  reducers: {
    clearSelectedAdminUser: (state) => {
      state.selectedUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminUsersAPI.pending, (state) => {
        state.listLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminUsersAPI.fulfilled, (state, action) => {
        state.listLoading = false;
        state.users = action.payload.data ?? [];
        state.pagination = action.payload.pagination ?? state.pagination;
        state.currentQuery = action.payload.query;
      })
      .addCase(fetchAdminUsersAPI.rejected, (state, action) => {
        state.listLoading = false;
        state.error = action.error.message || "Failed to fetch users.";
      })
      .addCase(fetchAdminUserDetailAPI.pending, (state) => {
        state.detailLoading = true;
      })
      .addCase(fetchAdminUserDetailAPI.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchAdminUserDetailAPI.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.error.message || "Failed to fetch user detail.";
      })
      .addCase(blockAdminUserAPI.pending, (state, action) => {
        state.actionLoadingUserId = action.meta.arg.id;
      })
      .addCase(blockAdminUserAPI.fulfilled, (state, action) => {
        state.actionLoadingUserId = null;

        state.users = state.users.map((user) =>
          user.id === action.payload.id
            ? {
                ...user,
                isVerified: !action.payload.blocked,
              }
            : user,
        );

        if (state.selectedUser?.id === action.payload.id) {
          state.selectedUser = {
            ...state.selectedUser,
            isVerified: !action.payload.blocked,
          };
        }
      })
      .addCase(blockAdminUserAPI.rejected, (state, action) => {
        state.actionLoadingUserId = null;
        state.error = action.error.message || "Failed to update user status.";
      })
      .addCase(deleteAdminUserAPI.pending, (state, action) => {
        state.actionLoadingUserId = action.meta.arg;
      })
      .addCase(deleteAdminUserAPI.fulfilled, (state, action) => {
        state.actionLoadingUserId = null;
        state.users = state.users.filter((user) => user.id !== action.payload.id);

        if (state.selectedUser?.id === action.payload.id) {
          state.selectedUser = null;
        }
      })
      .addCase(deleteAdminUserAPI.rejected, (state, action) => {
        state.actionLoadingUserId = null;
        state.error = action.error.message || "Failed to delete user.";
      });
  },
});

export const { clearSelectedAdminUser } = adminUserSlice.actions;

export const adminUserReducer = adminUserSlice.reducer;

export const selectAdminUserState = (state: any): AdminUserState =>
  state.adminUser;
