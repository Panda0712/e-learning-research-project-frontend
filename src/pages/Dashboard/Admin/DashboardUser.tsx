import { useEffect, useMemo, useState } from "react";
import Pagination from "../../../components/ui/Pagination";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  blockAdminUserAPI,
  clearSelectedAdminUser,
  deleteAdminUserAPI,
  fetchAdminUserDetailAPI,
  fetchAdminUsersAPI,
  selectAdminUserState,
} from "../../../redux/adminUser/adminUserSlice";
import type { AdminUsersQuery } from "../../../types/adminUser.type";
import { DEFAULT_ITEMS_PER_PAGE } from "../../../utils/constants";
import { toast } from "react-toastify";

type RoleFilter = "all" | "student" | "lecturer";

const roleOptions: Array<{ label: string; value: RoleFilter }> = [
  { label: "All", value: "all" },
  { label: "Student", value: "student" },
  { label: "Lecturer", value: "lecturer" },
];

const formatFullName = (firstName?: string | null, lastName?: string | null) => {
  const normalized = `${firstName ?? ""} ${lastName ?? ""}`.trim();
  return normalized || "N/A";
};

const formatRole = (role: string) => {
  if (role === "student") return "Student";
  if (role === "lecturer") return "Lecturer";
  if (role === "admin") return "Admin";
  return role;
};

const formatDateTime = (value?: string | null) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

