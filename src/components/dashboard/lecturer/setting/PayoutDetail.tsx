import React, { useState, useEffect, useCallback } from 'react';
import { CreditCard, Trash2, PlusCircle, CheckCircle } from 'lucide-react';
import { payoutAccountService } from '../../../../apis/payoutAccount';
import { useSelector } from 'react-redux'; 

interface PayoutAccount {
  _id?: string;
  id?: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  isDefault?: boolean;
}

interface RootState {
  activeUser?: {
    user?: {
      id: string | number;
    };
  };
}

const PayoutDetail = () => {
  const currentUser = useSelector((state: RootState) => state.activeUser?.user);

  const [accounts, setAccounts] = useState<PayoutAccount[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAccount, setNewAccount] = useState({
    bankName: '',
    accountNumber: '',
    accountName: ''
  });

  const fetchAccounts = useCallback(async () => {
    if (!currentUser?.id) return;
    try {
      setLoading(true);
      const data = await payoutAccountService.getAccountsAPI(currentUser.id);
      setAccounts(Array.isArray(data) ? data : data?.data || []);
    } catch (error) {
      console.error("Lỗi tải danh sách tài khoản:", error);
    } finally {
      setLoading(false);
    }
  }, [currentUser?.id]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]); 

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        lecturerId: currentUser?.id,
        ...newAccount,
        isDefault: accounts.length === 0 
      };

      await payoutAccountService.createAccountAPI(payload);
      alert("Thêm tài khoản thành công!");
      
      setNewAccount({ bankName: '', accountNumber: '', accountName: '' });
      setShowAddForm(false);
      fetchAccounts(); 
    } catch (error) {
      console.error("Lỗi thêm tài khoản:", error);
      alert("Thêm tài khoản thất bại!");
    }
  };

  const handleSetDefault = async (accountId: string | number | undefined) => {
    if (!accountId) return;
    try {
      await payoutAccountService.setDefaultAccountAPI(accountId);
      fetchAccounts(); 
    } catch (error) {
      console.error("Lỗi cập nhật mặc định:", error);
      alert("Lỗi khi đổi thẻ mặc định!");
    }
  };

  const handleDelete = async (accountId: string | number | undefined) => {
    if (!accountId) return;
    if (!window.confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) return;
    try {
      await payoutAccountService.deleteAccountAPI(accountId);
      alert("Xóa tài khoản thành công!");
      fetchAccounts(); 
    } catch (error) {
      console.error("Lỗi xóa tài khoản:", error);
      alert("Không thể xóa thẻ này!");
    }
  };

  if (loading) return <div className="text-gray-500 italic p-6">Đang tải tài khoản ngân hàng...</div>;

  return (
    <div className="font-poppins">
      <h2 className="text-xl font-bold text-gray-800 mb-6 uppercase">Payout Details</h2>
      <p className="text-sm text-gray-500 mb-8">
        Quản lý các tài khoản ngân hàng để nhận tiền thanh toán từ nền tảng.
      </p>

      <div className="space-y-4 mb-8">
        {accounts.length === 0 ? (
          <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-500 border border-dashed border-gray-300">
            Bạn chưa thêm tài khoản nhận tiền nào.
          </div>
        ) : (
          accounts.map((acc: PayoutAccount) => (
            <div key={acc._id || acc.id} className="flex items-center justify-between p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-blue-300 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                  <CreditCard size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{acc.bankName}</h4>
                  <p className="text-sm text-gray-500">STK: **** {acc.accountNumber?.slice(-4)} - {acc.accountName}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {acc.isDefault ? (
                  <span className="flex items-center gap-1 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full font-medium">
                    <CheckCircle size={14} /> Mặc định
                  </span>
                ) : (
                  <button 
                    onClick={() => handleSetDefault(acc._id || acc.id)}
                    className="text-sm text-gray-500 hover:text-blue-600 font-medium px-3 py-1"
                  >
                    Make Default
                  </button>
                )}
                <button 
                  onClick={() => handleDelete(acc._id || acc.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {!showAddForm ? (
        <button 
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700"
        >
          <PlusCircle size={20} /> Thêm tài khoản ngân hàng mới
        </button>
      ) : (
        <form onSubmit={handleAddAccount} className="bg-gray-50 p-6 rounded-xl border border-gray-200 mt-6">
          <h3 className="font-bold text-gray-800 mb-4">Thêm thẻ mới</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm text-gray-500 block mb-1">Tên Ngân hàng</label>
              <input required type="text" value={newAccount.bankName} onChange={e => setNewAccount({...newAccount, bankName: e.target.value})} placeholder="VD: Vietcombank" className="w-full border rounded-lg p-2.5 text-sm focus:border-blue-500 outline-none" />
            </div>
            <div>
              <label className="text-sm text-gray-500 block mb-1">Số tài khoản</label>
              <input required type="text" value={newAccount.accountNumber} onChange={e => setNewAccount({...newAccount, accountNumber: e.target.value})} placeholder="Nhập số tài khoản" className="w-full border rounded-lg p-2.5 text-sm focus:border-blue-500 outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-gray-500 block mb-1">Tên chủ tài khoản</label>
              <input required type="text" value={newAccount.accountName} onChange={e => setNewAccount({...newAccount, accountName: e.target.value})} placeholder="VD: NGUYEN VAN A" className="w-full border rounded-lg p-2.5 text-sm focus:border-blue-500 outline-none uppercase" />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">Lưu tài khoản</button>
            <button type="button" onClick={() => setShowAddForm(false)} className="px-5 py-2 border border-gray-300 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-100">Hủy</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PayoutDetail;