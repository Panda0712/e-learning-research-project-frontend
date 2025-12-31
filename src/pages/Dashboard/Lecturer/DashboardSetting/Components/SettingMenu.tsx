import React from 'react';
import { User, Bell, CreditCard, LogOut, Camera } from 'lucide-react';

// Định nghĩa kiểu dữ liệu truyền vào
interface SettingsMenuProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({ activeTab, setActiveTab }) => {
  
  // Hàm tạo nút menu cho gọn code
  const renderMenuItem = (id: string, label: string, Icon: React.ElementType, isDanger = false) => (
    <button 
        onClick={() => setActiveTab(id)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors 
        ${activeTab === id 
            ? 'text-blue-600 bg-blue-50' // Style khi đang chọn
            : isDanger 
                ? 'text-gray-600 hover:bg-red-50 hover:text-red-600 mt-4' // Style nút Logout
                : 'text-gray-600 hover:bg-gray-50' // Style bình thường
        }`}
    >
        <Icon size={18} /> {label}
    </button>
  );

  return (
    <div className="w-full lg:w-1/4 bg-white rounded-xl shadow-sm p-6 h-fit">
        <div className="flex flex-col items-center mb-8 relative">
            <div className="relative">
                <img 
                    src="/public/avatar1.png" 
                    alt="Profile" 
                    className="w-24 h-24 rounded-full object-cover bg-blue-100"
                />
                <button className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow border border-gray-200 text-blue-600 hover:text-blue-800">
                    <Camera size={16} />
                </button>
            </div>
            <h3 className="font-bold text-lg mt-4">Bang</h3>
            <p className="text-xs text-gray-400">No contact</p>
            <p className="text-xs text-gray-400">Last update 12-11-2025</p>
        </div>

        <nav className="space-y-1">
            {renderMenuItem('account', 'Account & Security', User)}
            {renderMenuItem('notification', 'Notification Settings', Bell)}
            {renderMenuItem('payout', 'Payout Details', CreditCard)}
            
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 mt-4">
                <LogOut size={18} /> Logout
            </button>
        </nav>
    </div>
  );
};

export default SettingsMenu;