const ConfirmActionModal = ({
  isOpen,
  title,
  description,
  confirmText,
  danger,
  loading,
  onConfirm,
  onClose,
}: {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText: string;
  danger?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="mt-2 text-sm text-slate-600">{description}</p>
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
              danger ? "bg-rose-600 hover:bg-rose-700" : "bg-amber-500 hover:bg-amber-600"
            }`}
          >
            {loading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

const UserDetailModal = ({
  isOpen,
  loading,
  onClose,
}: {
  isOpen: boolean;
  loading: boolean;
  onClose: () => void;
}) => {
  const { selectedUser } = useAppSelector(selectAdminUserState);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-xl rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between">
          <h3 className="text-lg font-semibold text-slate-900">User Detail</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-500 transition hover:text-slate-700"
          >
            Close
          </button>
        </div>

        {loading ? (
          <p className="py-10 text-center text-sm text-slate-500">Loading user detail...</p>
        ) : !selectedUser ? (
          <p className="py-10 text-center text-sm text-slate-500">No user detail found.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 text-sm text-slate-700 md:grid-cols-2">
            <div>
              <p className="text-slate-500">Full Name</p>
              <p className="font-medium text-slate-900">
                {formatFullName(selectedUser.firstName, selectedUser.lastName)}
              </p>
            </div>
            <div>
              <p className="text-slate-500">Email</p>
              <p className="font-medium text-slate-900">{selectedUser.email}</p>
            </div>
            <div>
              <p className="text-slate-500">Role</p>
              <p className="font-medium text-slate-900">{formatRole(selectedUser.role)}</p>
            </div>
            <div>
              <p className="text-slate-500">Status</p>
              <p className="font-medium text-slate-900">
                {selectedUser.isVerified ? "Active" : "Blocked"}
              </p>
            </div>
            <div>
              <p className="text-slate-500">Phone Number</p>
              <p className="font-medium text-slate-900">{selectedUser.phoneNumber || "N/A"}</p>
            </div>
            <div>
              <p className="text-slate-500">Date Of Birth</p>
              <p className="font-medium text-slate-900">{formatDateTime(selectedUser.dateOfBirth)}</p>
            </div>
            <div>
              <p className="text-slate-500">Joined At</p>
              <p className="font-medium text-slate-900">{formatDateTime(selectedUser.createdAt)}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const DashboardUser = () => {
  const dispatch = useAppDispatch();
  const {
    users,
    pagination,
    listLoading,
    detailLoading,
    actionLoadingUserId,
    error,
  } = useAppSelector(selectAdminUserState);

  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [openMenuUserId, setOpenMenuUserId] = useState<number | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [confirmState, setConfirmState] = useState<{
    open: boolean;
    userId: number | null;
    action: "block" | "unblock" | "delete";
  }>({
    open: false,
    userId: null,
    action: "block",
  });

  const currentQuery = useMemo<AdminUsersQuery>(() => {
    return {
      page,
      itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
      ...(roleFilter !== "all" ? { role: roleFilter } : {}),
    };
  }, [page, roleFilter]);

  useEffect(() => {
    dispatch(fetchAdminUsersAPI(currentQuery));
  }, [dispatch, currentQuery]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleRoleChange = (value: RoleFilter) => {
    setRoleFilter(value);
    setPage(1);
  };

  const handleViewDetail = async (userId: number) => {
    setOpenMenuUserId(null);
    setDetailOpen(true);
    try {
      await dispatch(fetchAdminUserDetailAPI(userId)).unwrap();
    } catch {
      setDetailOpen(false);
      toast.error("Cannot load user detail.");
    }
  };

  const closeDetail = () => {
    setDetailOpen(false);
    dispatch(clearSelectedAdminUser());
  };

  const openConfirm = (
    userId: number,
    action: "block" | "unblock" | "delete",
  ) => {
    setOpenMenuUserId(null);
    setConfirmState({ open: true, userId, action });
  };

  const closeConfirm = () => {
    if (!actionLoadingUserId) {
      setConfirmState({ open: false, userId: null, action: "block" });
    }
  };

  const refreshListAfterAction = async (afterDelete = false) => {
    const shouldMovePrevPage = afterDelete && users.length === 1 && page > 1;
    const nextPage = shouldMovePrevPage ? page - 1 : page;
    if (nextPage !== page) {
      setPage(nextPage);
      return;
    }

    await dispatch(
      fetchAdminUsersAPI({
        page: nextPage,
        itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
        ...(roleFilter !== "all" ? { role: roleFilter } : {}),
      }),
    );
  };

  const confirmAction = async () => {
    if (!confirmState.userId) return;

    try {
      if (confirmState.action === "delete") {
        await dispatch(deleteAdminUserAPI(confirmState.userId)).unwrap();
        toast.success("Deleted user successfully.");
        await refreshListAfterAction(true);
      } else {
        const blocked = confirmState.action === "block";
        await dispatch(
          blockAdminUserAPI({ id: confirmState.userId, blocked }),
        ).unwrap();
        toast.success(
          blocked ? "Blocked user successfully." : "Unblocked user successfully.",
        );
        await refreshListAfterAction(false);
      }

      setConfirmState({ open: false, userId: null, action: "block" });
    } catch {
      toast.error("Action failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-inter text-4xl font-bold text-[#000000]">User</h1>

        <div className="flex items-center gap-2 rounded-lg border border-[#E8E8F4] bg-white p-1">
          {roleOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleRoleChange(option.value)}
              className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                roleFilter === option.value
                  ? "bg-[#3B82F6] text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-[#E8E8F4] bg-white">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#E8E8F4]">
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">#</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Full Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Role</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Joined</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>

          <tbody>
            {listLoading ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-sm text-slate-500">
                  Loading users...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-sm text-slate-500">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr key={user.id} className="border-b border-[#E8E8F4] last:border-b-0">
                  <td className="px-6 py-4 text-sm text-slate-700">
                    {user.stt ?? (page - 1) * DEFAULT_ITEMS_PER_PAGE + index + 1}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">
                    {formatFullName(user.firstName, user.lastName)}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{formatRole(user.role)}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                        user.isVerified
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {user.isVerified ? "Active" : "Blocked"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">
                    {formatDateTime(user.createdAt)}
                  </td>
                  <td className="relative px-6 py-4 text-right">
                    <button
                      type="button"
                      className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 transition hover:bg-slate-50"
                      onClick={() =>
                        setOpenMenuUserId((prev) => (prev === user.id ? null : user.id))
                      }
                    >
                      Manage
                    </button>

                    {openMenuUserId === user.id && (
                      <div className="absolute right-6 top-14 z-20 w-44 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
                        <button
                          type="button"
                          onClick={() => handleViewDetail(user.id)}
                          className="block w-full px-4 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                        >
                          View Detail
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            openConfirm(user.id, user.isVerified ? "block" : "unblock")
                          }
                          className="block w-full px-4 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                        >
                          {user.isVerified ? "Block" : "Unblock"}
                        </button>
                        <button
                          type="button"
                          onClick={() => openConfirm(user.id, "delete")}
                          className="block w-full px-4 py-2 text-left text-sm text-rose-600 transition hover:bg-rose-50"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination.totalPages > 1 ? (
        <Pagination
          type="dashboard"
          currentPage={pagination.page || page}
          totalPages={pagination.totalPages}
          onChange={setPage}
        />
      ) : null}

      <UserDetailModal
        isOpen={detailOpen}
        loading={detailLoading}
        onClose={closeDetail}
      />

      <ConfirmActionModal
        isOpen={confirmState.open}
        title={
          confirmState.action === "delete"
            ? "Delete user"
            : confirmState.action === "block"
              ? "Block user"
              : "Unblock user"
        }
        description={
          confirmState.action === "delete"
            ? "This action will remove the selected account from active users."
            : confirmState.action === "block"
              ? "The selected user will not be able to access their account until unblocked."
              : "The selected user will be able to use the account again."
        }
        confirmText={
          confirmState.action === "delete"
            ? "Delete"
            : confirmState.action === "block"
              ? "Block"
              : "Unblock"
        }
        danger={confirmState.action === "delete"}
        loading={Boolean(actionLoadingUserId)}
        onConfirm={confirmAction}
        onClose={closeConfirm}
      />
    </div>
  );
};

export default DashboardUser;
