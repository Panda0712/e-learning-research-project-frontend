import { useState } from 'react';
import { 
  Settings, 
  MoreHorizontal, 
  Check, 
  X, 
  ChevronLeft, 
  ChevronRight,  
} from 'lucide-react';

interface PayoutItem {
  id: number;
  avatar: string;
  name: string;
  email: string;
  method: string;
  amount: number;
  date: string;
  status: 'Pending' | 'Paid' | 'Rejected';
  transactionId?: string; //History
  reason?: string; //History
}

const DashboardPayouts = () => {
  const [activeTab, setActiveTab] = useState<'requests' | 'history'>('requests');

  const [showConfigModal, setShowConfigModal] = useState(false);
  const [commissionRate, setCommissionRate] = useState('5%');

  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionType, setActionType] = useState<'paid' | 'reject' | null>(null);
  const [selectedItem, setSelectedItem] = useState<PayoutItem | null>(null);

  const requestsData: PayoutItem[] = Array(8).fill(null).map((_, i) => ({
    id: i + 1,
    avatar: '/public/avatar1.png',
    name: 'Nguyen Van A',
    email: 'A@gmail.com',
    method: 'MoMo - 0987654321 - NGUYEN VAN A',
    amount: 100,
    date: 'June 15, 2025',
    status: 'Pending'
  }));

  const historyData: PayoutItem[] = [
    { ...requestsData[0], id: 101, status: 'Paid', transactionId: '#TXN-192837' },
    { ...requestsData[1], id: 102, status: 'Rejected', reason: 'Invalid Bank Account' },
    { ...requestsData[2], id: 103, status: 'Paid', transactionId: '#TXN-192838' },
  ];

  const toggleMenu = (id: number) => {
    if (openMenuId === id) setOpenMenuId(null);
    else setOpenMenuId(id);
  };

  const handleActionClick = (item: PayoutItem, type: 'paid' | 'reject') => {
    setSelectedItem(item);
    setActionType(type);
    setShowConfirmModal(true);
    setOpenMenuId(null); 
  };

  const confirmAction = () => {
    alert(`Completed: ${actionType?.toUpperCase()} for user ${selectedItem?.name}`);
    setShowConfirmModal(false);
    setSelectedItem(null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-poppins relative" onClick={() => setOpenMenuId(null)}>
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Payouts</h1>

        <div className="relative">
            {/* nút bánh răng */}
            <button 
              onClick={(e) => { e.stopPropagation(); setShowConfigModal(!showConfigModal); }}
              className={`p-2 rounded-full transition-colors ${showConfigModal ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200 text-gray-600'}`}
            >
              <Settings size={24} />
            </button>
            {/* Thông báo của commission */}
            {showConfigModal && (
                <div className="absolute right-0 top-full mt-2 z-50 w-[350px] bg-white rounded-xl shadow-2xl border border-gray-100 animate-scale-up p-6 origin-top-right">
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
                            Save
                        </button>
                    </div>
                </div>
            )}
        </div>
      </div>

      {/* tab request/ history */}
      <div className="flex gap-8 border-b border-gray-200 mb-6">
        <button 
          onClick={() => setActiveTab('requests')}
          className={`pb-3 font-medium text-sm transition-colors ${activeTab === 'requests' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
        >
          Requests
        </button>
        <button 
           onClick={() => setActiveTab('history')}
           className={`pb-3 font-medium text-sm transition-colors ${activeTab === 'history' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
        >
          History
        </button>
      </div>

      {/* table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              {activeTab === 'requests' ? (
                <>
                  <th className="p-4 text-sm font-semibold text-gray-600">Avatar</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">Lecturer</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">Payout Method</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">Amount</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">Date</th>
                  <th className="p-4 text-sm font-semibold text-gray-600 text-center">Status</th>
                  <th className="p-4 text-sm font-semibold text-gray-600"></th>
                </>
              ) : (
                <>
                  <th className="p-4 text-sm font-semibold text-gray-600">Lecturer</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">Amount</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">Date</th>
                  <th className="p-4 text-sm font-semibold text-gray-600 text-center">Status</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">Transaction / Reason</th>
                </>
              )}
            </tr>
          </thead>
          
          <tbody>
            {(activeTab === 'requests' ? requestsData : historyData).map((item, index) => (
              <tr key={index} className="border-b border-gray-50 hover:bg-gray-50">
                {activeTab === 'requests' && (
                  <td className="p-4">
                    <img src={item.avatar} alt="Ava" className="w-10 h-10 rounded-full object-cover" />
                  </td>
                )}
                
                <td className="p-4">
                    <div className="font-bold text-gray-800 text-sm">{item.name}</div>
                    <div className="text-xs text-gray-500">Email: {item.email}</div>
                </td>

                {activeTab === 'requests' && (
                  <td className="p-4 text-sm text-gray-700 max-w-[200px]">
                    {item.method}
                  </td>
                )}

                <td className="p-4 font-bold text-gray-800">${item.amount}</td>
                <td className="p-4 text-sm text-gray-600">{item.date}</td>

                {/* Status */}
                <td className="p-4 text-center">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold 
                    ${item.status === 'Pending' ? 'bg-[#FFF9C4] text-[#FBC02D]' : ''}
                    ${item.status === 'Paid' ? 'bg-green-100 text-green-600' : ''}
                    ${item.status === 'Rejected' ? 'bg-red-100 text-red-600' : ''}
                  `}>
                    • {item.status}
                  </span>
                </td>

                {/* action or transaction id */}
                <td className="p-4">
                  {activeTab === 'requests' ? (
                    <div className="relative">
                        {/* nút 3 chấm */}
                        <button 
                            onClick={(e) => { e.stopPropagation(); toggleMenu(item.id); }}
                            className="p-1 hover:bg-gray-200 rounded text-gray-500"
                        >
                            <MoreHorizontal size={20} />
                        </button>

                        {/* Dropdown  */}
                        {openMenuId === item.id && (
                            <div className="absolute right-0 top-8 w-32 bg-white rounded-lg shadow-xl border border-gray-100 z-10 overflow-hidden animate-fade-in">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleActionClick(item, 'paid'); }}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 font-bold"
                                >
                                    <Check size={16} /> Paid
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleActionClick(item, 'reject'); }}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 font-bold"
                                >
                                    <X size={16} /> Reject
                                </button>
                            </div>
                        )}
                    </div>
                  ) : (
                    <div className="text-sm">
                        {item.status === 'Paid' 
                            ? <span className="text-gray-600 font-medium">{item.transactionId}</span>
                            : <span className="text-red-500 font-medium">{item.reason}</span>
                        }
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-center p-6 gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded border hover:bg-gray-100"><ChevronLeft size={16}/></button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-black text-white text-sm font-bold">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border hover:bg-gray-100 text-sm">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border hover:bg-gray-100 text-sm">3</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border hover:bg-gray-100"><ChevronRight size={16}/></button>
        </div>
      </div>

      {/* pop up xác nhận */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10">
            <div className="bg-white rounded-xl p-6 w-[350px] shadow-2xl text-center animate-scale-up border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {actionType === 'paid' ? 'Confirm Payment' : 'Confirm Rejection'}
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                    {actionType === 'paid' 
                        ? `Are you sure you want to verify payment for ${selectedItem?.name}?`
                        : `Are you sure you want to REJECT request from ${selectedItem?.name}?`
                    }
                </p>

                <div className="flex gap-3">
                    <button 
                        onClick={() => setShowConfirmModal(false)}
                        className="flex-1 py-2 rounded-lg border border-gray-200 text-gray-600 font-bold hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={confirmAction}
                        className={`flex-1 py-2 rounded-lg font-bold text-white shadow-sm
                            ${actionType === 'paid' 
                                ? 'bg-green-500 hover:bg-green-600' 
                                : 'bg-red-500 hover:bg-red-600'
                            }`}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default DashboardPayouts;