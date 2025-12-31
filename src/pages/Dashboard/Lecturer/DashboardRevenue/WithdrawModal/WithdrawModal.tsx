import { Check, ChevronDown, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import {
  MOCK_ACCOUNTS,
  PRESET_AMOUNTS,
  type Account,
} from "../../../../../utils/mockDataAccounts";

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  onClose,
  availableBalance,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [amountStr, setAmountStr] = useState<string>("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedAccount(null);
      setAmountStr("");
      setIsDropdownOpen(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePresetClick = (value: number) => {
    setAmountStr(value.toString());
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmountStr(value);
    }
  };

  const isFormValid =
    selectedAccount !== null && amountStr !== "" && Number(amountStr) > 0;

  const handleWithdrawSubmit = () => {
    if (isFormValid) {
      alert(`Withdraw option: ${amountStr} to ${selectedAccount?.cardNumber}`);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[500px] overflow-hidden transform transition-all scale-100 relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-1 rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Withdraw</h2>
          <div className="flex justify-between items-center mb-8">
            <span className="text-gray-500 text-lg">Available balance</span>
            <span className="text-blue-700 text-2xl font-bold">
              ${availableBalance.toFixed(2)}
            </span>
          </div>

          <div className="relative mb-4" ref={dropdownRef}>
            <div
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full h-14 px-4 border border-gray-200 rounded-xl flex items-center justify-between cursor-pointer hover:border-blue-500 transition-colors bg-white"
            >
              <span
                className={`text-lg ${
                  selectedAccount
                    ? "text-gray-900 font-medium"
                    : "text-gray-400"
                }`}
              >
                {selectedAccount
                  ? `${
                      selectedAccount.bankName
                        ? selectedAccount.bankName + " "
                        : ""
                    }${selectedAccount.cardNumber}`
                  : "Choose account/ card"}
              </span>
              <ChevronDown size={20} className="text-gray-400" />
            </div>

            {isDropdownOpen && (
              <div className="absolute z-10 mt-2 w-full bg-white border border-gray-100 rounded-2xl shadow-lg py-2 max-h-64 overflow-y-auto">
                <div className="px-4 py-2 text-sm font-bold text-gray-900">
                  Choose account:
                </div>
                {MOCK_ACCOUNTS.map((acc) => (
                  <div
                    key={acc.id}
                    onClick={() => {
                      setSelectedAccount(acc);
                      setIsDropdownOpen(false);
                    }}
                    className="px-4 py-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
                  >
                    <span
                      className={`text-lg ${
                        selectedAccount?.id === acc.id
                          ? "text-blue-700 font-medium"
                          : "text-gray-600"
                      }`}
                    >
                      {acc.bankName ? `${acc.bankName} ` : ""}
                      {acc.cardNumber}
                    </span>
                    {selectedAccount?.id === acc.id && (
                      <Check size={20} className="text-blue-700" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* --- AMOUNT INPUT --- */}
          <div className="relative mb-6">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg font-medium">
              $
            </span>
            <input
              type="text"
              value={amountStr}
              onChange={handleAmountChange}
              placeholder="Enter amount"
              className="w-full h-14 pl-8 pr-4 border border-gray-200 rounded-xl text-lg font-medium focus:outline-none focus:border-blue-500 transition-colors placeholder:text-gray-300"
            />
          </div>

          <p className="text-gray-900 font-medium mb-4">Choose amount</p>
          <div className="grid grid-cols-3 gap-4 mb-8">
            {PRESET_AMOUNTS.map((amount) => {
              const isSelected = Number(amountStr) === amount;
              return (
                <button
                  key={amount}
                  onClick={() => handlePresetClick(amount)}
                  className={`h-14 rounded-xl font-bold text-lg transition-all duration-200 border
                    ${
                      isSelected
                        ? "bg-[#3730a3] text-white border-[#3730a3] shadow-md" // Active state (Purple)
                        : "bg-white text-gray-500 border-gray-200 hover:border-blue-500 hover:text-blue-600" // Inactive state
                    }
                  `}
                >
                  ${amount}
                </button>
              );
            })}
          </div>

          <button
            disabled={!isFormValid}
            onClick={handleWithdrawSubmit}
            className={`w-full h-14 rounded-xl font-bold text-lg transition-all duration-200
                ${
                  isFormValid
                    ? "bg-[#3730a3] text-white hover:bg-[#2e2887] shadow-md cursor-pointer" // Enabled state (Purple)
                    : "bg-gray-100 text-gray-300 cursor-not-allowed" // Disabled state (Gray)
                }
            `}
          >
            Withdraw
          </button>
        </div>
      </div>
    </div>
  );
};

export default WithdrawModal;
