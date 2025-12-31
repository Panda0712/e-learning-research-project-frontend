import { useState } from 'react';
import { ChevronLeft, ChevronRight, Eye, X } from 'lucide-react';

import { MOCK_TRANSACTIONS } from '../../../../utils/mockData'; 
import type { Transaction } from '../../../../types/transaction.type'; 

// --- CẤU HÌNH MÀU SẮC ---
const COLORS = {
    successBg: '#D7FFE7',
    successText: '#087B2E',
    refundBg: '#FFF9C4', 
    refundText: '#B45309',
    failedBg: '#FFE5E5',
    failedText: '#FF0000',
};

const StatusBadge = ({ status }: { status: string }) => {
    let bg = '';
    let text = '';
    let dotColor = '';

    switch (status) {
        case 'Successful':
            bg = COLORS.successBg;
            text = COLORS.successText;
            dotColor = 'bg-[#087B2E]';
            break;
        case 'Refunded':
            bg = COLORS.refundBg;
            text = COLORS.refundText;
            dotColor = 'bg-yellow-500';
            break;
        case 'Failed':
            bg = COLORS.failedBg;
            text = COLORS.failedText;
            dotColor = 'bg-red-500';
            break;
        default:
            bg = '#F3F4F6';
            text = '#374151';
            dotColor = 'bg-gray-500';
    }

    return (
        <span style={{ backgroundColor: bg, color: text }} className="px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-2 min-w-[100px] justify-center">
            <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
            {status}
        </span>
    );
};

const DashboardTransactions = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const totalPages = Math.ceil(MOCK_TRANSACTIONS.length / itemsPerPage);
    const currentData = MOCK_TRANSACTIONS.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);

    return (
        <div className="w-full min-h-screen bg-white p-6 md:p-8 font-sans">
            <h1 className="text-3xl font-bold text-black mb-8 font-[Inter]">Transactions</h1>

            <div className="bg-white rounded-xl overflow-hidden min-h-[500px]">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#F8F9FA] text-gray-700 text-xs uppercase font-bold tracking-wider">
                        <tr>
                            <th className="p-4 pl-6">Transaction ID</th>
                            <th className="p-4">Student Name</th>
                            <th className="p-4">Course Title</th>
                            <th className="p-4">Amount</th>
                            <th className="p-4">Payout Method</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-center"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm font-[Poppins]">
                        {currentData.map((txn) => (
                            <tr key={txn.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 pl-6 text-gray-500 font-medium">{txn.id}</td>
                                <td className="p-4 text-gray-900 font-medium">{txn.studentName}</td>
                                <td className="p-4 text-gray-900">{txn.courseTitle}</td>
                                <td className="p-4 text-gray-900 font-semibold">${txn.amount}</td>
                                <td className="p-4 text-gray-500 max-w-[200px]">
                                    <div className="flex flex-col">
                                        <span>{txn.payoutMethod.split(' - ')[0]} - {txn.payoutMethod.split(' - ')[1]}</span>
                                        <span className="text-xs text-gray-400 mt-0.5">{txn.payoutMethod.split(' - ')[2]}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-gray-500">{txn.date}</td>
                                <td className="p-4">
                                    <StatusBadge status={txn.status} />
                                </td>
                                <td className="p-4 text-center">
                                    <button 
                                        onClick={() => setSelectedTxn(txn)}
                                        className="p-2 text-orange-800 bg-orange-100 rounded-full hover:bg-orange-200 transition"
                                    >
                                        <Eye size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center mt-6">
                <nav className="flex items-center gap-2">
                    <button onClick={() => setCurrentPage(c => Math.max(c - 1, 1))} disabled={currentPage === 1} className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                        <ChevronLeft size={16} />
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                        <button 
                            key={i} 
                            onClick={() => setCurrentPage(i + 1)}
                            className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition ${currentPage === i + 1 ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button onClick={() => setCurrentPage(c => Math.min(c + 1, totalPages))} disabled={currentPage === totalPages} className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                        <ChevronRight size={16} />
                    </button>
                </nav>
            </div>

            {selectedTxn && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 backdrop-blur-[2px] p-4 animate-in fade-in duration-200 font-[Poppins]">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative animate-in zoom-in-95 duration-200 p-8">
                        <button 
                            onClick={() => setSelectedTxn(null)}
                            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition"
                        >
                            <X size={24} />
                        </button>

                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-black">Transaction Details {selectedTxn.id}</h2>
                        </div>

                        <div className="flex flex-col gap-1 mb-6 pb-4 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <span className="text-gray-600 font-medium">Status:</span>
                                <span className={`font-medium ${selectedTxn.status === 'Successful' ? 'text-green-600' : selectedTxn.status === 'Failed' ? 'text-red-600' : 'text-yellow-600'}`}>
                                    [{selectedTxn.status}]
                                </span>
                            </div>
                            <div className="text-sm text-gray-500">
                                Date: {selectedTxn.date} - 14:30 PM
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">FROM:</h3>
                                <p className="text-base font-bold text-gray-900">{selectedTxn.studentName}</p>
                                <p className="text-sm text-gray-500">({selectedTxn.studentEmail})</p>
                            </div>

                            <div>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">PURCHASED:</h3>
                                <p className="text-gray-800">
                                    <span className="font-semibold">{selectedTxn.courseTitle}</span> (Instructor: {selectedTxn.instructorName})
                                </p>
                            </div>

                            <div>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">PAYMENT INFO:</h3>
                                <div className="space-y-2 text-sm text-gray-700">
                                    <div className="flex justify-between">
                                        <span>Method:</span>
                                        <span className="font-medium">{selectedTxn.paymentMethodDetail || 'MoMo'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Bank Ref:</span>
                                        <span className="font-medium">{selectedTxn.bankRef || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between pt-2 border-t border-dashed border-gray-200 mt-2">
                                        <span>Subtotal:</span>
                                        <span>${selectedTxn.subtotal || selectedTxn.amount}</span>
                                    </div>
                                    <div className="flex justify-between text-red-500">
                                        <span>Discount:</span>
                                        <span>-${selectedTxn.discount || 0}.00 {selectedTxn.discountCode ? `(Code: ${selectedTxn.discountCode})` : ''}</span>
                                    </div>
                                    <div className="flex justify-between pt-2 mt-2 border-t border-gray-200 text-base font-bold text-black">
                                        <span>TOTAL PAID:</span>
                                        <span>${selectedTxn.amount}.00</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardTransactions;
