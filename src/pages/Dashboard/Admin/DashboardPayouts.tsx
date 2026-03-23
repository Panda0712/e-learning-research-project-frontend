/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { Settings, ChevronLeft, ChevronRight, CheckCircle2, XCircle } from "lucide-react";
import { getAllPayoutsAPI } from "../../../apis/payoutAdmin";

interface PayoutItem {
  id: number;
  transactionId: number | string;
  amount: number;
  createdAt: string;
  status: string;
  lecturer?: {
    avatar?: string;
    name?: string;
    email?: string;
  };
}

const DashboardPayouts = () => {
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [commissionRate, setCommissionRate] = useState("5%");

  const [historyData, setHistoryData] = useState<PayoutItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayouts = async () => {
      try {
        setLoading(true);
        const data = await getAllPayoutsAPI();
        setHistoryData(Array.isArray(data) ? data : data?.data || []);
      } catch (error:any) {
        toast.error(error?.message || "Failed to load payouts history!");
      } finally {
        setLoading(false);
      }
    };
    fetchPayouts();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(historyData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = historyData.slice(indexOfFirstItem, indexOfLastItem);

  const goToPage = (page: number) => setCurrentPage(page);
  const goToNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="px-6 pb-6 pt-0 min-h-screen font-poppins relative">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-2xl font-bold text-gray-800 mt-4">
          Payouts History
        </h1>

        <div className="relative mt-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowConfigModal(!showConfigModal);
            }}
            className={`p-2 rounded-full transition-colors ${showConfigModal ? "bg-blue-100 text-blue-600" : "hover:bg-gray-200 text-gray-600"}`}
          >
            <Settings size={24} />
          </button>

          {showConfigModal && (
            <div className="absolute right-0 top-full mt-2 z-50 w-87.5 bg-white rounded-xl shadow-2xl border border-gray-100 animate-scale-up p-6 origin-top-right">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Commission Configuration</h3>
              <div className="mb-6">
                <label className="text-sm text-gray-500 block mb-2">Platform Fee (%)</label>
                <input
                  type="text"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500 text-gray-700 font-medium"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowConfigModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowConfigModal(false)}
                  className="px-4 py-2 rounded-lg bg-[#FFD130] text-black font-bold hover:bg-[#eec225] shadow-sm text-sm"
                >
                  Save Configuration
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#EBEBEB]">
            <tr>
              <th className="p-4 text-sm font-bold text-gray-800 border-r border-white last:border-r-0">Avatar</th>
              <th className="p-4 text-sm font-bold text-gray-800 border-r border-white last:border-r-0">Lecturer</th>
              <th className="p-4 text-sm font-bold text-gray-800 border-r border-white last:border-r-0">Amount</th>
              <th className="p-4 text-sm font-bold text-gray-800 border-r border-white last:border-r-0">Date</th>
              <th className="p-4 text-sm font-bold text-gray-800 border-r border-white last:border-r-0">Status</th>
              <th className="p-4 text-sm font-bold text-gray-800">Transaction ID</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500 italic">Loading data...</td>
              </tr>
            ) : currentItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500 italic">You have no payouts history.</td>
              </tr>
            ) : (
              currentItems.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <img
                      src={item.lecturer?.avatar || "/avatar1.png"} 
                      alt="Ava"
                      className="w-10 h-10 rounded-full object-cover bg-gray-200"
                    />
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-gray-800 text-sm">
                      {item.lecturer?.name || "Unknown Lecturer"}
                    </div>
                    <div className="text-xs text-gray-500">
                      Email: {item.lecturer?.email || "No email"}
                    </div>
                  </td>
                  <td className="p-4 font-bold text-gray-800">${item.amount}</td>
                  <td className="p-4 text-sm text-gray-600">{formatDate(item.createdAt)}</td>
                  
                  {/* STATUS */}
                  <td className="p-4">
                    {item.status === 'success' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                        <CheckCircle2 size={14} /> Success
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                        <XCircle size={14} /> Failed
                      </span>
                    )}
                  </td>

                  <td className="p-4 text-sm font-medium text-gray-700">
                    {item.transactionId ? `#TXN-${item.transactionId}` : 'N/A'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 0 && (
        <div className="flex justify-center mt-6">
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm bg-white" aria-label="Pagination">
            <button
              onClick={goToPrev}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-l-md px-3 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} aria-hidden="true" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => goToPage(pageNum)}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset focus:z-20 focus:outline-offset-0 ${
                  currentPage === pageNum
                    ? "z-10 bg-black text-white ring-black"
                    : "text-gray-900 ring-gray-300 hover:bg-gray-50"
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              onClick={goToNext}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center rounded-r-md px-3 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default DashboardPayouts;
