import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  dashboardService,
  type AdminUserDetailResponse,
  type AdminUserListItem,
} from "../../../apis/dashboard";
import { permissions } from "../../../configs/rbacConfig";
import { usePermission } from "../../../hooks/usePermission";
import { selectCurrentUser } from "../../../redux/activeUser/activeUserSlice";
import { useAppSelector } from "../../../redux/hooks";
import { ACCOUNT_ROLES } from "../../../utils/constants";

type UserTab = "lecturer" | "student";
type ConfirmAction = "block" | "delete";

const formatUserName = (user: {
  firstName?: string | null;
  lastName?: string | null;
  email: string;
}) => {
  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
  return fullName || user.email;
};

const formatDate = (date?: string | null) => {
  if (!date) return "-";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleDateString();
};

const DashboardUser = () => {
  const currentUser = useAppSelector(selectCurrentUser);
  const { hasPermission } = usePermission(currentUser?.role || "");

  const canManageUsers =
    currentUser?.role === ACCOUNT_ROLES.ADMIN &&
    hasPermission(permissions.VIEW_DASHBOARD_ADMIN);

  const [activeTab, setActiveTab] = useState<UserTab>("lecturer");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  const [users, setUsers] = useState<AdminUserListItem[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [detail, setDetail] = useState<AdminUserDetailResponse | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
  const [targetUser, setTargetUser] = useState<AdminUserListItem | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalUsers / itemsPerPage)),
    [totalUsers, itemsPerPage],
  );

  const fetchUsers = async () => {
    if (!canManageUsers) return;

    try {
      setIsLoading(true);
      setError(null);

      const res = await dashboardService.getAdminUsersAPI({
        page: currentPage,
        itemsPerPage,
        role: activeTab,
      });

      setUsers(res.users);
      setTotalUsers(res.totalUsers);
    } catch (apiError: any) {
      const message = apiError?.message || "Failed to load users.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, itemsPerPage]);

  useEffect(() => {
    fetchUsers();
  }, [activeTab, currentPage, itemsPerPage, canManageUsers]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const closeDetail = () => {
    setIsDetailOpen(false);
    setSelectedUserId(null);
    setDetail(null);
    setDetailError(null);
  };

  const handleView = async (user: AdminUserListItem) => {
    if (!canManageUsers) return;

    try {
      setOpenMenuId(null);
      setSelectedUserId(user.id);
      setIsDetailOpen(true);
      setIsDetailLoading(true);
      setDetailError(null);

      const res = await dashboardService.getAdminUserDetailAPI(user.id);
      setDetail(res);
    } catch (apiError: any) {
      const message = apiError?.message || "Failed to load user detail.";
      setDetailError(message);
      toast.error(message);
    } finally {
      setIsDetailLoading(false);
    }
  };

  const openConfirm = (action: ConfirmAction, user: AdminUserListItem) => {
    if (!canManageUsers) return;
    setOpenMenuId(null);
    setTargetUser(user);
    setConfirmAction(action);
  };

  const closeConfirm = () => {
    setTargetUser(null);
    setConfirmAction(null);
  };

  const handleConfirmAction = async () => {
    if (!targetUser || !confirmAction || !canManageUsers) return;

    try {
      setIsActionLoading(true);

      if (confirmAction === "block") {
        await dashboardService.blockAdminUserAPI({
          userId: targetUser.id,
          blocked: !targetUser.isBlocked,
        });
        toast.success(
          targetUser.isBlocked
            ? "User unblocked successfully."
            : "User blocked successfully.",
        );
      } else {
        await dashboardService.deleteAdminUserAPI(targetUser.id);
        toast.success("User deleted successfully.");

        if (selectedUserId === targetUser.id) {
          closeDetail();
        }
      }

      closeConfirm();
      await fetchUsers();

      if (selectedUserId && confirmAction === "block") {
        const refreshed = await dashboardService.getAdminUserDetailAPI(selectedUserId);
        setDetail(refreshed);
      }
    } catch (apiError: any) {
      toast.error(apiError?.message || "Action failed. Please try again.");
    } finally {
      setIsActionLoading(false);
    }
  };

  if (!canManageUsers) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] p-8">
        <h1 className="mb-6 font-inter text-4xl font-bold text-[#000000]">User</h1>
        <div className="rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-700">
          You do not have permission to manage users.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-inter text-4xl font-bold text-[#000000]">User</h1>
        <div className="flex items-center gap-2">
          <label htmlFor="itemsPerPage" className="text-sm text-slate-600">
            Items per page
          </label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={(event) => setItemsPerPage(Number(event.target.value))}
            className="rounded-lg border border-[#E8E8F4] bg-white px-3 py-2 text-sm text-[#333931]"
          >
            {[5, 8, 10, 20].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-6 flex gap-8 border-b border-[#E8E8F4]">
        <button
          onClick={() => setActiveTab("lecturer")}
          className={`pb-3 font-poppins text-sm font-medium transition ${
            activeTab === "lecturer"
              ? "border-b-2 border-[#3B82F6] text-[#3B82F6]"
              : "text-[#475569] hover:text-[#000000]"
          }`}
        >
          Lecturer
        </button>
        <button
          onClick={() => setActiveTab("student")}
          className={`pb-3 font-poppins text-sm font-medium transition ${
            activeTab === "student"
              ? "border-b-2 border-[#3B82F6] text-[#3B82F6]"
              : "text-[#475569] hover:text-[#000000]"
          }`}
        >
          Student
        </button>
      </div>

      {error && (
        <div className="mb-4 flex items-center justify-between rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>
          <button
            onClick={fetchUsers}
            className="rounded-md bg-white px-3 py-1 font-medium text-red-700"
          >
            Retry
          </button>
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-[#E8E8F4] bg-white">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#E8E8F4]">
              <th className="px-6 py-4 text-left font-poppins text-sm font-medium text-[#333931]">Avatar</th>
              <th className="px-6 py-4 text-left font-poppins text-sm font-medium text-[#333931]">User Info</th>
              <th className="px-6 py-4 text-left font-poppins text-sm font-medium text-[#333931]">Role</th>
              <th className="px-6 py-4 text-left font-poppins text-sm font-medium text-[#333931]">
                {activeTab === "lecturer" ? "Courses" : "Enrolled"}
              </th>
              <th className="px-6 py-4 text-left font-poppins text-sm font-medium text-[#333931]">Join Date</th>
              <th className="px-6 py-4 text-left font-poppins text-sm font-medium text-[#333931]">Status</th>
              <th className="px-6 py-4" />
            </tr>
          </thead>
          <tbody>
            {isLoading &&
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={`loading-${idx}`} className="border-b border-[#E8E8F4] last:border-b-0">
                  <td className="px-6 py-4"><div className="h-10 w-10 animate-pulse rounded-full bg-slate-200" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-40 animate-pulse rounded bg-slate-200" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-20 animate-pulse rounded bg-slate-200" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-16 animate-pulse rounded bg-slate-200" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-24 animate-pulse rounded bg-slate-200" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-16 animate-pulse rounded bg-slate-200" /></td>
                  <td className="px-6 py-4" />
                </tr>
              ))}

            {!isLoading && users.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-sm text-slate-500">
                  No users found.
                </td>
              </tr>
            )}

            {!isLoading &&
              users.map((user) => (
                <tr key={user.id} className="border-b border-[#E8E8F4] last:border-b-0">
                  <td className="px-6 py-4">
                    <div className="h-10 w-10 overflow-hidden rounded-full bg-[#9D9D9D]">
                      {user.avatar?.fileUrl ? (
                        <img src={user.avatar.fileUrl} alt={formatUserName(user)} className="h-full w-full object-cover" />
                      ) : null}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-poppins text-sm text-[#000000]">{formatUserName(user)}</p>
                    <p className="font-poppins text-xs text-[#475569]">Email: {user.email}</p>
                  </td>
                  <td className="px-6 py-4 font-poppins text-sm capitalize text-[#000000]">{user.role}</td>
                  <td className="px-6 py-4 font-poppins text-sm text-[#000000]">
                    {activeTab === "lecturer" ? user.totalCourses : user.totalEnrollments}
                  </td>
                  <td className="px-6 py-4 font-poppins text-sm text-[#000000]">{formatDate(user.createdAt)}</td>
                  <td className="px-6 py-4">
                    {user.isBlocked ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FC6441]/10 px-3 py-1 font-poppins text-xs font-medium text-[#FC6441]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#FC6441]" />
                        Blocked
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 font-poppins text-xs font-medium text-green-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
                        Active
                      </span>
                    )}
                  </td>
                  <td className="relative px-6 py-4">
                    <button
                      onClick={() => setOpenMenuId((prev) => (prev === user.id ? null : user.id))}
                      className="text-xl text-[#333931] hover:text-[#000000]"
                    >
                      ...
                    </button>
                    {openMenuId === user.id && (
                      <div className="absolute right-8 top-12 z-10 w-40 overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/5">
                        <button
                          onClick={() => handleView(user)}
                          className="flex w-full items-center gap-2 px-4 py-2 font-poppins text-sm text-[#000000] hover:bg-[#F5F7FA]"
                        >
                          View detail
                        </button>
                        <button
                          onClick={() => openConfirm("block", user)}
                          className="flex w-full items-center gap-2 px-4 py-2 font-poppins text-sm text-[#000000] hover:bg-[#F5F7FA]"
                        >
                          {user.isBlocked ? "Unblock" : "Block"}
                        </button>
                        <button
                          onClick={() => openConfirm("delete", user)}
                          className="flex w-full items-center gap-2 px-4 py-2 font-poppins text-sm text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {!isLoading && users.length > 0 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E8E8F4] bg-white font-poppins text-sm text-[#333931] disabled:cursor-not-allowed disabled:opacity-50"
          >
            &lt;
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`flex h-9 w-9 items-center justify-center rounded-lg font-poppins text-sm ${
                currentPage === pageNum
                  ? "bg-[#3B82F6] text-white"
                  : "border border-[#E8E8F4] bg-white text-[#333931]"
              }`}
            >
              {pageNum}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E8E8F4] bg-white font-poppins text-sm text-[#333931] disabled:cursor-not-allowed disabled:opacity-50"
          >
            &gt;
          </button>
        </div>
      )}

      {isDetailOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-5xl overflow-auto rounded-xl bg-white">
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">User Detail</h2>
              <button
                onClick={closeDetail}
                className="rounded-md bg-slate-100 px-3 py-1.5 text-sm text-slate-700"
              >
                Close
              </button>
            </div>

            <div className="p-6">
              {isDetailLoading && <p className="text-sm text-slate-600">Loading user detail...</p>}
              {detailError && <p className="text-sm text-red-600">{detailError}</p>}

              {!isDetailLoading && !detailError && detail && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-lg border border-slate-200 p-4">
                      <h3 className="mb-3 font-semibold text-slate-900">Profile</h3>
                      <p className="text-sm text-slate-700">Name: {formatUserName(detail.profile)}</p>
                      <p className="text-sm text-slate-700">Email: {detail.profile.email}</p>
                      <p className="text-sm text-slate-700">Phone: {detail.profile.phoneNumber || "-"}</p>
                      <p className="text-sm capitalize text-slate-700">Role: {detail.profile.role}</p>
                      <p className="text-sm text-slate-700">
                        Status: {detail.profile.isBlocked ? "Blocked" : "Active"}
                      </p>
                    </div>

                    <div className="rounded-lg border border-slate-200 p-4">
                      <h3 className="mb-3 font-semibold text-slate-900">Lecturer Profile</h3>
                      <p className="text-sm text-slate-700">
                        Professional title: {detail.profile.lecturerProfile?.professionalTitle || "-"}
                      </p>
                      <p className="text-sm text-slate-700">
                        Highest degree: {detail.profile.lecturerProfile?.highestDegree || "-"}
                      </p>
                      <p className="text-sm text-slate-700">
                        Nationality: {detail.profile.lecturerProfile?.nationality || "-"}
                      </p>
                      <p className="text-sm text-slate-700">
                        Bio: {detail.profile.lecturerProfile?.bio || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg border border-slate-200 p-4">
                    <h3 className="mb-3 font-semibold text-slate-900">
                      {detail.profile.role === "lecturer" ? "Courses" : "Enrolled Courses"}
                    </h3>
                    {detail.profile.role === "lecturer" ? (
                      detail.courses.length ? (
                        <div className="space-y-2">
                          {detail.courses.map((course) => (
                            <div key={course.id} className="rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-700">
                              {course.name} | status: {course.status || "-"} | students: {course.totalStudents || 0}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-500">No courses.</p>
                      )
                    ) : detail.enrolledCourses.length ? (
                      <div className="space-y-2">
                        {detail.enrolledCourses.map((enrollment) => (
                          <div key={enrollment.id} className="rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-700">
                            {enrollment.course.name} | status: {enrollment.status || "-"} | progress: {Math.round(enrollment.progress || 0)}%
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500">No enrolled courses.</p>
                    )}
                  </div>

                  <div className="rounded-lg border border-slate-200 p-4">
                    <h3 className="mb-3 font-semibold text-slate-900">Transactions</h3>
                    {detail.transactions.length ? (
                      <div className="space-y-2">
                        {detail.transactions.map((transaction) => (
                          <div key={transaction.id} className="rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-700">
                            #{transaction.id} | {transaction.paymentMethod || "-"} | ${transaction.amount || 0} | {transaction.status || "-"}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500">No transactions.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {confirmAction && targetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
            <h3 className="mb-3 text-lg font-semibold text-slate-900">Confirmation</h3>
            <p className="mb-6 text-sm text-slate-700">
              {confirmAction === "delete"
                ? "This action will permanently remove this user from the list. Are you sure you want to continue?"
                : targetUser.isBlocked
                  ? "Are you sure you want to unblock this user account?"
                  : "Are you sure you want to block this user account?"}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={closeConfirm}
                disabled={isActionLoading}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                disabled={isActionLoading}
                className={`rounded-lg px-4 py-2 text-sm text-white ${
                  confirmAction === "delete" ? "bg-red-600" : "bg-[#3B82F6]"
                }`}
              >
                {isActionLoading ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardUser;
