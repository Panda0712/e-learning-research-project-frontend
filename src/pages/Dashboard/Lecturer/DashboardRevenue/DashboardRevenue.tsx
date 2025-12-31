import { ArrowUpDown, Search } from "lucide-react";
import { useState } from "react";
import Pagination from "../../../../components/Pagination/Pagination";

import RevenueChart from "./RevenueChart/RevenueChart";
import RevenueStats from "./RevenueStats/RevenueStats";
import WithdrawModal from "./WithdrawModal/WithdrawModal";

const TRANSACTIONS = [
  {
    id: 1,
    customer: "Jon Doe",
    date: "12/04/2024",
    course: "Python Basic",
    amount: 95.0,
  },
  {
    id: 2,
    customer: "Jon Doe",
    date: "12/04/2024",
    course: "Python Basic",
    amount: 95.0,
  },
  {
    id: 3,
    customer: "Jon Doe",
    date: "12/04/2024",
    course: "Python Basic",
    amount: 95.0,
  },
  {
    id: 4,
    customer: "Jon Doe",
    date: "12/04/2024",
    course: "Python Basic",
    amount: 95.0,
  },
  {
    id: 5,
    customer: "Jon Doe",
    date: "12/04/2024",
    course: "Python Basic",
    amount: 95.0,
  },
];

const DashboardRevenue = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3;

  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  const currentBalance = 103.52;

  return (
    <div className="w-full relative">
      {" "}
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Revenue Transaction
      </h1>
      <RevenueStats
        onWithdrawClick={() => setIsWithdrawModalOpen(true)}
        availableBalance={currentBalance}
      />
      <RevenueChart />
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
                {TRANSACTIONS.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item.customer}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item.date}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {item.course}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-bold">
                      ${item.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
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
        availableBalance={currentBalance}
      />
    </div>
  );
};

export default DashboardRevenue;
