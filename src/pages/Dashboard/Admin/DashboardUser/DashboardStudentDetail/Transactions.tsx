import { Search } from "lucide-react";

interface TransactionsProps {
  studentId: number;
}

interface Transaction {
  id: string;
  date: string;
  courseName: string;
  paymentMethod: string;
  amount: string;
}

const mockTransactions: Transaction[] = [
  { id: "#PY-001", date: "12/04/2024", courseName: "Python Basic", paymentMethod: "MoMo", amount: "$95.00" },
  { id: "#PY-001", date: "12/04/2024", courseName: "Python Basic", paymentMethod: "ZaloPay", amount: "$95.00" },
  { id: "#PY-001", date: "12/04/2024", courseName: "Python Basic", paymentMethod: "MoMo", amount: "$95.00" },
  { id: "#PY-001", date: "12/04/2024", courseName: "Python Basic", paymentMethod: "MoMo", amount: "$95.00" },
  { id: "#PY-001", date: "12/04/2024", courseName: "Python Basic", paymentMethod: "MoMo", amount: "$95.00" },
];

const Transactions = ({ studentId }: TransactionsProps) => {
  return (
    <div className="rounded-xl bg-white p-8">
      <h2 className="mb-6 font-poppins text-xl font-bold text-[#000000]">Transactions</h2>

      {/* Search */}
      <div className="mb-6">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search User"
            className="w-full rounded-lg border border-[#E8E8F4] bg-white py-2 pl-10 pr-4 font-poppins text-sm text-[#000000] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-[#E8E8F4]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#F8F9FA]">
              <th className="px-6 py-4 text-left font-poppins text-sm font-medium text-[#000000]">Order ID</th>
              <th className="px-6 py-4 text-left font-poppins text-sm font-medium text-[#000000]">Date</th>
              <th className="px-6 py-4 text-left font-poppins text-sm font-medium text-[#000000]">Course Name</th>
              <th className="px-6 py-4 text-left font-poppins text-sm font-medium text-[#000000]">Payment Method</th>
              <th className="px-6 py-4 text-left font-poppins text-sm font-medium text-[#000000]">Amount</th>
            </tr>
          </thead>
          <tbody>
            {mockTransactions.map((transaction, index) => (
              <tr key={index} className="border-t border-[#E8E8F4]">
                <td className="px-6 py-4 font-poppins text-sm text-[#000000]">{transaction.id}</td>
                <td className="px-6 py-4 font-poppins text-sm text-[#000000]">{transaction.date}</td>
                <td className="px-6 py-4 font-poppins text-sm text-[#000000]">{transaction.courseName}</td>
                <td className="px-6 py-4 font-poppins text-sm text-[#000000]">{transaction.paymentMethod}</td>
                <td className="px-6 py-4 font-poppins text-sm text-[#000000]">{transaction.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-center gap-2">
        <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E8E8F4] bg-white font-poppins text-sm text-[#333931] hover:bg-[#F5F7FA]">&lt;</button>
        <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#3B82F6] font-poppins text-sm text-white">1</button>
        <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E8E8F4] bg-white font-poppins text-sm text-[#333931] hover:bg-[#F5F7FA]">2</button>
        <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E8E8F4] bg-white font-poppins text-sm text-[#333931] hover:bg-[#F5F7FA]">3</button>
        <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E8E8F4] bg-white font-poppins text-sm text-[#333931] hover:bg-[#F5F7FA]">&gt;</button>
      </div>
    </div>
  );
};

export default Transactions;
