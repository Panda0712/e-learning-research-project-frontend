import { ArrowUpDown, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Pagination from "../../../components/ui/Pagination";

import { AxiosError } from "axios";
import { dashboardService } from "../../../apis/dashboard";
import { payoutAdminService } from "../../../apis/payoutAdmin";
import { transactionService } from "../../../apis/transaction";
import RevenueChart from "../../../components/dashboard/lecturer/revenue/RevenueChart";
import RevenueStats from "../../../components/dashboard/lecturer/revenue/RevenueStats";
import WithdrawModal from "../../../components/dashboard/lecturer/revenue/WithdrawModal";
import { selectCurrentUser } from "../../../redux/activeUser/activeUserSlice";
import { useAppSelector } from "../../../redux/hooks";

// Copied from types/transaction.type.ts to avoid import issues
interface TransactionItem {
  courseId: number;
  courseTitle: string;
  instructorName: string;
  discountAmount: number;
  discountCode: string | null;
}
interface Transaction {
  id: number;
  userId: number;
  userEmail: string;
  userFullName: string;
  amount: number;
  paymentMethod: string;
  status: string;
  gatewayReference: string;
  createdAt: string;
  items: TransactionItem[];
}

type CurrentUserLike = {
  id?: number | string;
  userId?: number | string;
  user?: { id?: number | string };
  data?: { id?: number | string };
};

const extractCards = (payload: any) =>
  payload?.cards || payload?.data?.cards || payload?.data?.data?.cards || null;

const extractChart = (payload: any) =>
  payload?.labels && payload?.datasets
    ? payload
    : payload?.data?.labels && payload?.data?.datasets
      ? payload.data
      : payload?.data?.data?.labels && payload?.data?.data?.datasets
        ? payload.data.data
        : null;

const extractPayoutRows = (payload: any) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  if (Array.isArray(payload?.rows)) return payload.rows;
  if (Array.isArray(payload?.data?.rows)) return payload.data.rows;
  return [];
};

