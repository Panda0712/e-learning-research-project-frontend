/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from 'react';
import { CreditCard, Trash2, PlusCircle, CheckCircle } from 'lucide-react';
import { payoutAccountService } from '../../../../apis/payoutAccount';
import { useAppSelector } from "../../../../redux/hooks";
import { selectCurrentUser } from "../../../../redux/activeUser/activeUserSlice";
import { toast } from "react-toastify";

interface PayoutAccount {
  id: string | number;
  cardType?: string;
  cardNumber?: string;
  cardHolderName?: string;
  isDefault?: boolean;
}

const PayoutDetail = () => {
  const currentUser = useAppSelector(selectCurrentUser);

  const [accounts, setAccounts] = useState<PayoutAccount[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAccount, setNewAccount] = useState({
    bankName: '',
    accountNumber: '',
    accountName: '',
  });

  const fetchAccounts = useCallback(async () => {
    if (!currentUser?.id) return;
    try {
      setLoading(true);
      const data = await payoutAccountService.getAccountsAPI(currentUser?.id);
      setAccounts(Array.isArray(data) ? data : data?.data || []);
    } catch (error:any) {
      toast.error(error?.message || "Failed to load payout accounts data!");
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
        cardType: newAccount.bankName,
        cardNumber: newAccount.accountNumber,
        cardHolderName: newAccount.accountName,
        isDefault: accounts.length === 0,
      };

      await payoutAccountService.createAccountAPI(payload);
      toast.success("Added account successfully!");
      
      setNewAccount({ bankName: '', accountNumber: '', accountName: '' });
      setShowAddForm(false);
      fetchAccounts();
    } catch (error:any) {
      toast.error(error?.message || "Failed to create new account! Please try again later!");
    }
  };

  const handleSetDefault = async (accountId: string | number | undefined) => {
    if (!accountId || !currentUser?.id) return;
    try {
      await payoutAccountService.setDefaultAccountAPI(accountId, currentUser.id);
      fetchAccounts();
    } catch (error:any) {
      toast.error(error?.message || "Failed to updated default account data!");
    }
  };

  const handleDelete = async (accountId: string | number | undefined) => {
    if (!accountId) return;
    try {
      await payoutAccountService.deleteAccountAPI(accountId);
      toast.success("Deleted account successfully!");
      fetchAccounts();
    } catch (error:any) {
      toast.error(error?.message || "Failed to delete account!");
    }
  };

  if (loading) return <div className="text-gray-500 italic p-6">Loading accounts data...</div>;

  return (
    <div className="font-poppins">
      <h2 className="text-xl font-bold text-gray-800 mb-6 uppercase">Payout Details</h2>
      <p className="text-sm text-gray-500 mb-8">
        Manage bank accounts to receive money from EduLearn.
      </p>

      <div className="space-y-4 mb-8">
        {accounts.length === 0 ? (
          <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-500 border border-dashed border-gray-300">
            You haven't added any account yet.
          </div>
        ) : (
          accounts.map((acc: PayoutAccount) => (
            <div key={acc.id} className="flex items-center justify-between p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-blue-300 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                  <CreditCard size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{acc.cardType || "Bank account"}</h4>
                  <p className="text-sm text-gray-500">Bank account: **** {acc.cardNumber?.slice(-4)} - {acc.cardHolderName}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {acc.isDefault ? (
                  <span className="flex items-center gap-1 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full font-medium">
                    <CheckCircle size={14} /> Default
                  </span>
                ) : (
                  <button 
                    onClick={() => handleSetDefault(acc.id)}
                    className="text-sm text-gray-500 hover:text-blue-600 font-medium px-3 py-1"
                  >
                    Make Default
                  </button>
                )}
                <button 
                  onClick={() => handleDelete(acc.id)}
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
          <PlusCircle size={20} /> Add new bank account
        </button>
      ) : (
        <form onSubmit={handleAddAccount} className="bg-gray-50 p-6 rounded-xl border border-gray-200 mt-6">
          <h3 className="font-bold text-gray-800 mb-4">Add new card</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm text-gray-500 block mb-1">Bank name</label>
              <input required type="text" value={newAccount.bankName} onChange={e => setNewAccount({...newAccount, bankName: e.target.value})} placeholder="EX: Vietcombank" className="w-full border rounded-lg p-2.5 text-sm focus:border-blue-500 outline-none" />
            </div>
            <div>
              <label className="text-sm text-gray-500 block mb-1">Bank account</label>
              <input required type="text" value={newAccount.accountNumber} onChange={e => setNewAccount({...newAccount, accountNumber: e.target.value})} placeholder="Enter bank account" className="w-full border rounded-lg p-2.5 text-sm focus:border-blue-500 outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-gray-500 block mb-1">Bank account name</label>
              <input required type="text" value={newAccount.accountName} onChange={e => setNewAccount({...newAccount, accountName: e.target.value})} placeholder="EX: NGUYEN VAN A" className="w-full border rounded-lg p-2.5 text-sm focus:border-blue-500 outline-none uppercase" />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">Save account</button>
            <button type="button" onClick={() => setShowAddForm(false)} className="px-5 py-2 border border-gray-300 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-100">Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PayoutDetail;