const DashboardRevenue = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  const currentUser = useAppSelector(
    selectCurrentUser,
  ) as CurrentUserLike | null;

  const lecturerId = Number(
    currentUser?.id ??
      currentUser?.userId ??
      currentUser?.user?.id ??
      currentUser?.data?.id,
  );

  const [revenueChartData, setRevenueChartData] = useState<
    { name: string; revenue: number }[]
  >([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [thisMonthRevenue, setThisMonthRevenue] = useState(0);
  const [availableBalance, setAvailableBalance] = useState(0);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isTransactionsLoading, setIsTransactionsLoading] = useState(true);
  const [transactionsError, setTransactionsError] = useState<string | null>(
    null,
  );

  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = transactions.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.max(1, Math.ceil(transactions.length / itemsPerPage));

  const handleWithdrawSuccess = (withdrawAmount: number) => {
    setAvailableBalance((prev) =>
      Math.max(0, prev - Number(withdrawAmount || 0)),
    );
  };

  const fetchRevenueData = useCallback(async () => {
    try {
      const requests: Array<Promise<unknown>> = [
        dashboardService.getLecturerOverviewAPI(),
        dashboardService.getLecturerChartsAPI({ period: "this_year" }),
        dashboardService.getLecturerChartsAPI({ period: "this_month" }),
      ];

      const canFetchPayouts = Number.isFinite(lecturerId) && lecturerId > 0;
      if (canFetchPayouts) {
        requests.push(
          payoutAdminService.getPayoutsByLecturerIdAPI(lecturerId, {
            page: 1,
            limit: 1000,
          }),
        );
      }

      const [overviewResult, yearlyResult, monthlyResult, payoutsResult] =
        await Promise.allSettled(requests);

      const overviewPayload =
        overviewResult.status === "fulfilled" ? overviewResult.value : null;
      const yearlyPayload =
        yearlyResult.status === "fulfilled" ? yearlyResult.value : null;
      const monthlyPayload =
        monthlyResult.status === "fulfilled" ? monthlyResult.value : null;
      const payoutsPayload =
        payoutsResult.status === "fulfilled" ? payoutsResult.value : null;

      const overviewCards = extractCards(overviewPayload);
      const yearlyChartResponse = extractChart(yearlyPayload);
      const monthlyChartResponse = extractChart(monthlyPayload);
      const payoutItems = extractPayoutRows(payoutsPayload);

      if (yearlyChartResponse) {
        const transformedData = yearlyChartResponse.labels.map(
          (label: string, index: number) => ({
            name: label,
            revenue: yearlyChartResponse.datasets.revenue[index] ?? 0,
          }),
        );
        setRevenueChartData(transformedData);
      }

      const monthRevenue = (
        monthlyChartResponse?.datasets.revenue || []
      ).reduce((sum: number, value: number) => sum + (value || 0), 0);
      setThisMonthRevenue(monthRevenue);

      const totalPaidOut = payoutItems.reduce(
        (
          sum: number,
          payout: {
            amount?: number | null;
            status?: string | null;
            transactionId?: number | null;
          },
        ) => {
          const isFinalizedPayout =
            String(payout?.status || "").toLowerCase() === "success" &&
            Number(payout?.transactionId || 0) > 0;

          return isFinalizedPayout ? sum + Number(payout?.amount || 0) : sum;
        },
        0,
      );

      const earnings = Number(overviewCards?.totalEarnings ?? 0);

      const fallbackEarningsFromChart = Number(
        (yearlyChartResponse?.datasets?.revenue || []).reduce(
          (sum: number, value: number) => sum + Number(value || 0),
          0,
        ),
      );

      const resolvedEarnings =
        earnings > 0 ? earnings : fallbackEarningsFromChart;

      setTotalEarnings(resolvedEarnings);
      setAvailableBalance(Math.max(0, resolvedEarnings - totalPaidOut));

      if (overviewResult.status === "rejected") {
        throw overviewResult.reason;
      }
      if (yearlyResult.status === "rejected") {
        console.warn("Yearly revenue chart fetch failed", yearlyResult.reason);
      }
      if (monthlyResult.status === "rejected") {
        console.warn(
          "Monthly revenue chart fetch failed",
          monthlyResult.reason,
        );
      }
      if (payoutsResult.status === "rejected") {
        console.warn("Payout history fetch failed", payoutsResult.reason);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch revenue data";
        toast.error(errorMessage);
      }
    }
  }, [lecturerId]);

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsTransactionsLoading(true);
      setTransactionsError(null);
      try {
        const response = await transactionService.getAllTransactionsAPI();
        setTransactions(response);
      } catch (error) {
        if (error instanceof AxiosError) {
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Failed to fetch transactions";
          setTransactionsError(errorMessage);
          toast.error(errorMessage);
        }
      } finally {
        setIsTransactionsLoading(false);
      }
    };

    fetchRevenueData();
    fetchTransactions();
  }, [lecturerId, fetchRevenueData]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <div className="w-full relative">
      {" "}
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Revenue Transaction
      </h1>
      <RevenueStats
        onWithdrawClick={() => setIsWithdrawModalOpen(true)}
        totalEarnings={totalEarnings}
        thisMonthRevenue={thisMonthRevenue}
        availableBalance={availableBalance}
      />
      <RevenueChart data={revenueChartData} />
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Transactions</h2>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="relative w-full max-w-xs">
              <input
                type="text"
                placeholder="Search User"
                className="pl-4 pr-10 py-2 w-full text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <Search
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-blue-600">
                      Customer{" "}
                      <ArrowUpDown size={14} className="text-gray-400" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-blue-600">
                      Date <ArrowUpDown size={14} className="text-gray-400" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900">
                    Course Name
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-blue-600">
                      Amount <ArrowUpDown size={14} className="text-gray-400" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isTransactionsLoading ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-gray-500">
                      Loading transactions...
                    </td>
                  </tr>
                ) : transactionsError ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-red-500">
                      Error: {transactionsError}
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-gray-500">
                      No transactions found.
                    </td>
                  </tr>
                ) : (
                  currentTransactions.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {item.userFullName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {item.items.map((i) => i.courseTitle).join(", ")}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-bold">
                        ${item.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-gray-100 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onChange={(page) => setCurrentPage(page)}
              type="secondary"
            />
          </div>
        </div>
      </div>
      <WithdrawModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        lecturerId={
          Number.isFinite(lecturerId) && lecturerId > 0 ? lecturerId : undefined
        }
        availableBalance={availableBalance}
        onWithdrawSuccess={handleWithdrawSuccess}
      />
    </div>
  );
};

export default DashboardRevenue;
